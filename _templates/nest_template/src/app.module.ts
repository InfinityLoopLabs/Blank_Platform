import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { SampleRepositoryMemory } from './features/sample/adapters/memory/sample.repository.memory';
import { CreateSampleUseCase } from './features/sample/application/create-sample.use-case';
import { SamplesController } from './features/sample/transport/http/sample.controller';
import {
  ClickHouseConnectorModule,
  KafkaConnectorModule,
  MinioConnectorModule,
  PostgresConnectorModule,
  RedisConnectorModule,
  ScyllaConnectorModule,
} from './platform/connectors';
import { ConfigModule, EnvConfigRepository } from './platform/modules/config/transport';
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

const runtimeEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development').trim() || 'development';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${runtimeEnv}`, '.env'],
      expandVariables: true,
    }),
    ConfigModule,
    PostgresConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: env.get('POSTGRES_HOST') ?? 'localhost',
          port: readInt(env.get('POSTGRES_PORT'), 20432),
          database: env.get('POSTGRES_DB') ?? 'app',
          user: env.get('POSTGRES_USER') ?? 'app',
          password: env.get('POSTGRES_PASSWORD') ?? 'app',
        };
      },
    }),
    ClickHouseConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          url: env.get('CLICKHOUSE_URL') ?? 'http://localhost:20123',
          database: env.get('CLICKHOUSE_DATABASE') || undefined,
          username: env.get('CLICKHOUSE_USER') || undefined,
          password: env.get('CLICKHOUSE_PASSWORD') || undefined,
          requestTimeoutMs: readInt(env.get('CLICKHOUSE_TIMEOUT_MS'), 5000),
        };
      },
    }),
    ScyllaConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          contactPoints: (env.get('SCYLLA_CONTACT_POINTS') ?? 'localhost:20042')
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          localDataCenter: env.get('SCYLLA_LOCAL_DC') ?? 'datacenter1',
          keyspace: env.get('SCYLLA_KEYSPACE') || undefined,
          username: env.get('SCYLLA_USERNAME') || undefined,
          password: env.get('SCYLLA_PASSWORD') || undefined,
        };
      },
    }),
    RedisConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          host: env.get('REDIS_HOST') ?? 'localhost',
          port: readInt(env.get('REDIS_PORT'), 20379),
          db: readInt(env.get('REDIS_DB'), 0),
          password: env.get('REDIS_PASSWORD') || undefined,
        };
      },
    }),
    KafkaConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          client: {
            clientId: env.get('KAFKA_CLIENT_ID') ?? 'sample-nest',
            brokers: (env.get('KAFKA_BROKERS') ?? 'localhost:20092')
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0),
          },
          consumer: {
            groupId: env.get('KAFKA_GROUP_ID') ?? 'sample-nest-group',
          },
        };
      },
    }),
    MinioConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (...args: unknown[]) => {
        const env = args[0] as EnvConfigRepository;
        return {
          endPoint: env.get('MINIO_ENDPOINT') ?? 'localhost',
          port: readInt(env.get('MINIO_PORT'), 20000),
          useSSL: readBool(env.get('MINIO_USE_SSL'), false),
          accessKey: env.get('MINIO_ACCESS_KEY') ?? 'minioadmin',
          secretKey: env.get('MINIO_SECRET_KEY') ?? 'minioadmin',
          region: env.get('MINIO_REGION') || undefined,
        };
      },
    }),
    IntegrationPolicyModule,
    ObservabilityModule,
    HealthModule,
    GrpcTransportModule,
  ],
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

function readInt(value: string | undefined, fallback: number): number {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Invalid integer value: ${value}`);
  }
  return parsed;
}

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  throw new Error(`Invalid boolean value: ${value}`);
}
