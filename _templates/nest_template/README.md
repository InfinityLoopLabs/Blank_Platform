# NestJS Template (Reference Slice)

## Structure

- `src/features/sample/domain`
- `src/features/sample/application`
- `src/features/sample/ports`
- `src/features/sample/adapters`
- `src/features/sample/transport`
- `src/platform/*` for cross-cutting technical modules
- `src/platform/transport/http` canonical HTTP request flow primitives
- `src/platform/transport/grpc` gRPC transport scaffold
- `src/platform/modules/config/{domain,application,ports,adapters,transport}` for replaceable app config source (`env`, `server`, etc.)
- `src/platform/connectors/<connector>` for isolated connector modules (options/types are рядом с модулем, без `types/` подпапок)
- `src/platform/modules/integration-policy/{domain,application,transport}` for integration capabilities config (postgres/kafka/redis/... flags + endpoints)
- `src/platform/modules/observability/{domain,application,ports,adapters,transport}` for sidecar-only OTLP export
- `src/platform/modules/health/{domain,application,transport}` for health/readiness/health status module

## Notes

Nest wiring uses framework-native DI and middleware primitives:

- `AppModule` providers for IoC
- middleware, guards, pipes, interceptors, exception filter
- unified response envelope via `ResponseFactory`

## Connectors

Each connector is an independent Nest module with canonical API:

- `register(options)` for static setup
- `registerAsync({ imports, inject, useFactory })` for IoC setup via config module

Available modules and exported classes:

- `PostgresConnectorModule` -> `PostgresConnector`, `PostgresRepository`
- `ClickHouseConnectorModule` -> `ClickHouseConnector`, `ClickHouseRepository`
- `ScyllaConnectorModule` -> `ScyllaConnector`, `ScyllaRepository`
- `RedisConnectorModule` -> `RedisConnector`, `RedisRepository`
- `KafkaConnectorModule` -> `KafkaConnector`, `KafkaRepository`
- `MinioConnectorModule` -> `MinioConnector`, `MinioRepository`

You can import only required connectors in `AppModule`.

Env files:

- startup uses `@nestjs/config` (`ConfigModule.forRoot`) with `envFilePath: [\`.env.<APP_ENV|NODE_ENV>\`, '.env']`.
- for local development this means `.env.development` is picked up automatically.

### Repository Use Cases

- `PostgresRepository`: `query`, `one`, `many`, `execute`, `transaction`
- `PostgresRepository.forEntity<TEntity, TId>(...)`: generic CRUD (`findById`, `findAll`, `insert`, `updateById`, `deleteById`)
- `ClickHouseRepository`: `ping`, `queryRows`, `queryOne`, `command`, `insertRows`
- `ClickHouseRepository.forEntity<TEntity, TId>(...)`: generic access (`findById`, `findManyByIds`, `insert`, `insertMany`, `count`)
- `ScyllaRepository`: `execute`, `executePrepared`, `one`, `batch`
- `ScyllaRepository.forEntity<TEntity, TId>(...)`: generic access (`findById`, `findAll`, `upsert`, `deleteById`)
- `RedisRepository`: `get`, `set`, `exists`, `del`, `hset`, `hgetall`, `lpush`, `rpop`
- `RedisRepository.forEntity<TEntity, TId>(...)`: generic key-value entity store (`findById`, `save`, `deleteById`, `exists`)
- `KafkaRepository`: `connect`, `emit`, `request`, `close`
- `KafkaRepository.forTopic<TPayload, TResponse>(...)`: typed topic adapter (`emit`, `request`)
- `MinioRepository`: `ensureBucket`, `listBuckets`, `putObject`, `getObjectBuffer`, `statObject`, `removeObject`, `presignedGetObject`
- `MinioRepository.forObject<TValue>(...)`: typed object storage adapter (`ensureBucket`, `put`, `get`, `exists`, `delete`)

### Generic Repository Example (Feature Layer)

```ts
import { Injectable } from '@nestjs/common';
import { PostgresRepository } from './platform/connectors';

type UserRow = { id: string; email: string; name: string };

@Injectable()
export class UsersRepository {
  private readonly users = this.postgres.forEntity<UserRow, string>({
    tableName: 'users',
    idColumn: 'id',
  });

  constructor(private readonly postgres: PostgresRepository) {}

  findById(id: string): Promise<UserRow | null> {
    return this.users.findById(id);
  }
}
```

### Manual IoC Example (`registerAsync`)

```ts
import { Module } from '@nestjs/common';

import { ConfigModule, EnvConfigRepository } from './platform/modules/config/transport';
import {
  PostgresConnectorModule,
  KafkaConnectorModule,
  ClickHouseConnectorModule,
  RedisConnectorModule,
} from './platform/connectors';

@Module({
  imports: [
    ConfigModule,
    PostgresConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (configRepository) => ({
        host: configRepository.get('POSTGRES_HOST') ?? 'localhost',
        port: Number(configRepository.get('POSTGRES_PORT') ?? '20432'),
        database: configRepository.get('POSTGRES_DB') ?? 'app',
        user: configRepository.get('POSTGRES_USER') ?? 'app',
        password: configRepository.get('POSTGRES_PASSWORD') ?? 'app',
      }),
    }),
    ClickHouseConnectorModule.register({
      url: 'http://localhost:20123',
      database: 'default',
      username: 'default',
      password: '',
    }),
    RedisConnectorModule.register({
      host: 'localhost',
      port: 20379,
      db: 0,
    }),
    KafkaConnectorModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvConfigRepository],
      useFactory: (configRepository) => ({
        client: {
          clientId: configRepository.get('KAFKA_CLIENT_ID') ?? 'sample-nest',
          brokers: (configRepository.get('KAFKA_BROKERS') ?? 'localhost:20092').split(','),
        },
        consumer: {
          groupId: configRepository.get('KAFKA_GROUP_ID') ?? 'sample-nest-group',
        },
      }),
    }),
  ],
})
export class AppModule {}
```

```ts
import { Injectable } from '@nestjs/common';
import { PostgresRepository } from './platform/connectors';

@Injectable()
export class OrdersReadService {
  constructor(private readonly postgres: PostgresRepository) {}
}
```

### Local Infra Defaults (`20***`)

- PostgreSQL: `20432`
- ClickHouse HTTP: `20123`
- Scylla CQL: `20042`
- Redis: `20379`
- Kafka: `20092`
- MinIO S3: `20000`

## Commands

```bash
cd _templates/nest_template
npm install
npm run build
npm run start
npm run test:domain
```
