import { Injectable, Logger, OnApplicationBootstrap, Optional } from '@nestjs/common';
import {
  ClickHouseMigrationService,
  MigrationCommand,
  PostgresMigrationService,
  ScyllaMigrationService,
} from '@infinityloop.labs/nest-connectors';

type MigrationRunner = {
  run(command: MigrationCommand): Promise<void>;
};

@Injectable()
export class MigrationBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationBootstrapService.name);

  constructor(
    @Optional() private readonly postgresMigration?: PostgresMigrationService,
    @Optional() private readonly clickHouseMigration?: ClickHouseMigrationService,
    @Optional() private readonly scyllaMigration?: ScyllaMigrationService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.runOne('postgres', this.postgresMigration);
    await this.runOne('clickhouse', this.clickHouseMigration);
    await this.runOne('scylla', this.scyllaMigration);
  }

  private async runOne(engine: string, service?: MigrationRunner): Promise<void> {
    if (!service) {
      this.logger.log(`skip ${engine} migrations (module is disabled)`);
      return;
    }

    this.logger.log(`apply ${engine} migrations`);
    await service.run('up');
    this.logger.log(`${engine} migrations are up to date`);
  }
}
