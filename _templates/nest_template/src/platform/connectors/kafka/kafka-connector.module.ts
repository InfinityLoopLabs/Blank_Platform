import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { KafkaConnectorAsyncOptions, KafkaConnectorOptions } from './kafka-connector-options';
import { KafkaRepository } from './kafka.repository';

export class KafkaConnector implements OnApplicationShutdown {
  constructor(public readonly client: ClientProxy) {}

  onApplicationShutdown(): void {
    this.client.close();
  }
}

@Module({})
export class KafkaConnectorModule {
  static register(options: KafkaConnectorOptions): DynamicModule {
    return {
      module: KafkaConnectorModule,
      providers: [
        {
          provide: KafkaConnector,
          useFactory: () =>
            new KafkaConnector(
              ClientProxyFactory.create({
                transport: Transport.KAFKA,
                options,
              }),
            ),
        },
        {
          provide: KafkaRepository,
          inject: [KafkaConnector],
          useFactory: (connector: KafkaConnector) => new KafkaRepository(connector),
        },
      ],
      exports: [KafkaConnector, KafkaRepository],
    };
  }

  static registerAsync(options: KafkaConnectorAsyncOptions): DynamicModule {
    return {
      module: KafkaConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: KafkaConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new KafkaConnector(
              ClientProxyFactory.create({
                transport: Transport.KAFKA,
                options: cfg,
              }),
            );
          },
        },
        {
          provide: KafkaRepository,
          inject: [KafkaConnector],
          useFactory: (connector: KafkaConnector) => new KafkaRepository(connector),
        },
      ],
      exports: [KafkaConnector, KafkaRepository],
    };
  }
}
