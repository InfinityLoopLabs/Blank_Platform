import {
  ClickHouseConnectorModule,
  KafkaConnectorModule,
  MinioConnectorModule,
  PostgresConnectorModule,
  RedisConnectorModule,
  ScyllaConnectorModule,
} from '@infinityloop.labs/nest-connectors'
import { ModuleMetadata } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import { ConfigModule, EnvConfigRepository } from '../../config/transport'
import { createUseFactoryFromEnvConfig } from '../../../utils'
import {
  buildClickHouseConnectorOptions,
  buildKafkaConnectorOptions,
  buildMinioConnectorOptions,
  buildPostgresConnectorOptions,
  buildRedisConnectorOptions,
  buildScyllaConnectorOptions,
} from './connector-options'

const connectorModuleImports = [ConfigModule]
const connectorModuleInject = [EnvConfigRepository]

export const connectorImports: NonNullable<ModuleMetadata['imports']> = [
  ConditionalModule.registerWhen(
    PostgresConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(buildPostgresConnectorOptions),
    }),
    'POSTGRES_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ClickHouseConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(
        buildClickHouseConnectorOptions,
      ),
    }),
    'CLICKHOUSE_ENABLED',
  ),
  ConditionalModule.registerWhen(
    ScyllaConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(buildScyllaConnectorOptions),
    }),
    'SCYLLA_ENABLED',
  ),
  ConditionalModule.registerWhen(
    RedisConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(buildRedisConnectorOptions),
    }),
    'REDIS_ENABLED',
  ),
  ConditionalModule.registerWhen(
    KafkaConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(buildKafkaConnectorOptions),
    }),
    'KAFKA_ENABLED',
  ),
  ConditionalModule.registerWhen(
    MinioConnectorModule.registerAsync({
      imports: connectorModuleImports,
      inject: connectorModuleInject,
      useFactory: createUseFactoryFromEnvConfig(buildMinioConnectorOptions),
    }),
    'MINIO_ENABLED',
  ),
]
