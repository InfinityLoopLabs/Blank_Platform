import { Module } from '@nestjs/common'
import { ClickHouseConnectorModule } from '@infinityloop.labs/nest-connectors'
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
      ClickHouseConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            url: requiredString(env, 'CLICKHOUSE_URL'),
            database: requiredString(env, 'CLICKHOUSE_DATABASE'),
            username: requiredString(env, 'CLICKHOUSE_USER'),
            password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
            requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
          }),
        ),
      }),
      'CLICKHOUSE_ENABLED',
    ),
  ],
})
export class ClickHouseModule {}
