import { Module } from '@nestjs/common'

import { AppConfigProvider, ConfigModule } from '../../config/transport'
import { NoopExporter } from '../adapters/noop-exporter'
import { OtlpHttpExporter } from '../adapters/otlp-http-exporter'
import { ObservabilityService } from '../application/observability.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ObservabilityService,
      inject: [AppConfigProvider],
      useFactory: (appConfigProvider: AppConfigProvider) => {
        const { value: config } = appConfigProvider
        const exporter = !config.isOtelSidecarAvailable
          ? new NoopExporter()
          : new OtlpHttpExporter(config.otelSidecarEndpoint)

        return new ObservabilityService(
          config.otelSidecarEndpoint,
          config.isOtelSidecarAvailable,
          'sample-nest',
          config.appEnv,
          exporter,
        )
      },
    },
  ],
  exports: [ObservabilityService],
})
export class ObservabilityModule {}
