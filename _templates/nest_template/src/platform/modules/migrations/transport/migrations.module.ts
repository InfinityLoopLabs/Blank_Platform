import { Module } from '@nestjs/common'

import { ConfigModule } from '../../config/transport'
import { MigrationBootstrapService } from '../application/migration-bootstrap.service'
import { migrationImports } from './migration-imports'

@Module({
  imports: [ConfigModule, ...migrationImports],
  providers: [MigrationBootstrapService],
  exports: [MigrationBootstrapService],
})
export class MigrationsModule {}
