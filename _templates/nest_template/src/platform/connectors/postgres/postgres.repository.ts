import { Pool, PoolClient, QueryResultRow } from 'pg';

import { PostgresConnector } from './postgres-connector.module';

export type PostgresEntityRepositoryOptions<TEntity, TId = string> = {
  tableName: string;
  idColumn?: string;
  mapFromRow?: (row: Record<string, unknown>) => TEntity;
  mapToRow?: (entity: TEntity) => Record<string, unknown>;
};

export class PostgresEntityRepository<TEntity, TId = string> {
  private readonly tableSql: string;
  private readonly idColumnSql: string;
  private readonly mapFromRow: (row: Record<string, unknown>) => TEntity;
  private readonly mapToRow: (entity: TEntity) => Record<string, unknown>;

  constructor(
    private readonly database: PostgresRepository,
    options: PostgresEntityRepositoryOptions<TEntity, TId>,
  ) {
    this.tableSql = quoteIdentifierPath(options.tableName);
    this.idColumnSql = quoteIdentifierPath(options.idColumn ?? 'id');
    this.mapFromRow = options.mapFromRow ?? ((row: Record<string, unknown>) => row as TEntity);
    this.mapToRow = options.mapToRow ?? ((entity: TEntity) => entity as Record<string, unknown>);
  }

  async findById(id: TId): Promise<TEntity | null> {
    const row = await this.database.one<Record<string, unknown>>(
      `SELECT * FROM ${this.tableSql} WHERE ${this.idColumnSql} = $1 LIMIT 1`,
      [id],
    );
    return row ? this.mapFromRow(row) : null;
  }

  async findAll(limit = 100, offset = 0): Promise<TEntity[]> {
    const rows = await this.database.query<Record<string, unknown>>(
      `SELECT * FROM ${this.tableSql} LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows.map((row) => this.mapFromRow(row));
  }

  async insert(entity: TEntity): Promise<TEntity> {
    const row = this.mapToRow(entity);
    const keys = Object.keys(row);
    if (keys.length === 0) {
      throw new Error('PostgresEntityRepository.insert requires at least one column');
    }

    const columnsSql = keys.map((key) => quoteIdentifierPath(key)).join(', ');
    const valuesSql = keys.map((_, index) => `$${index + 1}`).join(', ');
    const values = keys.map((key) => row[key]);

    const inserted = await this.database.one<Record<string, unknown>>(
      `INSERT INTO ${this.tableSql} (${columnsSql}) VALUES (${valuesSql}) RETURNING *`,
      values,
    );
    if (!inserted) {
      throw new Error('PostgresEntityRepository.insert did not return a row');
    }
    return this.mapFromRow(inserted);
  }

  async updateById(id: TId, patch: Record<string, unknown>): Promise<TEntity | null> {
    const keys = Object.keys(patch);
    if (keys.length === 0) {
      return this.findById(id);
    }

    const setSql = keys.map((key, index) => `${quoteIdentifierPath(key)} = $${index + 1}`).join(', ');
    const values = keys.map((key) => patch[key]);
    const updated = await this.database.one<Record<string, unknown>>(
      `UPDATE ${this.tableSql} SET ${setSql} WHERE ${this.idColumnSql} = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );
    return updated ? this.mapFromRow(updated) : null;
  }

  async deleteById(id: TId): Promise<boolean> {
    const affected = await this.database.execute(
      `DELETE FROM ${this.tableSql} WHERE ${this.idColumnSql} = $1`,
      [id],
    );
    return affected > 0;
  }
}

export class PostgresRepository {
  constructor(private readonly connector: PostgresConnector) {}

  get pool(): Pool {
    return this.connector.pool;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: readonly unknown[] = [],
  ): Promise<T[]> {
    const result = await this.pool.query<T>(text, [...params]);
    return result.rows;
  }

  async many<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: readonly unknown[] = [],
  ): Promise<T[]> {
    return this.query<T>(text, params);
  }

  async one<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: readonly unknown[] = [],
  ): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows[0] ?? null;
  }

  async execute(text: string, params: readonly unknown[] = []): Promise<number> {
    const result = await this.pool.query(text, [...params]);
    return result.rowCount ?? 0;
  }

  async transaction<T>(handler: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const value = await handler(client);
      await client.query('COMMIT');
      return value;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  forEntity<TEntity, TId = string>(
    options: PostgresEntityRepositoryOptions<TEntity, TId>,
  ): PostgresEntityRepository<TEntity, TId> {
    return new PostgresEntityRepository<TEntity, TId>(this, options);
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
    return `"${part}"`;
  });

  return quoted.join('.');
}
