import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type MinioConnectorOptions = {
  endPoint: string;
  port?: number;
  useSSL?: boolean;
  accessKey: string;
  secretKey: string;
  region?: string;
  sessionToken?: string;
  pathStyle?: boolean;
};

export type MinioConnectorAsyncOptions = ConnectorAsyncOptions<MinioConnectorOptions>;
