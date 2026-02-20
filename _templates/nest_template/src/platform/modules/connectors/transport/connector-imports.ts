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
          host: env.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(env.get('POSTGRES_PORT') ?? 20432),
          database: env.get('POSTGRES_DB') ?? 'app',
          user: env.get('POSTGRES_USER') ?? 'app',
          password: env.get('POSTGRES_PASSWORD') ?? 'app',
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
          url: env.get('CLICKHOUSE_URL') ?? 'http://localhost:20123',
          database: env.get('CLICKHOUSE_DATABASE') || undefined,
          username: env.get('CLICKHOUSE_USER') || undefined,
          password: env.get('CLICKHOUSE_PASSWORD') || undefined,
          requestTimeoutMs: Number(env.get('CLICKHOUSE_TIMEOUT_MS') ?? 5000),
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
          contactPoints: (env.get('SCYLLA_CONTACT_POINTS') ?? 'localhost:20042')
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          localDataCenter: env.get('SCYLLA_LOCAL_DC') ?? 'datacenter1',
          keyspace: env.get('SCYLLA_KEYSPACE') || undefined,
          username: env.get('SCYLLA_USERNAME') || undefined,
          password: env.get('SCYLLA_PASSWORD') || undefined,
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
          host: env.get('REDIS_HOST') ?? 'localhost',
          port: Number(env.get('REDIS_PORT') ?? 20379),
          db: Number(env.get('REDIS_DB') ?? 0),
          password: env.get('REDIS_PASSWORD') || undefined,
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
            clientId: env.get('KAFKA_CLIENT_ID') ?? 'sample-nest',
            brokers: (env.get('KAFKA_BROKERS') ?? 'localhost:20092')
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0),
          },
          consumer: {
            groupId: env.get('KAFKA_GROUP_ID') ?? 'sample-nest-group',
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
          endPoint: env.get('MINIO_ENDPOINT') ?? 'localhost',
          port: Number(env.get('MINIO_PORT') ?? 20000),
          useSSL: (env.get('MINIO_USE_SSL') ?? '').trim().toLowerCase() === 'true',
          accessKey: env.get('MINIO_ACCESS_KEY') ?? 'minioadmin',
          secretKey: env.get('MINIO_SECRET_KEY') ?? 'minioadmin',
          region: env.get('MINIO_REGION') || undefined,
        };
      },
    }),
    'MINIO_ENABLED',
  ),
];
