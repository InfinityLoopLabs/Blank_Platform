import { PostgresConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  requiredPositiveInt,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      PostgresConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          host: requiredString(env, 'POSTGRES_HOST'),
          port: requiredPositiveInt(env, 'POSTGRES_PORT'),
          database: requiredString(env, 'POSTGRES_DB'),
          user: requiredString(env, 'POSTGRES_USER'),
          password: requiredString(env, 'POSTGRES_PASSWORD'),
        })),
      }),
      'POSTGRES_ENABLED',
    ),
  ],
})
export class PostgresModule {}
