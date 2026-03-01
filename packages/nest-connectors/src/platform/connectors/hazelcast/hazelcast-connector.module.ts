import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { Client } from 'hazelcast-client';

import { HazelcastConnectorAsyncOptions, HazelcastConnectorOptions } from './hazelcast-connector-options';
import { HazelcastRepository } from './hazelcast.repository';

type HazelcastClientInstance = Awaited<ReturnType<typeof Client.newHazelcastClient>>;

export class HazelcastConnector implements OnApplicationShutdown {
  constructor(public readonly client: HazelcastClientInstance) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.shutdown();
  }
}

@Module({})
export class HazelcastConnectorModule {
  static register(options: HazelcastConnectorOptions): DynamicModule {
    return {
      module: HazelcastConnectorModule,
      providers: [
        {
          provide: HazelcastConnector,
          useFactory: async () => new HazelcastConnector(await Client.newHazelcastClient(options)),
        },
        {
          provide: HazelcastRepository,
          inject: [HazelcastConnector],
          useFactory: (connector: HazelcastConnector) => new HazelcastRepository(connector),
        },
      ],
      exports: [HazelcastConnector, HazelcastRepository],
    };
  }

  static registerAsync(options: HazelcastConnectorAsyncOptions): DynamicModule {
    return {
      module: HazelcastConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: HazelcastConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new HazelcastConnector(await Client.newHazelcastClient(cfg));
          },
        },
        {
          provide: HazelcastRepository,
          inject: [HazelcastConnector],
          useFactory: (connector: HazelcastConnector) => new HazelcastRepository(connector),
        },
      ],
      exports: [HazelcastConnector, HazelcastRepository],
    };
  }
}
