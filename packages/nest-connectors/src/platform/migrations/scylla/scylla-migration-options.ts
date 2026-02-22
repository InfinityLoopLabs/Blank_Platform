import { ScyllaConnectorOptions } from '../../connectors/scylla';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

/**
 * Runtime configuration for scylla migrations.
 */
export type ScyllaMigrationOptions = {
  connector: ScyllaConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
  migrationsKeyspace?: string;
  keyspacePlaceholder?: string;
};

/**
 * Async wrapper for integrating scylla migrations into Nest DI.
 */
export type ScyllaMigrationAsyncOptions = ConnectorAsyncOptions<ScyllaMigrationOptions>;
