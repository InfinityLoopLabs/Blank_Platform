import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type ClickHouseConnectorOptions = {
  url: string;
  database?: string;
  username?: string;
  password?: string;
  requestTimeoutMs?: number;
};

export type ClickHouseConnectorAsyncOptions = ConnectorAsyncOptions<ClickHouseConnectorOptions>;
