import { PostgresConnectorOptions } from '../../connectors/postgres';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

export type PostgresMigrationOptions = {
  connector: PostgresConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
};

export type PostgresMigrationAsyncOptions = ConnectorAsyncOptions<PostgresMigrationOptions>;
