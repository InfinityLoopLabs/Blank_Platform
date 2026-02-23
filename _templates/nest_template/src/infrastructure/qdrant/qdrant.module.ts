import { QdrantConnectorModule } from '@infinityloop.labs/nest-connectors'
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
      QdrantConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          url: requiredString(env, 'QDRANT_URL'),
          apiKey: optionalString(env, 'QDRANT_API_KEY'),
          timeoutMs: requiredPositiveInt(env, 'QDRANT_TIMEOUT_MS'),
        })),
      }),
      'QDRANT_ENABLED',
    ),
  ],
})
export class QdrantModule {}
