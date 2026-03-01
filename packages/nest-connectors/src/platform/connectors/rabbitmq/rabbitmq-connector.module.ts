import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { RabbitMqConnectorAsyncOptions, RabbitMqConnectorOptions } from './rabbitmq-connector-options';
import { RabbitMqRepository } from './rabbitmq.repository';

export class RabbitMqConnector implements OnApplicationShutdown {
  constructor(public readonly client: ClientProxy) {}

  onApplicationShutdown(): void {
    this.client.close();
  }
}

@Module({})
export class RabbitMqConnectorModule {
  static register(options: RabbitMqConnectorOptions): DynamicModule {
    return {
      module: RabbitMqConnectorModule,
      providers: [
        {
          provide: RabbitMqConnector,
          useFactory: () =>
            new RabbitMqConnector(
              ClientProxyFactory.create({
                transport: Transport.RMQ,
                options,
              }),
            ),
        },
        {
          provide: RabbitMqRepository,
          inject: [RabbitMqConnector],
          useFactory: (connector: RabbitMqConnector) => new RabbitMqRepository(connector),
        },
      ],
      exports: [RabbitMqConnector, RabbitMqRepository],
    };
  }

  static registerAsync(options: RabbitMqConnectorAsyncOptions): DynamicModule {
    return {
      module: RabbitMqConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: RabbitMqConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new RabbitMqConnector(
              ClientProxyFactory.create({
                transport: Transport.RMQ,
                options: cfg,
              }),
            );
          },
        },
        {
          provide: RabbitMqRepository,
          inject: [RabbitMqConnector],
          useFactory: (connector: RabbitMqConnector) => new RabbitMqRepository(connector),
        },
      ],
      exports: [RabbitMqConnector, RabbitMqRepository],
    };
  }
}
