import { PostgresConnectorOptions } from '../../connectors/postgres';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

/**
 * Runtime configuration for postgres migrations.
 */
export type PostgresMigrationOptions = {
  connector: PostgresConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
};

/**
 * Async wrapper for integrating postgres migrations into Nest DI.
 */
export type PostgresMigrationAsyncOptions = ConnectorAsyncOptions<PostgresMigrationOptions>;
