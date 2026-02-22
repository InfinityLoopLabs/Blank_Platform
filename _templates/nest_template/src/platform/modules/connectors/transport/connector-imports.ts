import { ModuleMetadata } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import {
  ClickHouseConnectorModule,
  KafkaConnectorModule,
  MinioConnectorModule,
  PostgresConnectorModule,
  RedisConnectorModule,
  ScyllaConnectorModule,
} from '@infinityloop.labs/nest-connectors';

import { ConfigModule, EnvConfigRepository } from '../../config/transport';

const connectorModuleImports = [ConfigModule];
const connectorModuleInject = [EnvConfigRepository];

export const connectorImports: NonNullable<ModuleMetadata['imports']> = [
  ConditionalModule.registerWhen(
    PostgresConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: requiredString(env, 'POSTGRES_HOST'),
          port: requiredPositiveInt(env, 'POSTGRES_PORT'),
          database: requiredString(env, 'POSTGRES_DB'),
          user: requiredString(env, 'POSTGRES_USER'),
          password: requiredString(env, 'POSTGRES_PASSWORD'),
        };
      },
    }),
    'POSTGRES_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ClickHouseConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          url: requiredString(env, 'CLICKHOUSE_URL'),
          database: requiredString(env, 'CLICKHOUSE_DATABASE'),
          username: requiredString(env, 'CLICKHOUSE_USER'),
          password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
          requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
        };
      },
    }),
    'CLICKHOUSE_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ScyllaConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          contactPoints: requiredCsv(env, 'SCYLLA_CONTACT_POINTS'),
          localDataCenter: requiredString(env, 'SCYLLA_LOCAL_DC'),
          keyspace: optionalString(env, 'SCYLLA_KEYSPACE'),
          username: optionalString(env, 'SCYLLA_USERNAME'),
          password: optionalString(env, 'SCYLLA_PASSWORD'),
        };
      },
    }),
    'SCYLLA_ENABLED',
  ),
  ConditionalModule.registerWhen(
    RedisConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: requiredString(env, 'REDIS_HOST'),
          port: requiredPositiveInt(env, 'REDIS_PORT'),
          db: requiredNonNegativeInt(env, 'REDIS_DB'),
          password: optionalString(env, 'REDIS_PASSWORD'),
        };
      },
    }),
    'REDIS_ENABLED',
  ),
  ConditionalModule.registerWhen(
    KafkaConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          client: {
            clientId: requiredString(env, 'KAFKA_CLIENT_ID'),
            brokers: requiredCsv(env, 'KAFKA_BROKERS'),
          },
          consumer: {
            groupId: requiredString(env, 'KAFKA_GROUP_ID'),
          },
        };
      },
    }),
    'KAFKA_ENABLED',
  ),
  ConditionalModule.registerWhen(
    MinioConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          endPoint: requiredString(env, 'MINIO_ENDPOINT'),
          port: requiredPositiveInt(env, 'MINIO_PORT'),
          useSSL: requiredBoolean(env, 'MINIO_USE_SSL'),
          accessKey: requiredString(env, 'MINIO_ACCESS_KEY'),
          secretKey: requiredString(env, 'MINIO_SECRET_KEY'),
          region: optionalString(env, 'MINIO_REGION'),
        };
      },
    }),
    'MINIO_ENABLED',
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

function requiredNonNegativeInt(env: EnvConfigRepository, key: string): number {
  const value = requiredString(env, key);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid non-negative integer env ${key}: ${value}`);
  }
  return parsed;
}

function requiredBoolean(env: EnvConfigRepository, key: string): boolean {
  const value = requiredString(env, key).toLowerCase();
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(`Invalid boolean env ${key}: ${value}`);
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
