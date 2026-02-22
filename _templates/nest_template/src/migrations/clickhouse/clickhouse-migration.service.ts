import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { ClickHouseRepository } from '@infinityloop.labs/nest-connectors';
import { resolve } from 'path';

import { MigrationCommand } from '../migration-command';

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

const JOURNAL_TABLE = 'schema_migrations_clickhouse';
const MIGRATIONS_DIR = resolve(process.cwd(), 'src/migrations/clickhouse');
const UP_SUFFIX = '.up.sql';
const DOWN_SUFFIX = '.down.sql';

@Injectable()
export class ClickHouseMigrationService {
  private readonly logger = new Logger(ClickHouseMigrationService.name);

  constructor(private readonly clickhouse: ClickHouseRepository) {}

  async run(command: MigrationCommand): Promise<void> {
    const pairs = readMigrationPairs(MIGRATIONS_DIR, UP_SUFFIX, DOWN_SUFFIX);
    const pairById = new Map(pairs.map((pair) => [pair.id, pair]));

    await this.ensureJournal();
    const applied = await this.readAppliedMap();
    const snapshot = this.buildSnapshot(pairs, pairById, applied);

    if (command === 'status') {
      this.logSnapshot(snapshot);
      if (snapshot.mismatchIds.length > 0) {
        throw new Error(`Checksum mismatch for clickhouse migrations: ${snapshot.mismatchIds.join(', ')}`);
      }
      return;
    }

    if (snapshot.mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for clickhouse migrations: ${snapshot.mismatchIds.join(', ')}`);
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
      const statements = splitStatements(pair.upScript);
      for (const statement of statements) {
        await this.clickhouse.command(statement);
      }

      await this.clickhouse.insertRows(JOURNAL_TABLE, [
        {
          id: pair.id,
          checksum: pair.checksum,
          applied_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
          execution_ms: Date.now() - startedAt,
        },
      ]);

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
      throw new Error(`Orphan applied clickhouse migrations exist in DB: ${orphanAppliedIds.join(', ')}`);
    }

    const target = [...pairs].reverse().find((pair) => applied.has(pair.id));
    if (!target) {
      this.logger.log('no applied migrations to rollback');
      return;
    }

    const appliedChecksum = applied.get(target.id);
    if (appliedChecksum !== target.checksum) {
      throw new Error(`Checksum mismatch for clickhouse migration ${target.id}; rollback aborted`);
    }

    const statements = splitStatements(target.downScript);
    for (const statement of statements) {
      await this.clickhouse.command(statement);
    }

    await this.clickhouse.command(
      `ALTER TABLE ${JOURNAL_TABLE} DELETE WHERE id = {id:String} SETTINGS mutations_sync = 2`,
      { id: target.id },
    );

    this.logger.log(`rolled back ${target.id}`);
  }

  private async ensureJournal(): Promise<void> {
    await this.clickhouse.command(`
      CREATE TABLE IF NOT EXISTS ${JOURNAL_TABLE}
      (
        id String,
        checksum String,
        applied_at DateTime,
        execution_ms UInt32
      )
      ENGINE = MergeTree
      ORDER BY id
    `);
  }

  private async readAppliedMap(): Promise<Map<string, string>> {
    const rows = await this.clickhouse.queryRows<AppliedMigration>(`SELECT id, checksum FROM ${JOURNAL_TABLE}`);
    return new Map(rows.map((item) => [item.id, item.checksum]));
  }
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

function splitStatements(script: string): string[] {
  const statements: string[] = [];
  let buffer = '';

  let isSingleQuoted = false;
  let isDoubleQuoted = false;
  let isBacktickQuoted = false;
  let isLineComment = false;
  let isBlockComment = false;

  for (let index = 0; index < script.length; index += 1) {
    const current = script[index];
    const next = script[index + 1];

    if (isLineComment) {
      buffer += current;
      if (current === '\n') {
        isLineComment = false;
      }
      continue;
    }

    if (isBlockComment) {
      buffer += current;
      if (current === '*' && next === '/') {
        buffer += next;
        index += 1;
        isBlockComment = false;
      }
      continue;
    }

    if (!isSingleQuoted && !isDoubleQuoted && !isBacktickQuoted) {
      if (current === '-' && next === '-') {
        buffer += current + next;
        index += 1;
        isLineComment = true;
        continue;
      }

      if (current === '/' && next === '*') {
        buffer += current + next;
        index += 1;
        isBlockComment = true;
        continue;
      }
    }

    if (current === '\'' && !isDoubleQuoted && !isBacktickQuoted) {
      isSingleQuoted = !isSingleQuoted;
      buffer += current;
      continue;
    }

    if (current === '"' && !isSingleQuoted && !isBacktickQuoted) {
      isDoubleQuoted = !isDoubleQuoted;
      buffer += current;
      continue;
    }

    if (current === '`' && !isSingleQuoted && !isDoubleQuoted) {
      isBacktickQuoted = !isBacktickQuoted;
      buffer += current;
      continue;
    }

    if (current === ';' && !isSingleQuoted && !isDoubleQuoted && !isBacktickQuoted) {
      const statement = buffer.trim();
      if (statement.length > 0) {
        statements.push(statement);
      }
      buffer = '';
      continue;
    }

    buffer += current;
  }

  const finalStatement = buffer.trim();
  if (finalStatement.length > 0) {
    statements.push(finalStatement);
  }

  return statements;
}
