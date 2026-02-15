import { Module } from '@nestjs/common';

import { APP_CONFIG_TOKEN, AppConfig, ConfigModule } from '../../config/transport';
import { NoopExporter } from '../adapters/noop-exporter';
import { OtlpHttpExporter } from '../adapters/otlp-http-exporter';
import { ObservabilityService } from '../application/observability.service';
import { OBSERVABILITY_EXPORTER_TOKEN } from './tokens';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: OBSERVABILITY_EXPORTER_TOKEN,
      inject: [APP_CONFIG_TOKEN],
      useFactory: (config: AppConfig) => {
        if (!config.isOtelSidecarAvailable) {
          return new NoopExporter();
        }
        return new OtlpHttpExporter(config.otelSidecarEndpoint);
      },
    },
    {
      provide: ObservabilityService,
      inject: [APP_CONFIG_TOKEN, OBSERVABILITY_EXPORTER_TOKEN],
      useFactory: (config: AppConfig, exporter: NoopExporter | OtlpHttpExporter) =>
        new ObservabilityService(
          config.otelSidecarEndpoint,
          config.isOtelSidecarAvailable,
          'sample-nest',
          config.appEnv,
          exporter,
        ),
    },
  ],
  exports: [ObservabilityService],
})
export class ObservabilityModule {}
