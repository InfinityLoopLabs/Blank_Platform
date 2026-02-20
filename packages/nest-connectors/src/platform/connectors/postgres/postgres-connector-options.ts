import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type PostgresConnectorOptions = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  maxPoolSize?: number;
  idleTimeoutMs?: number;
  connectionTimeoutMs?: number;
};

export type PostgresConnectorAsyncOptions = ConnectorAsyncOptions<PostgresConnectorOptions>;
