import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@core/modules/config/transport';
import { connectorImports } from '@core/modules/connectors/transport';
import { HealthModule } from '@core/modules/health/transport';
import { IntegrationPolicyModule } from '@core/modules/integration-policy/transport';
import { MigrationsModule } from '@core/modules/migrations/transport';
import { ObservabilityModule } from '@core/modules/observability/transport';
import { GrpcTransportModule } from '@core/transport/grpc';
import { MiddlewareExceptionFilter } from '@core/transport/http';
import { AuthGuard, PolicyGuard } from '@core/transport/http';
import { TimingInterceptor } from '@core/transport/http';
import { RequestContextMiddleware } from '@core/transport/http';
import { ResponseFactory } from '@core/transport/http';

@Module({
  imports: [
    ConfigModule,
    ...connectorImports,
    IntegrationPolicyModule,
    ObservabilityModule,
    MigrationsModule,
    HealthModule,
    GrpcTransportModule,
  ],
  controllers: [],
  providers: [
    ResponseFactory,
    AuthGuard,
    PolicyGuard,
    TimingInterceptor,
    MiddlewareExceptionFilter,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
