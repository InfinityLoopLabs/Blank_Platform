import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ScyllaConnectorModule, ScyllaRepository } from '@infinityloop.labs/nest-connectors';
import { resolve } from 'path';

import { ConfigModule, EnvConfigRepository } from '../platform/modules/config/transport';
import { printStatus, readMigrationFiles } from './shared/migration-files';
import { splitStatements } from './shared/split-statements';

type Command = 'up' | 'status';

type AppliedMigration = {
  id: string;
  checksum: string;
};

const JOURNAL_TABLE = 'schema_migrations_scylla';
const MIGRATIONS_DIR = resolve(process.cwd(), 'src/database/migrations/scylla');

@Injectable()
class ScyllaMigrationService {
  constructor(
    private readonly scylla: ScyllaRepository,
    private readonly env: EnvConfigRepository,
  ) {}

  async run(command: Command): Promise<void> {
    const migrations = readMigrationFiles(MIGRATIONS_DIR, '.cql');
    const keyspace = this.readMigrationKeyspace();

    await this.ensureJournal(keyspace);
    const applied = await this.readAppliedMigrations(keyspace);
    const mismatchIds = migrations
      .filter((migration) => applied.has(migration.id) && applied.get(migration.id) !== migration.checksum)
      .map((migration) => migration.id);

    if (command === 'status') {
      const pendingIds = migrations.filter((migration) => !applied.has(migration.id)).map((migration) => migration.id);
      printStatus('scylla', migrations.length, migrations.length - pendingIds.length, pendingIds, mismatchIds);
      if (mismatchIds.length > 0) {
        process.exitCode = 1;
      }
      return;
    }

    if (mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for scylla migrations: ${mismatchIds.join(', ')}`);
    }

    const pending = migrations.filter((migration) => !applied.has(migration.id));
    if (pending.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[scylla] no pending migrations');
      return;
    }

    for (const migration of pending) {
      const startedAt = Date.now();
      const statements = splitStatements(replaceKeyspacePlaceholder(migration.script, keyspace));
      for (const statement of statements) {
        await this.scylla.execute(statement);
      }

      await this.scylla.executePrepared(
        `INSERT INTO ${toQualifiedTable(keyspace, JOURNAL_TABLE)} (id, checksum, applied_at, execution_ms) VALUES (?, ?, ?, ?)`,
        [migration.id, migration.checksum, new Date(), Date.now() - startedAt],
      );

      // eslint-disable-next-line no-console
      console.log(`[scylla] applied ${migration.id}`);
    }

    // eslint-disable-next-line no-console
    console.log(`[scylla] applied ${pending.length} migration(s)`);
  }

  private async ensureJournal(keyspace: string): Promise<void> {
    const keyspaceName = toCqlIdentifier(keyspace);
    const tableName = toQualifiedTable(keyspace, JOURNAL_TABLE);

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

  private async readAppliedMigrations(keyspace: string): Promise<Map<string, string>> {
    const rows = await this.scylla.execute(`SELECT id, checksum FROM ${toQualifiedTable(keyspace, JOURNAL_TABLE)}`);
    const items = rows.map((row) => {
      const rowRecord = row as { id?: unknown; checksum?: unknown; get?: (key: string) => unknown };
      const id = rowRecord.id ?? rowRecord.get?.('id');
      const checksum = rowRecord.checksum ?? rowRecord.get?.('checksum');
      return { id: String(id), checksum: String(checksum) };
    });
    return new Map(items.map((item) => [item.id, item.checksum]));
  }

  private readMigrationKeyspace(): string {
    const value = (this.env.get('SCYLLA_MIGRATIONS_KEYSPACE') ?? this.env.get('SCYLLA_KEYSPACE') ?? 'app').trim();
    return value.length > 0 ? value : 'app';
  }
}

function readCommand(value: string | undefined): Command {
  if (value === 'up' || value === 'status') {
    return value;
  }
  throw new Error(`Unknown command: ${value ?? '<empty>'}. Use: up | status`);
}

function toQualifiedTable(keyspace: string, table: string): string {
  return `${toCqlIdentifier(keyspace)}.${toCqlIdentifier(table)}`;
}

function toCqlIdentifier(value: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid CQL identifier: ${value}`);
  }
  return value;
}

function replaceKeyspacePlaceholder(script: string, keyspace: string): string {
  return script.replaceAll('{{KEYSPACE}}', toCqlIdentifier(keyspace));
}

@Module({
  imports: [
    ConfigModule,
    ScyllaConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        const contactPoints = (env.get('SCYLLA_CONTACT_POINTS') ?? 'localhost:20042')
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        return {
          contactPoints,
          localDataCenter: env.get('SCYLLA_LOCAL_DC') ?? 'datacenter1',
          keyspace: env.get('SCYLLA_KEYSPACE') || undefined,
          username: env.get('SCYLLA_USERNAME') || undefined,
          password: env.get('SCYLLA_PASSWORD') || undefined,
        };
      },
    }),
  ],
  providers: [ScyllaMigrationService],
})
class ScyllaMigrationModule {}

async function bootstrap(): Promise<void> {
  const command = readCommand(process.argv[2]);
  const app = await NestFactory.createApplicationContext(ScyllaMigrationModule, { logger: false });
  try {
    const service = app.get(ScyllaMigrationService);
    await service.run(command);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
