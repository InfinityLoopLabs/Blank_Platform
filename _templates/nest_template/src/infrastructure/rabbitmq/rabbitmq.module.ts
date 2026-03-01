import { RabbitMqConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  requiredCsv,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      RabbitMqConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          urls: requiredCsv(env, 'RABBITMQ_URLS'),
          queue: requiredString(env, 'RABBITMQ_QUEUE'),
        })),
      }),
      'RABBITMQ_ENABLED',
    ),
  ],
})
export class RabbitMqModule {}
