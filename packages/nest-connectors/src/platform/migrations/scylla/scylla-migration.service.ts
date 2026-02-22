import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { resolve } from 'path';

import { ScyllaRepository } from '../../connectors/scylla';
import { MigrationCommand } from '../migration-command';
import { ScyllaMigrationOptions } from './scylla-migration-options';

export const SCYLLA_MIGRATION_OPTIONS = Symbol('SCYLLA_MIGRATION_OPTIONS');

type MigrationPair = {
  id: string;
  upPath: string;
  downPath: string;
  upScript: string;
  downScript: string;
  checksum: string;
};

type MigrationSnapshot = {
  total: number;
  applied: number;
  pendingIds: string[];
  mismatchIds: string[];
  orphanAppliedIds: string[];
};

type ResolvedScyllaMigrationOptions = {
  migrationsDirectory: string;
  journalTable: string;
  upSuffix: string;
  downSuffix: string;
  migrationsKeyspace: string;
  keyspacePlaceholder: string;
};

/**
 * Runs filesystem-based scylla migrations and keeps execution journal in keyspace table.
 */
@Injectable()
export class ScyllaMigrationService {
  private readonly logger = new Logger(ScyllaMigrationService.name);

  constructor(
    private readonly scylla: ScyllaRepository,
    @Inject(SCYLLA_MIGRATION_OPTIONS)
    private readonly options: ResolvedScyllaMigrationOptions,
  ) {}

  /**
   * Entry point for migration commands: inspect status, apply pending, or rollback one.
   */
  async run(command: MigrationCommand): Promise<void> {
    const pairs = readMigrationPairs(
      this.options.migrationsDirectory,
      this.options.upSuffix,
      this.options.downSuffix,
    );
    const pairById = new Map(pairs.map((pair) => [pair.id, pair]));

    await this.ensureJournal(this.options.migrationsKeyspace);
    const applied = await this.readAppliedMap(this.options.migrationsKeyspace);
    const snapshot = this.buildSnapshot(pairs, pairById, applied);

    if (command === 'status') {
      this.logSnapshot(snapshot);
      if (snapshot.mismatchIds.length > 0) {
        throw new Error(`Checksum mismatch for scylla migrations: ${snapshot.mismatchIds.join(', ')}`);
      }
      return;
    }

    if (snapshot.mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for scylla migrations: ${snapshot.mismatchIds.join(', ')}`);
    }

    if (command === 'up') {
      await this.applyPending(
        pairs,
        applied,
        this.options.migrationsKeyspace,
        snapshot.pendingIds.length,
      );
      return;
    }

    await this.rollbackOne(
      pairs,
      applied,
      this.options.migrationsKeyspace,
      snapshot.orphanAppliedIds,
    );
  }

  /**
   * Builds a reconciled view between local migration files and DB journal.
   */
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

  /**
   * Applies pending migrations in filename order and records each run in journal.
   */
  private async applyPending(
    pairs: MigrationPair[],
    applied: Map<string, string>,
    keyspace: string,
    pendingCount: number,
  ): Promise<void> {
    const pendingPairs = pairs.filter((pair) => !applied.has(pair.id));
    if (pendingPairs.length === 0) {
      this.logger.log('no pending migrations');
      return;
    }

    for (const pair of pendingPairs) {
      const startedAt = Date.now();
      const statements = splitStatements(
        replaceKeyspacePlaceholder(pair.upScript, keyspace, this.options.keyspacePlaceholder),
      );
      for (const statement of statements) {
        await this.scylla.execute(statement);
      }

      await this.scylla.executePrepared(
        `INSERT INTO ${toQualifiedTable(keyspace, this.options.journalTable)} (id, checksum, applied_at, execution_ms) VALUES (?, ?, ?, ?)`,
        [pair.id, pair.checksum, new Date(), Date.now() - startedAt],
      );

      this.logger.log(`applied ${pair.id}`);
    }

    this.logger.log(`applied ${pendingCount} migration(s)`);
  }

  /**
   * Rolls back the latest applied local migration (LIFO).
   */
  private async rollbackOne(
    pairs: MigrationPair[],
    applied: Map<string, string>,
    keyspace: string,
    orphanAppliedIds: string[],
  ): Promise<void> {
    if (orphanAppliedIds.length > 0) {
      throw new Error(`Orphan applied scylla migrations exist in DB: ${orphanAppliedIds.join(', ')}`);
    }

    const target = [...pairs].reverse().find((pair) => applied.has(pair.id));
    if (!target) {
      this.logger.log('no applied migrations to rollback');
      return;
    }

    const appliedChecksum = applied.get(target.id);
    if (appliedChecksum !== target.checksum) {
      throw new Error(`Checksum mismatch for scylla migration ${target.id}; rollback aborted`);
    }

    const statements = splitStatements(
      replaceKeyspacePlaceholder(target.downScript, keyspace, this.options.keyspacePlaceholder),
    );
    for (const statement of statements) {
      await this.scylla.execute(statement);
    }

    await this.scylla.executePrepared(
      `DELETE FROM ${toQualifiedTable(keyspace, this.options.journalTable)} WHERE id = ?`,
      [target.id],
    );

    this.logger.log(`rolled back ${target.id}`);
  }

  /**
   * Ensures keyspace and migration journal table exist before command execution.
   */
  private async ensureJournal(keyspace: string): Promise<void> {
    const keyspaceName = toCqlIdentifier(keyspace);
    const tableName = toQualifiedTable(keyspace, this.options.journalTable);

    await this.scylla.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspaceName}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    `);

    await this.scylla.execute(`
      CREATE TABLE IF NOT EXISTS ${tableName}
      (
        id text PRIMARY KEY,
        checksum text,
        applied_at timestamp,
        execution_ms int
      )
    `);
  }

  /**
   * Reads applied migration checksums from scylla journal.
   */
  private async readAppliedMap(keyspace: string): Promise<Map<string, string>> {
    const rows = await this.scylla.execute(
      `SELECT id, checksum FROM ${toQualifiedTable(keyspace, this.options.journalTable)}`,
    );
    const entries = rows.map((row) => {
      const rowRecord = row as { id?: unknown; checksum?: unknown; get?: (key: string) => unknown };
      const id = rowRecord.id ?? rowRecord.get?.('id');
      const checksum = rowRecord.checksum ?? rowRecord.get?.('checksum');
      return [String(id), String(checksum)] as const;
    });

    return new Map(entries);
  }
}

/**
 * Expands optional migration config with deterministic defaults.
 */
export function normalizeScyllaMigrationOptions(
  options: ScyllaMigrationOptions,
): ResolvedScyllaMigrationOptions {
  const keyspace = (options.migrationsKeyspace ?? options.connector.keyspace ?? 'app').trim();

  return {
    migrationsDirectory:
      options.migrationsDirectory ?? resolve(process.cwd(), 'src/migrations/scylla'),
    journalTable: options.journalTable ?? 'schema_migrations_scylla',
    upSuffix: options.upSuffix ?? '.up.cql',
    downSuffix: options.downSuffix ?? '.down.cql',
    migrationsKeyspace: keyspace.length > 0 ? keyspace : 'app',
    keyspacePlaceholder: options.keyspacePlaceholder ?? '{{KEYSPACE}}',
  };
}

/**
 * Loads and validates pairs of up/down migration files from directory.
 */
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

/**
 * Reads file and rejects empty migrations early.
 */
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

/**
 * Splits CQL script by semicolon, while respecting quotes and comments.
 */
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

/**
 * Validates and formats `keyspace.table` for dynamic CQL.
 */
function toQualifiedTable(keyspace: string, table: string): string {
  return `${toCqlIdentifier(keyspace)}.${toCqlIdentifier(table)}`;
}

/**
 * Guards against unsafe identifier interpolation.
 */
function toCqlIdentifier(value: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid CQL identifier: ${value}`);
  }
  return value;
}

/**
 * Replaces keyspace placeholder in migration files with validated keyspace name.
 */
function replaceKeyspacePlaceholder(script: string, keyspace: string, placeholder: string): string {
  return script.replaceAll(placeholder, toCqlIdentifier(keyspace));
}
