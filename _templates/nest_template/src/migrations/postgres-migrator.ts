import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PostgresConnectorModule, PostgresRepository } from '@infinityloop.labs/nest-connectors';
import { resolve } from 'path';

import { ConfigModule, EnvConfigRepository } from '../platform/modules/config/transport';
import { printStatus, readMigrationFiles } from './shared/migration-files';

type Command = 'up' | 'status';

type AppliedMigration = {
  id: string;
  checksum: string;
};

const JOURNAL_TABLE = 'schema_migrations_postgres';
const MIGRATIONS_DIR = resolve(process.cwd(), 'src/migrations/postgres');

@Injectable()
class PostgresMigrationService {
  constructor(private readonly postgres: PostgresRepository) {}

  async run(command: Command): Promise<void> {
    const migrations = readMigrationFiles(MIGRATIONS_DIR, '.sql');

    await this.ensureJournal();
    const applied = await this.readAppliedMigrations();
    const mismatchIds = migrations
      .filter((migration) => applied.has(migration.id) && applied.get(migration.id) !== migration.checksum)
      .map((migration) => migration.id);

    if (command === 'status') {
      const pendingIds = migrations.filter((migration) => !applied.has(migration.id)).map((migration) => migration.id);
      printStatus('postgres', migrations.length, migrations.length - pendingIds.length, pendingIds, mismatchIds);
      if (mismatchIds.length > 0) {
        process.exitCode = 1;
      }
      return;
    }

    if (mismatchIds.length > 0) {
      throw new Error(`Checksum mismatch for postgres migrations: ${mismatchIds.join(', ')}`);
    }

    const pending = migrations.filter((migration) => !applied.has(migration.id));
    if (pending.length === 0) {
      // eslint-disable-next-line no-console
      console.log('[postgres] no pending migrations');
      return;
    }

    for (const migration of pending) {
      const startedAt = Date.now();
      await this.postgres.transaction(async (client) => {
        await client.query(migration.script);
        await client.query(
          `
            INSERT INTO ${JOURNAL_TABLE} (id, checksum, execution_ms)
            VALUES ($1, $2, $3)
          `,
          [migration.id, migration.checksum, Date.now() - startedAt],
        );
      });

      // eslint-disable-next-line no-console
      console.log(`[postgres] applied ${migration.id}`);
    }

    // eslint-disable-next-line no-console
    console.log(`[postgres] applied ${pending.length} migration(s)`);
  }

  private async ensureJournal(): Promise<void> {
    await this.postgres.execute(`
      CREATE TABLE IF NOT EXISTS ${JOURNAL_TABLE} (
        id TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        execution_ms INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  private async readAppliedMigrations(): Promise<Map<string, string>> {
    const rows = await this.postgres.query<AppliedMigration>(`SELECT id, checksum FROM ${JOURNAL_TABLE}`);
    return new Map(rows.map((item) => [item.id, item.checksum]));
  }
}

@Module({
  imports: [
    ConfigModule,
    PostgresConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: env.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(env.get('POSTGRES_PORT') ?? 20432),
          database: env.get('POSTGRES_DB') ?? 'app',
          user: env.get('POSTGRES_USER') ?? 'app',
          password: env.get('POSTGRES_PASSWORD') ?? 'app',
        };
      },
    }),
  ],
  providers: [PostgresMigrationService],
})
class PostgresMigrationModule {}

function readCommand(value: string | undefined): Command {
  if (value === 'up' || value === 'status') {
    return value;
  }
  throw new Error(`Unknown command: ${value ?? '<empty>'}. Use: up | status`);
}

async function bootstrap(): Promise<void> {
  const command = readCommand(process.argv[2]);
  const app = await NestFactory.createApplicationContext(PostgresMigrationModule, { logger: false });
  try {
    const service = app.get(PostgresMigrationService);
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
