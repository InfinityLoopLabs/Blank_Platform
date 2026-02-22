import { ModuleMetadata } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import {
  ClickHouseMigrationModule,
  PostgresMigrationModule,
  ScyllaMigrationModule,
} from '@infinityloop.labs/nest-connectors';

import { ConfigModule, EnvConfigRepository } from '../../config/transport';

const migrationModuleImports = [ConfigModule];
const migrationModuleInject = [EnvConfigRepository];

export const migrationImports: NonNullable<ModuleMetadata['imports']> = [
  ConditionalModule.registerWhen(
    PostgresMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          connector: {
            host: requiredString(env, 'POSTGRES_HOST'),
            port: requiredPositiveInt(env, 'POSTGRES_PORT'),
            database: requiredString(env, 'POSTGRES_DB'),
            user: requiredString(env, 'POSTGRES_USER'),
            password: requiredString(env, 'POSTGRES_PASSWORD'),
          },
        };
      },
    }),
    'POSTGRES_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ClickHouseMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          connector: {
            url: requiredString(env, 'CLICKHOUSE_URL'),
            database: requiredString(env, 'CLICKHOUSE_DATABASE'),
            username: requiredString(env, 'CLICKHOUSE_USER'),
            password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
            requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
          },
        };
      },
    }),
    'CLICKHOUSE_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ScyllaMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          connector: {
            contactPoints: requiredCsv(env, 'SCYLLA_CONTACT_POINTS'),
            localDataCenter: requiredString(env, 'SCYLLA_LOCAL_DC'),
            keyspace: optionalString(env, 'SCYLLA_KEYSPACE'),
            username: optionalString(env, 'SCYLLA_USERNAME'),
            password: optionalString(env, 'SCYLLA_PASSWORD'),
          },
          migrationsKeyspace:
            optionalString(env, 'SCYLLA_MIGRATIONS_KEYSPACE') ??
            optionalString(env, 'SCYLLA_KEYSPACE') ??
            'app',
        };
      },
    }),
    'SCYLLA_ENABLED',
  ),
];

function requiredString(env: EnvConfigRepository, key: string): string {
  const value = (env.get(key) ?? '').trim();
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

function optionalString(env: EnvConfigRepository, key: string): string | undefined {
  const value = (env.get(key) ?? '').trim();
  return value ? value : undefined;
}

function requiredPositiveInt(env: EnvConfigRepository, key: string): number {
  const value = requiredString(env, key);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid positive integer env ${key}: ${value}`);
  }
  return parsed;
}

function requiredCsv(env: EnvConfigRepository, key: string): string[] {
  const source = requiredString(env, key);
  const values = source
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  if (values.length === 0) {
    throw new Error(`Env must contain at least one value: ${key}`);
  }
  return values;
}
