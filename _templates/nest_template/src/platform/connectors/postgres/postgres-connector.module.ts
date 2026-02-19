import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';

import { PostgresConnectorAsyncOptions, PostgresConnectorOptions } from './postgres-connector-options';
import { PostgresRepository } from './postgres.repository';

export class PostgresConnector implements OnApplicationShutdown {
  constructor(public readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Module({})
export class PostgresConnectorModule {
  static register(options: PostgresConnectorOptions): DynamicModule {
    return {
      module: PostgresConnectorModule,
      providers: [
        {
          provide: PostgresConnector,
          useFactory: () =>
            new PostgresConnector(
              new Pool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.user,
                password: options.password,
                ssl: options.ssl,
                max: options.maxPoolSize,
                idleTimeoutMillis: options.idleTimeoutMs,
                connectionTimeoutMillis: options.connectionTimeoutMs,
              }),
            ),
        },
        {
          provide: PostgresRepository,
          inject: [PostgresConnector],
          useFactory: (connector: PostgresConnector) => new PostgresRepository(connector),
        },
      ],
      exports: [PostgresConnector, PostgresRepository],
    };
  }

  static registerAsync(options: PostgresConnectorAsyncOptions): DynamicModule {
    return {
      module: PostgresConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: PostgresConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new PostgresConnector(
              new Pool({
                host: cfg.host,
                port: cfg.port,
                database: cfg.database,
                user: cfg.user,
                password: cfg.password,
                ssl: cfg.ssl,
                max: cfg.maxPoolSize,
                idleTimeoutMillis: cfg.idleTimeoutMs,
                connectionTimeoutMillis: cfg.connectionTimeoutMs,
              }),
            );
          },
        },
        {
          provide: PostgresRepository,
          inject: [PostgresConnector],
          useFactory: (connector: PostgresConnector) => new PostgresRepository(connector),
        },
      ],
      exports: [PostgresConnector, PostgresRepository],
    };
  }
}
