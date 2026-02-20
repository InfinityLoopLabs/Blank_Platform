import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from './platform/modules/config/transport';
import { connectorImports } from './platform/modules/connectors/transport';
import { HealthModule } from './platform/modules/health/transport';
import { IntegrationPolicyModule } from './platform/modules/integration-policy/transport';
import { ObservabilityModule } from './platform/modules/observability/transport';
import { GrpcTransportModule } from './platform/transport/grpc';
import { MiddlewareExceptionFilter } from './platform/transport/http/filters';
import { AuthGuard, PolicyGuard } from './platform/transport/http/guards';
import { TimingInterceptor } from './platform/transport/http/interceptors';
import { RequestContextMiddleware } from './platform/transport/http/middleware';
import { ResponseFactory } from './platform/transport/http/response.factory';

@Module({
  imports: [
    ConfigModule,
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
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
