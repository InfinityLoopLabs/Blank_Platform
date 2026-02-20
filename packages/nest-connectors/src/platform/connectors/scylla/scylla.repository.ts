import { Client, QueryOptions, types } from 'cassandra-driver';

import { ScyllaConnector } from './scylla-connector.module';

type ScyllaBatchItem = string | { query: string; params?: unknown[] | Record<string, unknown> };

export type ScyllaEntityRepositoryOptions<TEntity, TId = string> = {
  keyspace?: string;
  tableName: string;
  idColumn?: string;
  mapFromRow?: (row: types.Row) => TEntity;
  mapToColumns?: (entity: TEntity) => Record<string, unknown>;
};

export class ScyllaEntityRepository<TEntity, TId = string> {
  private readonly tableCql: string;
  private readonly idColumnCql: string;
  private readonly mapFromRow: (row: types.Row) => TEntity;
  private readonly mapToColumns: (entity: TEntity) => Record<string, unknown>;

  constructor(
    private readonly database: ScyllaRepository,
    options: ScyllaEntityRepositoryOptions<TEntity, TId>,
  ) {
    this.tableCql = toCqlTableName(options.tableName, options.keyspace);
    this.idColumnCql = toCqlIdentifier(options.idColumn ?? 'id');
    this.mapFromRow = options.mapFromRow ?? ((row: types.Row) => row as unknown as TEntity);
    this.mapToColumns = options.mapToColumns ?? ((entity: TEntity) => entity as Record<string, unknown>);
  }

  async findById(id: TId): Promise<TEntity | null> {
    const rows = await this.database.executePrepared<types.Row>(
      `SELECT * FROM ${this.tableCql} WHERE ${this.idColumnCql} = ? LIMIT 1`,
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return this.mapFromRow(rows[0]);
  }

  async findAll(limit = 100): Promise<TEntity[]> {
    const rows = await this.database.executePrepared<types.Row>(
      `SELECT * FROM ${this.tableCql} LIMIT ?`,
      [limit],
    );
    return rows.map((row) => this.mapFromRow(row));
  }

  async upsert(entity: TEntity): Promise<void> {
    const columns = this.mapToColumns(entity);
    const keys = Object.keys(columns);
    if (keys.length === 0) {
      throw new Error('ScyllaEntityRepository.upsert requires at least one column');
    }

    const columnsSql = keys.map((key) => toCqlIdentifier(key)).join(', ');
    const placeholdersSql = keys.map(() => '?').join(', ');
    const values = keys.map((key) => columns[key]);

    await this.database.executePrepared(
      `INSERT INTO ${this.tableCql} (${columnsSql}) VALUES (${placeholdersSql})`,
      values,
    );
  }

  async deleteById(id: TId): Promise<void> {
    await this.database.executePrepared(`DELETE FROM ${this.tableCql} WHERE ${this.idColumnCql} = ?`, [id]);
  }
}

export class ScyllaRepository {
  constructor(private readonly connector: ScyllaConnector) {}

  get client(): Client {
    return this.connector.client;
  }

  async execute<T = types.Row>(
    query: string,
    params: unknown[] | Record<string, unknown> = [],
    options: QueryOptions = {},
  ): Promise<T[]> {
    const result = await this.client.execute(query, params, options);
    return result.rows as T[];
  }

  async executePrepared<T = types.Row>(
    query: string,
    params: unknown[] | Record<string, unknown> = [],
    options: QueryOptions = {},
  ): Promise<T[]> {
    const result = await this.client.execute(query, params, {
      ...options,
      prepare: true,
    });
    return result.rows as T[];
  }

  async one<T = types.Row>(
    query: string,
    params: unknown[] | Record<string, unknown> = [],
    options: QueryOptions = {},
  ): Promise<T | null> {
    const rows = await this.execute<T>(query, params, options);
    return rows[0] ?? null;
  }

  async batch(queries: ScyllaBatchItem[], options: QueryOptions = {}): Promise<void> {
    await this.client.batch(queries, options);
  }

  forEntity<TEntity, TId = string>(
    options: ScyllaEntityRepositoryOptions<TEntity, TId>,
  ): ScyllaEntityRepository<TEntity, TId> {
    return new ScyllaEntityRepository<TEntity, TId>(this, options);
  }
}

function toCqlTableName(tableName: string, keyspace?: string): string {
  const table = toCqlIdentifier(tableName);
  if (!keyspace) {
    return table;
  }
  return `${toCqlIdentifier(keyspace)}.${table}`;
}

function toCqlIdentifier(value: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid CQL identifier: ${value}`);
  }
  return value;
}
