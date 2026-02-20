import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

import { RedisConnectorAsyncOptions, RedisConnectorOptions } from './redis-connector-options';
import { RedisRepository } from './redis.repository';

export class RedisConnector implements OnApplicationShutdown {
  constructor(public readonly client: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.quit();
  }
}

@Module({})
export class RedisConnectorModule {
  static register(options: RedisConnectorOptions): DynamicModule {
    return {
      module: RedisConnectorModule,
      providers: [
        {
          provide: RedisConnector,
          useFactory: () => new RedisConnector(new Redis(options)),
        },
        {
          provide: RedisRepository,
          inject: [RedisConnector],
          useFactory: (connector: RedisConnector) => new RedisRepository(connector),
        },
      ],
      exports: [RedisConnector, RedisRepository],
    };
  }

  static registerAsync(options: RedisConnectorAsyncOptions): DynamicModule {
    return {
      module: RedisConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: RedisConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new RedisConnector(new Redis(cfg));
          },
        },
        {
          provide: RedisRepository,
          inject: [RedisConnector],
          useFactory: (connector: RedisConnector) => new RedisRepository(connector),
        },
      ],
      exports: [RedisConnector, RedisRepository],
    };
  }
}
