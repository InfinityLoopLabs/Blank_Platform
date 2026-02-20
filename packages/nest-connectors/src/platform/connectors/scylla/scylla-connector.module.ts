import { auth as ScyllaAuthProvider, Client as ScyllaClient, ClientOptions as ScyllaClientOptions } from 'cassandra-driver';
import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';

import { ScyllaConnectorAsyncOptions, ScyllaConnectorOptions } from './scylla-connector-options';
import { ScyllaRepository } from './scylla.repository';

export class ScyllaConnector implements OnApplicationShutdown {
  constructor(public readonly client: ScyllaClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.shutdown();
  }
}

@Module({})
export class ScyllaConnectorModule {
  static register(options: ScyllaConnectorOptions): DynamicModule {
    return {
      module: ScyllaConnectorModule,
      providers: [
        {
          provide: ScyllaConnector,
          useFactory: () => new ScyllaConnector(ScyllaConnectorModule.buildClient(options)),
        },
        {
          provide: ScyllaRepository,
          inject: [ScyllaConnector],
          useFactory: (connector: ScyllaConnector) => new ScyllaRepository(connector),
        },
      ],
      exports: [ScyllaConnector, ScyllaRepository],
    };
  }

  static registerAsync(options: ScyllaConnectorAsyncOptions): DynamicModule {
    return {
      module: ScyllaConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: ScyllaConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new ScyllaConnector(ScyllaConnectorModule.buildClient(cfg));
          },
        },
        {
          provide: ScyllaRepository,
          inject: [ScyllaConnector],
          useFactory: (connector: ScyllaConnector) => new ScyllaRepository(connector),
        },
      ],
      exports: [ScyllaConnector, ScyllaRepository],
    };
  }

  private static buildClient(cfg: ScyllaConnectorOptions): ScyllaClient {
    if ((cfg.username && !cfg.password) || (!cfg.username && cfg.password)) {
      throw new Error('SCYLLA username and password must be provided together');
    }

    const clientOptions: ScyllaClientOptions = {
      contactPoints: cfg.contactPoints,
      localDataCenter: cfg.localDataCenter,
      keyspace: cfg.keyspace,
    };

    if (cfg.username && cfg.password) {
      clientOptions.authProvider = new ScyllaAuthProvider.PlainTextAuthProvider(cfg.username, cfg.password);
    }

    return new ScyllaClient(clientOptions);
  }
}
