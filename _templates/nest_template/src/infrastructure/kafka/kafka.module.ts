import { KafkaConnectorModule } from '@infinityloop.labs/nest-connectors'
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
      KafkaConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          client: {
            clientId: requiredString(env, 'KAFKA_CLIENT_ID'),
            brokers: requiredCsv(env, 'KAFKA_BROKERS'),
          },
          consumer: {
            groupId: requiredString(env, 'KAFKA_GROUP_ID'),
          },
        })),
      }),
      'KAFKA_ENABLED',
    ),
  ],
})
export class KafkaModule {}
