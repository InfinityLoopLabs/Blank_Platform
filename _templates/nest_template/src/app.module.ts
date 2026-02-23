import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { ConfigModule } from '@core/modules/config/transport'
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
import { ClickHouseModule } from '@infrastructure/clickhouse/clickhouse.module'
import { KafkaModule } from '@infrastructure/kafka/kafka.module'
import { MinioModule } from '@infrastructure/minio/minio.module'
import { Neo4jModule } from '@infrastructure/neo4j/neo4j.module'
import { PostgresModule } from '@infrastructure/postgres/postgres.module'
import { QdrantModule } from '@infrastructure/qdrant/qdrant.module'
import { RedisModule } from '@infrastructure/redis/redis.module'
import { ScyllaModule } from '@infrastructure/scylla/scylla.module'

@Module({
  imports: [
    ConfigModule,
    MigrationsModule,
    PostgresModule,
    ClickHouseModule,
    ScyllaModule,
    RedisModule,
    KafkaModule,
    MinioModule,
    Neo4jModule,
    QdrantModule,
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
