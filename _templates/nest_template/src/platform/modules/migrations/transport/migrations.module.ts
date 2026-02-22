import { Module } from '@nestjs/common'

import { ConfigModule } from '../../config/transport'
import { MigrationBootstrapService } from '../application/migration-bootstrap.service'
import { migrationImports } from './migration-imports'

/**
 * Wires all migration providers used by the platform and exposes bootstrap runner.
 * AppModule imports this module to execute startup migrations for enabled engines.
 */
@Module({
  imports: [ConfigModule, ...migrationImports],
  providers: [MigrationBootstrapService],
  exports: [MigrationBootstrapService],
})
export class MigrationsModule {}
