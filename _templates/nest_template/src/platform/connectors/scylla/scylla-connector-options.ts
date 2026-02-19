import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type ScyllaConnectorOptions = {
  contactPoints: string[];
  localDataCenter: string;
  keyspace?: string;
  username?: string;
  password?: string;
};

export type ScyllaConnectorAsyncOptions = ConnectorAsyncOptions<ScyllaConnectorOptions>;
