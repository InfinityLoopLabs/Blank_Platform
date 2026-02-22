import { DynamicModule, Module } from '@nestjs/common';

import {
  ScyllaConnectorAsyncOptions,
  ScyllaConnectorModule,
  ScyllaConnectorOptions,
} from '../../connectors/scylla';
import {
  normalizeScyllaMigrationOptions,
  ScyllaMigrationService,
  SCYLLA_MIGRATION_OPTIONS,
} from './scylla-migration.service';
import { ScyllaMigrationAsyncOptions, ScyllaMigrationOptions } from './scylla-migration-options';

/**
 * Nest module entrypoint for scylla migration infrastructure.
 */
@Module({})
export class ScyllaMigrationModule {
  /**
   * Registers scylla connector + migration service with static options.
   */
  static register(options: ScyllaMigrationOptions): DynamicModule {
    return {
      module: ScyllaMigrationModule,
      imports: [ScyllaConnectorModule.register(options.connector)],
      providers: [
        {
          provide: SCYLLA_MIGRATION_OPTIONS,
          useValue: normalizeScyllaMigrationOptions(options),
        },
        ScyllaMigrationService,
      ],
      exports: [ScyllaMigrationService],
    };
  }

  /**
   * Registers scylla migrations where options are resolved from DI at runtime.
   */
  static registerAsync(options: ScyllaMigrationAsyncOptions): DynamicModule {
    const connectorOptions: ScyllaConnectorAsyncOptions = {
      imports: options.imports,
      inject: options.inject,
      useFactory: async (...args: unknown[]): Promise<ScyllaConnectorOptions> => {
        const cfg = await options.useFactory(...args);
        return cfg.connector;
      },
    };

    return {
      module: ScyllaMigrationModule,
      imports: [
        ...(options.imports ?? []),
        ScyllaConnectorModule.registerAsync(connectorOptions),
      ],
      providers: [
        {
          provide: SCYLLA_MIGRATION_OPTIONS,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return normalizeScyllaMigrationOptions(cfg);
          },
        },
        ScyllaMigrationService,
      ],
      exports: [ScyllaMigrationService],
    };
  }
}
