import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClickHouseConnectorModule, ClickHouseRepository } from '@infinityloop.labs/nest-connectors';
import { resolve } from 'path';

import { ConfigModule, EnvConfigRepository } from '../platform/modules/config/transport';
import { printStatus, readMigrationFiles } from './shared/migration-files';
import { splitStatements } from './shared/split-statements';

type Command = 'up' | 'status';

type AppliedMigration = {
  id: string;
  checksum: string;
};

const JOURNAL_TABLE = 'schema_migrations_clickhouse';
const MIGRATIONS_DIR = resolve(process.cwd(), 'src/migrations/clickhouse');

@Injectable()
class ClickHouseMigrationService {
  constructor(private readonly clickhouse: ClickHouseRepository) {}

  async run(command: Command): Promise<void> {
    const migrations = readMigrationFiles(MIGRATIONS_DIR, '.sql');

    await this.ensureJournal();
    const applied = await this.readAppliedMigrations();
    const mismatchIds = migrations
      .filter((migration) => applied.has(migration.id) && applied.get(migration.id) !== migration.checksum)
      .map((migration) => migration.id);

    if (command === 'status') {
      const pendingIds = migrations.filter((migration) => !applied.has(migration.id)).map((migration) => migration.id);
      printStatus('clickhouse', migrations.length, migrations.length - pendingIds.length, pendingIds, mismatchIds);
      if (mismatchIds.length > 0) {
        process.exitCode = 1;
      }
      return;
    }

    if (mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for clickhouse migrations: ${mismatchIds.join(', ')}`);
    }

    const pending = migrations.filter((migration) => !applied.has(migration.id));
    if (pending.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[clickhouse] no pending migrations');
      return;
    }

    for (const migration of pending) {
      const startedAt = Date.now();
      const statements = splitStatements(migration.script);
      for (const statement of statements) {
        await this.clickhouse.command(statement);
      }

      await this.clickhouse.insertRows(JOURNAL_TABLE, [
        {
          id: migration.id,
          checksum: migration.checksum,
          applied_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
          execution_ms: Date.now() - startedAt,
        },
      ]);

      // eslint-disable-next-line no-console
      console.log(`[clickhouse] applied ${migration.id}`);
    }

    // eslint-disable-next-line no-console
    console.log(`[clickhouse] applied ${pending.length} migration(s)`);
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

  private async readAppliedMigrations(): Promise<Map<string, string>> {
    const rows = await this.clickhouse.queryRows<AppliedMigration>(`SELECT id, checksum FROM ${JOURNAL_TABLE}`);
    return new Map(rows.map((item) => [item.id, item.checksum]));
  }
}

function readCommand(value: string | undefined): Command {
  if (value === 'up' || value === 'status') {
    return value;
  }
  throw new Error(`Unknown command: ${value ?? '<empty>'}. Use: up | status`);
}

@Module({
  imports: [
    ConfigModule,
    ClickHouseConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          url: env.get('CLICKHOUSE_URL') ?? 'http://localhost:20123',
          database: env.get('CLICKHOUSE_DATABASE') || undefined,
          username: env.get('CLICKHOUSE_USER') || undefined,
          password: env.get('CLICKHOUSE_PASSWORD') || undefined,
          requestTimeoutMs: Number(env.get('CLICKHOUSE_TIMEOUT_MS') ?? 5000),
        };
      },
    }),
  ],
  providers: [ClickHouseMigrationService],
})
class ClickHouseMigrationModule {}

async function bootstrap(): Promise<void> {
  const command = readCommand(process.argv[2]);
  const app = await NestFactory.createApplicationContext(ClickHouseMigrationModule, { logger: false });
  try {
    const service = app.get(ClickHouseMigrationService);
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
