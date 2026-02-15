import { Module } from '@nestjs/common';

import { APP_CONFIG_TOKEN, AppConfig, ConfigModule } from '../../config/transport';
import { HealthService } from '../application/health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule],
  controllers: [HealthController],
  providers: [
    {
      provide: HealthService,
      inject: [APP_CONFIG_TOKEN],
      useFactory: (config: AppConfig) => new HealthService(config.schemaMode),
    },
  ],
  exports: [HealthService],
})
export class HealthModule {}
