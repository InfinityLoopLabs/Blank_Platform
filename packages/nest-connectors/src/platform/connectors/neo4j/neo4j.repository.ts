import neo4j, { Driver, QueryResult, SessionMode } from 'neo4j-driver';

import { Neo4jConnector } from './neo4j-connector.module';

export type Neo4jAccessMode = 'READ' | 'WRITE';

export type Neo4jQueryOptions = {
  database?: string;
  accessMode?: Neo4jAccessMode;
};

export class Neo4jRepository {
  constructor(private readonly connector: Neo4jConnector) {}

  get driver(): Driver {
    return this.connector.driver;
  }

  async query<T = Record<string, unknown>>(
    cypher: string,
    params: Record<string, unknown> = {},
    options?: Neo4jQueryOptions,
  ): Promise<T[]> {
    const result = await this.run(cypher, params, options);
    return result.records.map((record) => this.normalizeValue(record.toObject()) as T);
  }

  async execute(
    cypher: string,
    params: Record<string, unknown> = {},
    options?: Neo4jQueryOptions,
  ): Promise<void> {
    await this.run(cypher, params, options);
  }

  private async run(
    cypher: string,
    params: Record<string, unknown>,
    options?: Neo4jQueryOptions,
  ): Promise<QueryResult> {
    const session = this.driver.session({
      database: options?.database ?? this.connector.defaultDatabase,
      defaultAccessMode: this.toSessionMode(options?.accessMode),
    });

    try {
      return await session.run(cypher, params);
    } finally {
      await session.close();
    }
  }

  private toSessionMode(mode?: Neo4jAccessMode): SessionMode {
    if (mode === 'READ') {
      return neo4j.session.READ;
    }
    return neo4j.session.WRITE;
  }

  private normalizeValue(value: unknown): unknown {
    if (neo4j.isInt(value)) {
      return value.inSafeRange() ? value.toNumber() : value.toString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeValue(item));
    }

    if (value && typeof value === 'object') {
      const normalizedEntries = Object.entries(value).map(([key, nestedValue]) => [
        key,
        this.normalizeValue(nestedValue),
      ]);
      return Object.fromEntries(normalizedEntries);
    }

    return value;
  }
}
