import { DynamicModule, Module, OnApplicationShutdown } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

import { Neo4jConnectorAsyncOptions, Neo4jConnectorOptions } from './neo4j-connector-options';
import { Neo4jRepository } from './neo4j.repository';

export class Neo4jConnector implements OnApplicationShutdown {
  constructor(
    public readonly driver: Driver,
    public readonly defaultDatabase?: string,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.driver.close();
  }
}

@Module({})
export class Neo4jConnectorModule {
  static register(options: Neo4jConnectorOptions): DynamicModule {
    return {
      module: Neo4jConnectorModule,
      providers: [
        {
          provide: Neo4jConnector,
          useFactory: () => Neo4jConnectorModule.createConnector(options),
        },
        {
          provide: Neo4jRepository,
          inject: [Neo4jConnector],
          useFactory: (connector: Neo4jConnector) => new Neo4jRepository(connector),
        },
      ],
      exports: [Neo4jConnector, Neo4jRepository],
    };
  }

  static registerAsync(options: Neo4jConnectorAsyncOptions): DynamicModule {
    return {
      module: Neo4jConnectorModule,
      imports: options.imports,
      providers: [
        {
          provide: Neo4jConnector,
          inject: options.inject ?? [],
          useFactory: async (...args: unknown[]) => {
            const cfg = await options.useFactory(...args);
            return Neo4jConnectorModule.createConnector(cfg);
          },
        },
        {
          provide: Neo4jRepository,
          inject: [Neo4jConnector],
          useFactory: (connector: Neo4jConnector) => new Neo4jRepository(connector),
        },
      ],
      exports: [Neo4jConnector, Neo4jRepository],
    };
  }

  private static createConnector(options: Neo4jConnectorOptions): Neo4jConnector {
    const driver = neo4j.driver(
      options.uri,
      neo4j.auth.basic(options.user, options.password),
      {
        maxConnectionPoolSize: options.maxConnectionPoolSize,
        connectionTimeout: options.connectionTimeoutMs,
      },
    );

    return new Neo4jConnector(driver, options.database);
  }
}
