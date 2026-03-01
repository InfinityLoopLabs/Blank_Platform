import { HazelcastConnectorModule } from '@infinityloop.labs/nest-connectors'
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
      HazelcastConnectorModule.registerAsync({
        imports: [ConfigModule],
        inject: [CONFIG_REPOSITORY],
        useFactory: createUseFactoryFromEnvConfig((env: IConfigRepository) => ({
          clusterName: requiredString(env, 'HAZELCAST_CLUSTER_NAME'),
          network: {
            clusterMembers: requiredCsv(env, 'HAZELCAST_CLUSTER_MEMBERS'),
          },
        })),
      }),
      'HAZELCAST_ENABLED',
    ),
  ],
})
export class HazelcastModule {}
