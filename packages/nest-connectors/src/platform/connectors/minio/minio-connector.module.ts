import { DynamicModule, Module } from '@nestjs/common';
import { Client as MinioClient } from 'minio';

import { MinioConnectorAsyncOptions, MinioConnectorOptions } from './minio-connector-options';
import { MinioRepository } from './minio.repository';

export class MinioConnector {
  constructor(public readonly client: MinioClient) {}
}

@Module({})
export class MinioConnectorModule {
  static register(options: MinioConnectorOptions): DynamicModule {
    return {
      module: MinioConnectorModule,
      providers: [
        {
          provide: MinioConnector,
          useFactory: () => new MinioConnector(new MinioClient(options)),
        },
        {
          provide: MinioRepository,
          inject: [MinioConnector],
          useFactory: (connector: MinioConnector) => new MinioRepository(connector),
        },
      ],
      exports: [MinioConnector, MinioRepository],
    };
  }

  static registerAsync(options: MinioConnectorAsyncOptions): DynamicModule {
    return {
      module: MinioConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: MinioConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return new MinioConnector(new MinioClient(cfg));
          },
        },
        {
          provide: MinioRepository,
          inject: [MinioConnector],
          useFactory: (connector: MinioConnector) => new MinioRepository(connector),
        },
      ],
      exports: [MinioConnector, MinioRepository],
    };
  }
}
