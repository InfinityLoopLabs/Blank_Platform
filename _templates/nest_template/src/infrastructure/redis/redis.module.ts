import { Module } from '@nestjs/common'
import { RedisConnectorModule } from '@infinityloop.labs/nest-connectors'
import { ConditionalModule } from '@nestjs/config'

import { createUseFactoryFromEnvConfig } from '@core/utils'
import {
  ConfigModule,
  EnvConfigRepository,
  optionalString,
  requiredNonNegativeInt,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      RedisConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            host: requiredString(env, 'REDIS_HOST'),
            port: requiredPositiveInt(env, 'REDIS_PORT'),
            db: requiredNonNegativeInt(env, 'REDIS_DB'),
            password: optionalString(env, 'REDIS_PASSWORD'),
          }),
        ),
      }),
      'REDIS_ENABLED',
    ),
  ],
})
export class RedisModule {}
