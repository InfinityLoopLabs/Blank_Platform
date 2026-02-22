import { Logger, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ClickHouseMigrationModule } from './clickhouse/clickhouse-migration.module';
import { ClickHouseMigrationService } from './clickhouse/clickhouse-migration.service';
import { MigrationCommand } from './migration-command';
import { PostgresMigrationModule } from './postgres/postgres-migration.module';
import { PostgresMigrationService } from './postgres/postgres-migration.service';
import { ScyllaMigrationModule } from './scylla/scylla-migration.module';
import { ScyllaMigrationService } from './scylla/scylla-migration.service';

type DatabaseEngine = 'postgres' | 'clickhouse' | 'scylla';

function readDatabase(value: string | undefined): DatabaseEngine {
  if (value === 'postgres' || value === 'clickhouse' || value === 'scylla') {
    return value;
  }
  throw new Error(`Unknown database: ${value ?? '<empty>'}. Use: postgres | clickhouse | scylla`);
}

function readCommand(value: string | undefined): MigrationCommand {
  if (value === 'up' || value === 'down' || value === 'status') {
    return value;
  }
  throw new Error(`Unknown command: ${value ?? '<empty>'}. Use: up | down | status`);
}

function selectMigrationModule(database: DatabaseEngine): Type {
  if (database === 'postgres') {
    return PostgresMigrationModule;
  }
  if (database === 'clickhouse') {
    return ClickHouseMigrationModule;
  }
  return ScyllaMigrationModule;
}

async function runMigration(
  app: Awaited<ReturnType<typeof NestFactory.createApplicationContext>>,
  database: DatabaseEngine,
  command: MigrationCommand,
): Promise<void> {
  if (database === 'postgres') {
    await app.get(PostgresMigrationService).run(command);
    return;
  }

  if (database === 'clickhouse') {
    await app.get(ClickHouseMigrationService).run(command);
    return;
  }

  await app.get(ScyllaMigrationService).run(command);
}

async function bootstrap(): Promise<void> {
  const database = readDatabase(process.argv[2]);
  const command = readCommand(process.argv[3]);
  const app = await NestFactory.createApplicationContext(selectMigrationModule(database), {
    logger: ['log', 'warn', 'error'],
  });

  try {
    await runMigration(app, database, command);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('MigrationCli');
  logger.error(error);
  process.exitCode = 1;
});
