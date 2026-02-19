import { ClickHouseConnector } from './clickhouse-connector.module';

export type ClickHouseEntityRepositoryOptions<TEntity, TId = string> = {
  tableName: string;
  idColumn?: string;
  idType?: string;
  mapFromRow?: (row: Record<string, unknown>) => TEntity;
  mapToRow?: (entity: TEntity) => Record<string, unknown>;
};

export class ClickHouseEntityRepository<TEntity, TId = string> {
  private readonly tableName: string;
  private readonly tableSql: string;
  private readonly idColumnSql: string;
  private readonly idType: string;
  private readonly mapFromRow: (row: Record<string, unknown>) => TEntity;
  private readonly mapToRow: (entity: TEntity) => Record<string, unknown>;

  constructor(
    private readonly database: ClickHouseRepository,
    options: ClickHouseEntityRepositoryOptions<TEntity, TId>,
  ) {
    this.tableName = validateIdentifierPath(options.tableName);
    this.tableSql = quoteIdentifierPath(options.tableName);
    this.idColumnSql = quoteIdentifierPath(options.idColumn ?? 'id');
    this.idType = options.idType ?? 'String';
    this.mapFromRow = options.mapFromRow ?? ((row: Record<string, unknown>) => row as TEntity);
    this.mapToRow = options.mapToRow ?? ((entity: TEntity) => entity as Record<string, unknown>);
  }

  async findById(id: TId): Promise<TEntity | null> {
    const row = await this.database.queryOne<Record<string, unknown>>(
      `SELECT * FROM ${this.tableSql} WHERE ${this.idColumnSql} = {id:${this.idType}} LIMIT 1`,
      { id },
    );
    return row ? this.mapFromRow(row) : null;
  }

  async findManyByIds(ids: TId[]): Promise<TEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    const rows = await this.database.queryRows<Record<string, unknown>>(
      `SELECT * FROM ${this.tableSql} WHERE ${this.idColumnSql} IN {ids:Array(${this.idType})}`,
      { ids },
    );
    return rows.map((row) => this.mapFromRow(row));
  }

  async insert(entity: TEntity): Promise<boolean> {
    return this.database.insertRows(this.tableName, [this.mapToRow(entity)]);
  }

  async insertMany(entities: TEntity[]): Promise<boolean> {
    if (entities.length === 0) {
      return false;
    }
    return this.database.insertRows(
      this.tableName,
      entities.map((entity) => this.mapToRow(entity)),
    );
  }

  async count(): Promise<number> {
    const row = await this.database.queryOne<{ count: number | string }>(
      `SELECT count() AS count FROM ${this.tableSql}`,
    );
    return Number(row?.count ?? 0);
  }
}

function validateIdentifierPath(value: string): string {
  const parts = value.split('.');
  if (parts.length === 0) {
    throw new Error('Identifier must not be empty');
  }
  parts.forEach((part) => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) {
      throw new Error(`Invalid identifier: ${value}`);
    }
  });
  return parts.join('.');
}

export class ClickHouseRepository {
  constructor(private readonly connector: ClickHouseConnector) {}

  async ping(): Promise<boolean> {
    const result = await this.connector.client.ping();
    return result.success;
  }

  async queryRows<T extends Record<string, unknown> = Record<string, unknown>>(
    query: string,
    queryParams?: Record<string, unknown>,
  ): Promise<T[]> {
    const resultSet = await this.connector.client.query({
      query,
      format: 'JSONEachRow',
      query_params: queryParams,
    });
    return resultSet.json<T>();
  }

  async queryOne<T extends Record<string, unknown> = Record<string, unknown>>(
    query: string,
    queryParams?: Record<string, unknown>,
  ): Promise<T | null> {
    const rows = await this.queryRows<T>(query, queryParams);
    return rows[0] ?? null;
  }

  async command(query: string, queryParams?: Record<string, unknown>): Promise<string> {
    const result = await this.connector.client.command({
      query,
      query_params: queryParams,
    });
    return result.query_id;
  }

  async insertRows<T extends Record<string, unknown>>(
    table: string,
    rows: T[],
    columns?: string[],
  ): Promise<boolean> {
    if (rows.length === 0) {
      return false;
    }

    const insertColumns =
      columns && columns.length > 0 ? (columns as [string, ...string[]]) : undefined;

    const result = await this.connector.client.insert({
      table,
      values: rows,
      columns: insertColumns,
      format: 'JSONEachRow',
    });

    return result.executed;
  }

  forEntity<TEntity, TId = string>(
    options: ClickHouseEntityRepositoryOptions<TEntity, TId>,
  ): ClickHouseEntityRepository<TEntity, TId> {
    return new ClickHouseEntityRepository<TEntity, TId>(this, options);
  }
}

function quoteIdentifierPath(value: string): string {
  const parts = value.split('.');
  if (parts.length === 0) {
    throw new Error('Identifier must not be empty');
  }

  const quoted = parts.map((part) => {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) {
      throw new Error(`Invalid identifier: ${value}`);
    }
    return `\`${part}\``;
  });

  return quoted.join('.');
}
