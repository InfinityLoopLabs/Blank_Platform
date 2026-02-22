import { Module } from '@nestjs/common';
import { ScyllaConnectorModule } from '@infinityloop.labs/nest-connectors';

import { ConfigModule, EnvConfigRepository } from '../../platform/modules/config/transport';
import { ScyllaMigrationService } from './scylla-migration.service';

@Module({
  imports: [
    ConfigModule,
    ScyllaConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        const contactPoints = (env.get('SCYLLA_CONTACT_POINTS') ?? 'localhost:20042')
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        return {
          contactPoints,
          localDataCenter: env.get('SCYLLA_LOCAL_DC') ?? 'datacenter1',
          keyspace: env.get('SCYLLA_KEYSPACE') || undefined,
          username: env.get('SCYLLA_USERNAME') || undefined,
          password: env.get('SCYLLA_PASSWORD') || undefined,
        };
      },
    }),
  ],
  providers: [ScyllaMigrationService],
  exports: [ScyllaMigrationService],
})
export class ScyllaMigrationModule {}
