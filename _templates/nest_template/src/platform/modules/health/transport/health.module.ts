import { Module } from '@nestjs/common'

import { MiddlewareExceptionFilter } from '../../../transport/http/filters'
import { ResponseFactory } from '../../../transport/http/response.factory'
import { AppConfigProvider, ConfigModule } from '../../config/transport'
import { HealthService } from '../application/health.service'
import { HealthController } from './health.controller'

@Module({
  imports: [ConfigModule],
  controllers: [HealthController],
  providers: [
    ResponseFactory,
    MiddlewareExceptionFilter,
    {
      provide: HealthService,
      inject: [AppConfigProvider],
      useFactory: (configProvider: AppConfigProvider) =>
        new HealthService(configProvider.value.schemaMode),
    },
  ],
  exports: [HealthService],
})
export class HealthModule {}
