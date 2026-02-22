import { Module } from '@nestjs/common';
import { PostgresConnectorModule } from '@infinityloop.labs/nest-connectors';

import { ConfigModule, EnvConfigRepository } from '../../platform/modules/config/transport';
import { PostgresMigrationService } from './postgres-migration.service';

@Module({
  imports: [
    ConfigModule,
    PostgresConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: env.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(env.get('POSTGRES_PORT') ?? 20432),
          database: env.get('POSTGRES_DB') ?? 'app',
          user: env.get('POSTGRES_USER') ?? 'app',
          password: env.get('POSTGRES_PASSWORD') ?? 'app',
        };
      },
    }),
  ],
  providers: [PostgresMigrationService],
  exports: [PostgresMigrationService],
})
export class PostgresMigrationModule {}
