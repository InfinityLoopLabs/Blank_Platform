import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type Neo4jConnectorOptions = {
  uri: string;
  user: string;
  password: string;
  database?: string;
  maxConnectionPoolSize?: number;
  connectionTimeoutMs?: number;
};

export type Neo4jConnectorAsyncOptions = ConnectorAsyncOptions<Neo4jConnectorOptions>;
