import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { resolve } from 'path';

import { PostgresRepository } from '../../connectors/postgres';
import { MigrationCommand } from '../migration-command';
import { PostgresMigrationOptions } from './postgres-migration-options';

export const POSTGRES_MIGRATION_OPTIONS = Symbol('POSTGRES_MIGRATION_OPTIONS');

type MigrationPair = {
  id: string;
  upPath: string;
  downPath: string;
  upScript: string;
  downScript: string;
  checksum: string;
};

type AppliedMigration = {
  id: string;
  checksum: string;
};

type MigrationSnapshot = {
  total: number;
  applied: number;
  pendingIds: string[];
  mismatchIds: string[];
  orphanAppliedIds: string[];
};

type ResolvedPostgresMigrationOptions = {
  migrationsDirectory: string;
  journalTable: string;
  upSuffix: string;
  downSuffix: string;
};

@Injectable()
export class PostgresMigrationService {
  private readonly logger = new Logger(PostgresMigrationService.name);

  constructor(
    private readonly postgres: PostgresRepository,
    @Inject(POSTGRES_MIGRATION_OPTIONS)
    private readonly options: ResolvedPostgresMigrationOptions,
  ) {}

  async run(command: MigrationCommand): Promise<void> {
    const pairs = readMigrationPairs(
      this.options.migrationsDirectory,
      this.options.upSuffix,
      this.options.downSuffix,
    );
    const pairById = new Map(pairs.map((pair) => [pair.id, pair]));

    await this.ensureJournal();
    const applied = await this.readAppliedMap();
    const snapshot = this.buildSnapshot(pairs, pairById, applied);

    if (command === 'status') {
      this.logSnapshot(snapshot);
      if (snapshot.mismatchIds.length > 0) {
        throw new Error(`Checksum mismatch for postgres migrations: ${snapshot.mismatchIds.join(', ')}`);
      }
      return;
    }

    if (snapshot.mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for postgres migrations: ${snapshot.mismatchIds.join(', ')}`);
    }

    if (command === 'up') {
      await this.applyPending(pairs, applied, snapshot.pendingIds.length);
      return;
    }

    await this.rollbackOne(pairs, applied, snapshot.orphanAppliedIds);
  }

  private buildSnapshot(
    pairs: MigrationPair[],
    pairById: Map<string, MigrationPair>,
    applied: Map<string, string>,
  ): MigrationSnapshot {
    const mismatchIds = pairs
      .filter((pair) => applied.has(pair.id) && applied.get(pair.id) !== pair.checksum)
      .map((pair) => pair.id);
    const pendingIds = pairs.filter((pair) => !applied.has(pair.id)).map((pair) => pair.id);
    const appliedIds = pairs.filter((pair) => applied.has(pair.id)).map((pair) => pair.id);
    const orphanAppliedIds = [...applied.keys()]
      .filter((id) => !pairById.has(id))
      .sort((left, right) => left.localeCompare(right));

    return {
      total: pairs.length,
      applied: appliedIds.length,
      pendingIds,
      mismatchIds,
      orphanAppliedIds,
    };
  }

  private logSnapshot(snapshot: MigrationSnapshot): void {
    this.logger.log(
      `status total=${snapshot.total} applied=${snapshot.applied} pending=${snapshot.pendingIds.length}`,
    );
    if (snapshot.pendingIds.length > 0) {
      this.logger.log(`pending: ${snapshot.pendingIds.join(', ')}`);
    }
    if (snapshot.mismatchIds.length > 0) {
      this.logger.warn(`checksum mismatch: ${snapshot.mismatchIds.join(', ')}`);
    }
    if (snapshot.orphanAppliedIds.length > 0) {
      this.logger.warn(`orphan applied in DB: ${snapshot.orphanAppliedIds.join(', ')}`);
    }
  }

  private async applyPending(
    pairs: MigrationPair[],
    applied: Map<string, string>,
    pendingCount: number,
  ): Promise<void> {
    const pendingPairs = pairs.filter((pair) => !applied.has(pair.id));
    if (pendingPairs.length === 0) {
      this.logger.log('no pending migrations');
      return;
    }

    for (const pair of pendingPairs) {
      const startedAt = Date.now();
      await this.postgres.transaction(async (client) => {
        await client.query(pair.upScript);
        await client.query(
          `
            INSERT INTO ${this.options.journalTable} (id, checksum, execution_ms)
            VALUES ($1, $2, $3)
          `,
          [pair.id, pair.checksum, Date.now() - startedAt],
        );
      });
      this.logger.log(`applied ${pair.id}`);
    }

    this.logger.log(`applied ${pendingCount} migration(s)`);
  }

  private async rollbackOne(
    pairs: MigrationPair[],
    applied: Map<string, string>,
    orphanAppliedIds: string[],
  ): Promise<void> {
    if (orphanAppliedIds.length > 0) {
      throw new Error(`Orphan applied postgres migrations exist in DB: ${orphanAppliedIds.join(', ')}`);
    }

    const target = [...pairs].reverse().find((pair) => applied.has(pair.id));
    if (!target) {
      this.logger.log('no applied migrations to rollback');
      return;
    }

    const appliedChecksum = applied.get(target.id);
    if (appliedChecksum !== target.checksum) {
      throw new Error(`Checksum mismatch for postgres migration ${target.id}; rollback aborted`);
    }

    await this.postgres.transaction(async (client) => {
      await client.query(target.downScript);
      await client.query(`DELETE FROM ${this.options.journalTable} WHERE id = $1`, [target.id]);
    });

    this.logger.log(`rolled back ${target.id}`);
  }

  private async ensureJournal(): Promise<void> {
    await this.postgres.execute(`
      CREATE TABLE IF NOT EXISTS ${this.options.journalTable} (
        id TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        execution_ms INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  private async readAppliedMap(): Promise<Map<string, string>> {
    const rows = await this.postgres.query<AppliedMigration>(
      `SELECT id, checksum FROM ${this.options.journalTable}`,
    );
    return new Map(rows.map((item) => [item.id, item.checksum]));
  }
}

export function normalizePostgresMigrationOptions(
  options: PostgresMigrationOptions,
): ResolvedPostgresMigrationOptions {
  return {
    migrationsDirectory:
      options.migrationsDirectory ?? resolve(process.cwd(), 'src/migrations/postgres'),
    journalTable: options.journalTable ?? 'schema_migrations_postgres',
    upSuffix: options.upSuffix ?? '.up.sql',
    downSuffix: options.downSuffix ?? '.down.sql',
  };
}

function readMigrationPairs(directory: string, upSuffix: string, downSuffix: string): MigrationPair[] {
  if (!existsSync(directory)) {
    return [];
  }

  const fileNames = readdirSync(directory);
  const upFileNames = fileNames
    .filter((fileName) => fileName.endsWith(upSuffix))
    .sort((left, right) => left.localeCompare(right));
  const downFileNames = fileNames
    .filter((fileName) => fileName.endsWith(downSuffix))
    .sort((left, right) => left.localeCompare(right));
  const upIds = new Set(upFileNames.map((fileName) => fileName.slice(0, -upSuffix.length)));
  const orphanDownFiles = downFileNames.filter((fileName) => !upIds.has(fileName.slice(0, -downSuffix.length)));

  if (orphanDownFiles.length > 0) {
    throw new Error(`Up migration is missing for down files: ${orphanDownFiles.join(', ')}`);
  }

  return upFileNames.map((upFileName) => {
    const id = upFileName.slice(0, -upSuffix.length);
    const downFileName = `${id}${downSuffix}`;
    const upPath = resolve(directory, upFileName);
    const downPath = resolve(directory, downFileName);

    if (!existsSync(downPath)) {
      throw new Error(`Down migration is missing for ${id}: ${downPath}`);
    }

    const upScript = readFile(upPath);
    const downScript = readFile(downPath);

    return {
      id,
      upPath,
      downPath,
      upScript,
      downScript,
      checksum: sha256(upScript),
    };
  });
}

function readFile(path: string): string {
  const content = readFileSync(path, 'utf8').trim();
  if (content.length === 0) {
    throw new Error(`Migration file is empty: ${path}`);
  }
  return content;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
