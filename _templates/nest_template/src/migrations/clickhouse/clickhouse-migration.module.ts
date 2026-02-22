import { Module } from '@nestjs/common';
import { ClickHouseConnectorModule } from '@infinityloop.labs/nest-connectors';

import { ConfigModule, EnvConfigRepository } from '../../platform/modules/config/transport';
import { ClickHouseMigrationService } from './clickhouse-migration.service';

@Module({
  imports: [
    ConfigModule,
    ClickHouseConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          url: env.get('CLICKHOUSE_URL') ?? 'http://localhost:20123',
          database: env.get('CLICKHOUSE_DATABASE') || undefined,
          username: env.get('CLICKHOUSE_USER') || undefined,
          password: env.get('CLICKHOUSE_PASSWORD') || undefined,
          requestTimeoutMs: Number(env.get('CLICKHOUSE_TIMEOUT_MS') ?? 5000),
        };
      },
    }),
  ],
  providers: [ClickHouseMigrationService],
  exports: [ClickHouseMigrationService],
})
export class ClickHouseMigrationModule {}
