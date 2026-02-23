import { Module } from '@nestjs/common'
import { ScyllaConnectorModule } from '@infinityloop.labs/nest-connectors'
import { ConditionalModule } from '@nestjs/config'

import { createUseFactoryFromEnvConfig } from '@core/utils'
import {
  ConfigModule,
  EnvConfigRepository,
  optionalString,
  requiredCsv,
  requiredString,
} from '@core/modules/config/transport'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      ScyllaConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [EnvConfigRepository],
        useFactory: createUseFactoryFromEnvConfig(
          (env: EnvConfigRepository) => ({
            contactPoints: requiredCsv(env, 'SCYLLA_CONTACT_POINTS'),
            localDataCenter: requiredString(env, 'SCYLLA_LOCAL_DC'),
            keyspace: optionalString(env, 'SCYLLA_KEYSPACE'),
            username: optionalString(env, 'SCYLLA_USERNAME'),
            password: optionalString(env, 'SCYLLA_PASSWORD'),
          }),
        ),
      }),
      'SCYLLA_ENABLED',
    ),
  ],
})
export class ScyllaModule {}
