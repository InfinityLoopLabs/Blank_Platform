import { ClickHouseClient, createClient } from '@clickhouse/client';
import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';

import {
  ClickHouseConnectorAsyncOptions,
  ClickHouseConnectorOptions,
} from './clickhouse-connector-options';
import { ClickHouseRepository } from './clickhouse.repository';

export class ClickHouseConnector implements OnApplicationShutdown {
  constructor(public readonly client: ClickHouseClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.close();
  }
}

@Module({})
export class ClickHouseConnectorModule {
  static register(options: ClickHouseConnectorOptions): DynamicModule {
    return {
      module: ClickHouseConnectorModule,
      providers: [
        {
          provide: ClickHouseConnector,
          useFactory: () =>
            new ClickHouseConnector(
              createClient({
                url: options.url,
                database: options.database,
                username: options.username,
                password: options.password,
                request_timeout: options.requestTimeoutMs,
              }),
            ),
        },
        {
          provide: ClickHouseRepository,
          inject: [ClickHouseConnector],
          useFactory: (connector: ClickHouseConnector) => new ClickHouseRepository(connector),
        },
      ],
      exports: [ClickHouseConnector, ClickHouseRepository],
    };
  }

  static registerAsync(options: ClickHouseConnectorAsyncOptions): DynamicModule {
    return {
      module: ClickHouseConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: ClickHouseConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new ClickHouseConnector(
              createClient({
                url: cfg.url,
                database: cfg.database,
                username: cfg.username,
                password: cfg.password,
                request_timeout: cfg.requestTimeoutMs,
              }),
            );
          },
        },
        {
          provide: ClickHouseRepository,
          inject: [ClickHouseConnector],
          useFactory: (connector: ClickHouseConnector) => new ClickHouseRepository(connector),
        },
      ],
      exports: [ClickHouseConnector, ClickHouseRepository],
    };
  }
}
