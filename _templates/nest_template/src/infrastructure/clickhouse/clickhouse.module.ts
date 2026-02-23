import { ClickHouseConnectorModule } from '@infinityloop.labs/nest-connectors'
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
      ClickHouseConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          url: requiredString(env, 'CLICKHOUSE_URL'),
          database: requiredString(env, 'CLICKHOUSE_DATABASE'),
          username: requiredString(env, 'CLICKHOUSE_USER'),
          password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
          requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
        })),
      }),
      'CLICKHOUSE_ENABLED',
    ),
  ],
})
export class ClickHouseModule {}
