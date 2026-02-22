import { Module } from '@nestjs/common'

import { MigrationBootstrapService } from '../application/migration-bootstrap.service'
import { migrationImports } from './migration-imports'

@Module({
  imports: [...migrationImports],
  providers: [MigrationBootstrapService],
  exports: [MigrationBootstrapService],
})
export class MigrationsModule {}
