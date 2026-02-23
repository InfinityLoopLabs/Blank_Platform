import {
  ClickHouseMigrationModule,
  PostgresMigrationModule,
  ScyllaMigrationModule,
} from '@infinityloop.labs/nest-connectors'
import { ModuleMetadata } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import { createUseFactoryFromEnvConfig } from '../../../utils'
import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  optionalString,
  requiredCsv,
  requiredPositiveInt,
  requiredString,
} from '../../config/transport'

// Shared dependencies used by async migration-module factories.
const migrationModuleImports = [ConfigModule]
const migrationModuleInject = [CONFIG_REPOSITORY]

/**
 * Conditionally registers migration modules for each storage engine.
 * Connector and migration options are sourced from validated environment values.
 */
export const migrationImports: NonNullable<ModuleMetadata['imports']> = [
  ConditionalModule.registerWhen(
    PostgresMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
        connector: {
          host: requiredString(env, 'POSTGRES_HOST'),
          port: requiredPositiveInt(env, 'POSTGRES_PORT'),
          database: requiredString(env, 'POSTGRES_DB'),
          user: requiredString(env, 'POSTGRES_USER'),
          password: requiredString(env, 'POSTGRES_PASSWORD'),
        },
      })),
    }),
    'POSTGRES_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ClickHouseMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
        connector: {
          url: requiredString(env, 'CLICKHOUSE_URL'),
          database: requiredString(env, 'CLICKHOUSE_DATABASE'),
          username: requiredString(env, 'CLICKHOUSE_USER'),
          password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
          requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
        },
      })),
    }),
    'CLICKHOUSE_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ScyllaMigrationModule.registerAsync({
      imports: migrationModuleImports,
      inject: migrationModuleInject,
      useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
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
      })),
    }),
    'SCYLLA_ENABLED',
  ),
]
