import { ScyllaConnectorModule } from '@infinityloop.labs/nest-connectors'
import { Module } from '@nestjs/common'
import { ConditionalModule } from '@nestjs/config'

import {
  ConfigModule,
  CONFIG_REPOSITORY,
  IConfigRepository,
  optionalString,
  requiredCsv,
  requiredString,
} from '@core/modules/config/transport'
import { createUseFactoryFromEnvConfig } from '@core/utils'

@Module({
  imports: [
    ConditionalModule.registerWhen(
      ScyllaConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          contactPoints: requiredCsv(env, 'SCYLLA_CONTACT_POINTS'),
          localDataCenter: requiredString(env, 'SCYLLA_LOCAL_DC'),
          keyspace: optionalString(env, 'SCYLLA_KEYSPACE'),
          username: optionalString(env, 'SCYLLA_USERNAME'),
          password: optionalString(env, 'SCYLLA_PASSWORD'),
        })),
      }),
      'SCYLLA_ENABLED',
    ),
  ],
})
export class ScyllaModule {}
