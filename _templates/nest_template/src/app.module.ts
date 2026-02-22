import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { ConfigModule } from '@core/modules/config/transport'
import { connectorImports } from '@core/modules/connectors/transport'
import { HealthModule } from '@core/modules/health/transport'
import { IntegrationPolicyModule } from '@core/modules/integration-policy/transport'
import { MigrationsModule } from '@core/modules/migrations/transport'
import { ObservabilityModule } from '@core/modules/observability/transport'
import { GrpcTransportModule } from '@core/transport/grpc'
import {
  MiddlewareExceptionFilter,
  AuthGuard,
  PolicyGuard,
  TimingInterceptor,
  RequestContextMiddleware,
  ResponseFactory,
} from '@core/transport/http'

@Module({
  imports: [
    ConfigModule,
    MigrationsModule,
    ...connectorImports,
    IntegrationPolicyModule,
    ObservabilityModule,
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
    consumer.apply(RequestContextMiddleware).forRoutes('*')
  }
}
