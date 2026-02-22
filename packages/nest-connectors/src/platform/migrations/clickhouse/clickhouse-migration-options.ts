import { ClickHouseConnectorOptions } from '../../connectors/clickhouse';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

/**
 * Runtime configuration for clickhouse migrations.
 */
export type ClickHouseMigrationOptions = {
  connector: ClickHouseConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
};

/**
 * Async wrapper for integrating clickhouse migrations into Nest DI.
 */
export type ClickHouseMigrationAsyncOptions = ConnectorAsyncOptions<ClickHouseMigrationOptions>;
