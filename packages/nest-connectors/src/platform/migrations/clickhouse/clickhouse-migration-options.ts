import { ClickHouseConnectorOptions } from '../../connectors/clickhouse';
import { ConnectorAsyncOptions } from '../../connectors/shared/connector-async-options';

export type ClickHouseMigrationOptions = {
  connector: ClickHouseConnectorOptions;
  migrationsDirectory?: string;
  journalTable?: string;
  upSuffix?: string;
  downSuffix?: string;
};

export type ClickHouseMigrationAsyncOptions = ConnectorAsyncOptions<ClickHouseMigrationOptions>;
