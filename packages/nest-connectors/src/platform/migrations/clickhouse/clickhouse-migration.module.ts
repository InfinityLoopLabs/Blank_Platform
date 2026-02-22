import { DynamicModule, Module } from '@nestjs/common';

import {
  ClickHouseConnectorAsyncOptions,
  ClickHouseConnectorModule,
  ClickHouseConnectorOptions,
} from '../../connectors/clickhouse';
import {
  CLICKHOUSE_MIGRATION_OPTIONS,
  ClickHouseMigrationService,
  normalizeClickHouseMigrationOptions,
} from './clickhouse-migration.service';
import {
  ClickHouseMigrationAsyncOptions,
  ClickHouseMigrationOptions,
} from './clickhouse-migration-options';

/**
 * Nest module entrypoint for clickhouse migration infrastructure.
 */
@Module({})
export class ClickHouseMigrationModule {
  /**
   * Registers clickhouse connector + migration service with static options.
   */
  static register(options: ClickHouseMigrationOptions): DynamicModule {
    return {
      module: ClickHouseMigrationModule,
      imports: [ClickHouseConnectorModule.register(options.connector)],
      providers: [
        {
          provide: CLICKHOUSE_MIGRATION_OPTIONS,
          useValue: normalizeClickHouseMigrationOptions(options),
        },
        ClickHouseMigrationService,
      ],
      exports: [ClickHouseMigrationService],
    };
  }

  /**
   * Registers clickhouse migrations where options are resolved from DI at runtime.
   */
  static registerAsync(options: ClickHouseMigrationAsyncOptions): DynamicModule {
    const connectorOptions: ClickHouseConnectorAsyncOptions = {
      imports: options.imports,
      inject: options.inject,
      useFactory: async (...args: unknown[]): Promise<ClickHouseConnectorOptions> => {
        const cfg = await options.useFactory(...args);
        return cfg.connector;
      },
    };

    return {
      module: ClickHouseMigrationModule,
      imports: [
        ...(options.imports ?? []),
        ClickHouseConnectorModule.registerAsync(connectorOptions),
      ],
      providers: [
        {
          provide: CLICKHOUSE_MIGRATION_OPTIONS,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return normalizeClickHouseMigrationOptions(cfg);
          },
        },
        ClickHouseMigrationService,
      ],
      exports: [ClickHouseMigrationService],
    };
  }
}
