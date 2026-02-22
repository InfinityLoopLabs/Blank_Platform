import { ScyllaConnectorOptions } from '../../connectors/scylla';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

export type ScyllaMigrationOptions = {
  connector: ScyllaConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
  migrationsKeyspace?: string;
  keyspacePlaceholder?: string;
};

export type ScyllaMigrationAsyncOptions = ConnectorAsyncOptions<ScyllaMigrationOptions>;
