export type AppConfig = {
  appEnv: string;
  appPort: number;
  schemaMode: 'ok' | 'dirty' | 'checksum_mismatch' | 'missing_version' | 'db_down';
  otelSidecarEndpoint: string;
  isOtelSidecarAvailable: boolean;
};
