import { Module } from '@nestjs/common'
import { KafkaConnectorModule } from '@infinityloop.labs/nest-connectors'
import { ConditionalModule } from '@nestjs/config'

import { createUseFactoryFromEnvConfig } from '@core/utils'
import {
  ConfigModule,
  EnvConfigRepository,
  requiredCsv,
  requiredString,
} from '@core/modules/config/transport'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      KafkaConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            client: {
              clientId: requiredString(env, 'KAFKA_CLIENT_ID'),
              brokers: requiredCsv(env, 'KAFKA_BROKERS'),
            },
            consumer: {
              groupId: requiredString(env, 'KAFKA_GROUP_ID'),
            },
          }),
        ),
      }),
      'KAFKA_ENABLED',
    ),
  ],
})
export class KafkaModule {}
