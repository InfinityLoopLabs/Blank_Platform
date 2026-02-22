import {
  ClickHouseMigrationService,
  MigrationCommand,
  PostgresMigrationService,
  ScyllaMigrationService,
} from '@infinityloop.labs/nest-connectors'
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Optional,
} from '@nestjs/common'

import { ConfigService } from '../../config/transport'

type MigrationRunnerType = {
  run(command: MigrationCommand): Promise<void>
}

/**
 * Runs schema migrations during application bootstrap.
 *
 * Behavior:
 * - reads feature flags from ConfigService
 * - runs only enabled engines
 * - fails startup if engine is enabled but migration provider is missing
 * - applies only pending migrations (`up`) and relies on journal tables for idempotency
 */
@Injectable()
export class MigrationBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationBootstrapService.name)

  constructor(
    private readonly configService: ConfigService,
    @Optional() private readonly postgresMigration?: PostgresMigrationService,
    @Optional()
    private readonly clickHouseMigration?: ClickHouseMigrationService,
    @Optional() private readonly scyllaMigration?: ScyllaMigrationService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.runWhenEnabled(
      'POSTGRES_ENABLED',
      'postgres',
      this.postgresMigration,
    )
    await this.runWhenEnabled(
      'CLICKHOUSE_ENABLED',
      'clickhouse',
      this.clickHouseMigration,
    )
    await this.runWhenEnabled('SCYLLA_ENABLED', 'scylla', this.scyllaMigration)
  }

  /**
   * Executes migration cycle (`status` -> `up` -> `status`) for a single engine
   * when its feature flag is enabled.
   */
  private async runWhenEnabled(
    flagKey: string,
    engine: string,
    service?: MigrationRunnerType,
  ): Promise<void> {
    if (!this.configService.getBoolean(flagKey, false)) {
      this.logger.log(`skip ${engine} migrations (${flagKey}=false)`)

      return
    }

    if (!service) {
      throw new Error(
        `Migration service is not available for ${engine}, but ${flagKey}=true`,
      )
    }

    const startedAt = Date.now()
    this.logger.log(`[${engine}] migration bootstrap started`)

    try {
      this.logger.log(`[${engine}] status before apply`)
      await service.run('status')

      this.logger.log(`[${engine}] apply pending migrations`)
      await service.run('up')

      this.logger.log(`[${engine}] status after apply`)
      await service.run('status')

      this.logger.log(
        `[${engine}] migration bootstrap completed in ${Date.now() - startedAt}ms`,
      )
    } catch (error: unknown) {
      const elapsed = Date.now() - startedAt
      const details = error instanceof Error ? error : new Error(String(error))
      this.logger.error(
        `[${engine}] migration bootstrap failed in ${elapsed}ms: ${details.message}`,
        details.stack,
      )
      throw error
    }
  }
}
