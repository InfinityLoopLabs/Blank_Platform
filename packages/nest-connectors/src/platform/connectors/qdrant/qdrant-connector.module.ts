import { QdrantClient } from '@qdrant/js-client-rest';
import { DynamicModule, Module } from '@nestjs/common';

import { QdrantConnectorAsyncOptions, QdrantConnectorOptions } from './qdrant-connector-options';
import { QdrantRepository } from './qdrant.repository';

export class QdrantConnector {
  constructor(public readonly client: QdrantClient) {}
}

@Module({})
export class QdrantConnectorModule {
  static register(options: QdrantConnectorOptions): DynamicModule {
    return {
      module: QdrantConnectorModule,
      providers: [
        {
          provide: QdrantConnector,
          useFactory: () => QdrantConnectorModule.createConnector(options),
        },
        {
          provide: QdrantRepository,
          inject: [QdrantConnector],
          useFactory: (connector: QdrantConnector) => new QdrantRepository(connector),
        },
      ],
      exports: [QdrantConnector, QdrantRepository],
    };
  }

  static registerAsync(options: QdrantConnectorAsyncOptions): DynamicModule {
    return {
      module: QdrantConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: QdrantConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return QdrantConnectorModule.createConnector(cfg);
          },
        },
        {
          provide: QdrantRepository,
          inject: [QdrantConnector],
          useFactory: (connector: QdrantConnector) => new QdrantRepository(connector),
        },
      ],
      exports: [QdrantConnector, QdrantRepository],
    };
  }

  private static createConnector(options: QdrantConnectorOptions): QdrantConnector {
    return new QdrantConnector(
      new QdrantClient({
        url: options.url,
        apiKey: options.apiKey,
        timeout: options.timeoutMs,
        checkCompatibility: options.checkCompatibility,
      }),
    );
  }
}
