import { Neo4jConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  optionalString,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      Neo4jConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          uri: requiredString(env, 'NEO4J_URI'),
          user: requiredString(env, 'NEO4J_USER'),
          password: requiredString(env, 'NEO4J_PASSWORD'),
          database: optionalString(env, 'NEO4J_DATABASE'),
          maxConnectionPoolSize: requiredPositiveInt(
            env,
            'NEO4J_MAX_CONNECTION_POOL_SIZE',
          ),
          connectionTimeoutMs: requiredPositiveInt(
            env,
            'NEO4J_CONNECTION_TIMEOUT_MS',
          ),
        })),
      }),
      'NEO4J_ENABLED',
    ),
  ],
})
export class Neo4jModule {}
