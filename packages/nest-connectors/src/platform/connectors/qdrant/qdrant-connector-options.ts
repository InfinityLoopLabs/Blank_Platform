import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type QdrantConnectorOptions = {
  url: string;
  apiKey?: string;
  timeoutMs?: number;
  checkCompatibility?: boolean;
};

export type QdrantConnectorAsyncOptions = ConnectorAsyncOptions<QdrantConnectorOptions>;
