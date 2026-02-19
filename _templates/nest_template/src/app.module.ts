import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { SampleRepositoryMemory } from './features/sample/adapters/memory/sample.repository.memory';
import { CreateSampleUseCase } from './features/sample/application/create-sample.use-case';
import { SamplesController } from './features/sample/transport/http/sample.controller';
import { ConfigModule } from './platform/modules/config/transport';
import { HealthModule } from './platform/modules/health/transport';
import { IntegrationPolicyModule } from './platform/modules/integration-policy/transport';
import { ObservabilityModule } from './platform/modules/observability/transport';
import { GrpcTransportModule } from './platform/transport/grpc';
import { MiddlewareExceptionFilter } from './platform/transport/http/filters';
import { AuthGuard, PolicyGuard } from './platform/transport/http/guards';
import { TimingInterceptor } from './platform/transport/http/interceptors';
import { RequestContextMiddleware } from './platform/transport/http/middleware';
import { RequestValidationPipe } from './platform/transport/http/pipes';
import { ResponseFactory } from './platform/transport/http/response.factory';

@Module({
  imports: [ConfigModule, IntegrationPolicyModule, ObservabilityModule, HealthModule, GrpcTransportModule],
  controllers: [SamplesController],
  providers: [
    ResponseFactory,
    AuthGuard,
    PolicyGuard,
    RequestValidationPipe,
    TimingInterceptor,
    MiddlewareExceptionFilter,
    SampleRepositoryMemory,
    {
      provide: CreateSampleUseCase,
      inject: [SampleRepositoryMemory],
      useFactory: (repository: SampleRepositoryMemory) => new CreateSampleUseCase(repository),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
