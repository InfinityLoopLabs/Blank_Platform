import { DynamicModule, Module } from '@nestjs/common';

import {
  PostgresConnectorModule,
  PostgresConnectorAsyncOptions,
  PostgresConnectorOptions,
} from '../../connectors/postgres';
import { PostgresMigrationAsyncOptions, PostgresMigrationOptions } from './postgres-migration-options';
import {
  normalizePostgresMigrationOptions,
  PostgresMigrationService,
  POSTGRES_MIGRATION_OPTIONS,
} from './postgres-migration.service';

@Module({})
export class PostgresMigrationModule {
  static register(options: PostgresMigrationOptions): DynamicModule {
    return {
      module: PostgresMigrationModule,
      imports: [PostgresConnectorModule.register(options.connector)],
      providers: [
        {
          provide: POSTGRES_MIGRATION_OPTIONS,
          useValue: normalizePostgresMigrationOptions(options),
        },
        PostgresMigrationService,
      ],
      exports: [PostgresMigrationService],
    };
  }

  static registerAsync(options: PostgresMigrationAsyncOptions): DynamicModule {
    const connectorOptions: PostgresConnectorAsyncOptions = {
      imports: options.imports,
      inject: options.inject,
      useFactory: async (...args: unknown[]): Promise<PostgresConnectorOptions> => {
        const cfg = await options.useFactory(...args);
        return cfg.connector;
      },
    };

    return {
      module: PostgresMigrationModule,
      imports: [
        ...(options.imports ?? []),
        PostgresConnectorModule.registerAsync(connectorOptions),
      ],
      providers: [
        {
          provide: POSTGRES_MIGRATION_OPTIONS,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return normalizePostgresMigrationOptions(cfg);
          },
        },
        PostgresMigrationService,
      ],
      exports: [PostgresMigrationService],
    };
  }
}
