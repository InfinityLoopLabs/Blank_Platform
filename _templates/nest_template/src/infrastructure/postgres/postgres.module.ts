import { Module } from '@nestjs/common'
import { PostgresConnectorModule } from '@infinityloop.labs/nest-connectors'
import { ConditionalModule } from '@nestjs/config'

import { createUseFactoryFromEnvConfig } from '@core/utils'
import {
  ConfigModule,
  EnvConfigRepository,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      PostgresConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            host: requiredString(env, 'POSTGRES_HOST'),
            port: requiredPositiveInt(env, 'POSTGRES_PORT'),
            database: requiredString(env, 'POSTGRES_DB'),
            user: requiredString(env, 'POSTGRES_USER'),
            password: requiredString(env, 'POSTGRES_PASSWORD'),
          }),
        ),
      }),
      'POSTGRES_ENABLED',
    ),
  ],
})
export class PostgresModule {}
