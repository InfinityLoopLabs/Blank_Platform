import { RedisConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  optionalString,
  requiredNonNegativeInt,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      RedisConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          host: requiredString(env, 'REDIS_HOST'),
          port: requiredPositiveInt(env, 'REDIS_PORT'),
          db: requiredNonNegativeInt(env, 'REDIS_DB'),
          password: optionalString(env, 'REDIS_PASSWORD'),
        })),
      }),
      'REDIS_ENABLED',
    ),
  ],
})
export class RedisModule {}
