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
- `@infinityloop.labs/nest-connectors` for reusable connector modules and generic repositories
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

Feature flags in app bootstrap:

- connectors are imported by default; only `false` disables import.
- supported flags: `POSTGRES_ENABLED`, `CLICKHOUSE_ENABLED`, `SCYLLA_ENABLED`, `REDIS_ENABLED`, `KAFKA_ENABLED`, `MINIO_ENABLED`.
- if flag equals `false`, module is not imported and its providers are not injectable.

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
import { PostgresRepository } from '@infinityloop.labs/nest-connectors';

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
} from '@infinityloop.labs/nest-connectors';

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
import { PostgresRepository } from '@infinityloop.labs/nest-connectors';

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
npm run lint
npm run start
npm run test:domain
```

## Multi-DB Migrations

All migration-related files are in `src/migrations/`.

Separate migration mechanisms are available for each DB with dedicated journal table in each engine:

- App bootstrap entrypoint: `src/platform/modules/migrations/application/migration-bootstrap.service.ts`
- Postgres module/service: `@infinityloop.labs/nest-connectors` (`PostgresMigrationModule`, `PostgresMigrationService`)
- ClickHouse module/service: `@infinityloop.labs/nest-connectors` (`ClickHouseMigrationModule`, `ClickHouseMigrationService`)
- Scylla module/service: `@infinityloop.labs/nest-connectors` (`ScyllaMigrationModule`, `ScyllaMigrationService`)
- journal tables: `schema_migrations_postgres`, `schema_migrations_clickhouse`, `schema_migrations_scylla`
Migration folders:

- `src/migrations/postgres/*.up.sql` + `src/migrations/postgres/*.down.sql`
- `src/migrations/clickhouse/*.up.sql` + `src/migrations/clickhouse/*.down.sql`
- `src/migrations/scylla/*.up.cql` + `src/migrations/scylla/*.down.cql`

Apply mode:

- migrations run automatically on app startup via `MigrationBootstrapService` in `MigrationsModule`
- for enabled DB connectors, startup executes `run('up')` and waits for completion
- on migration error, application startup fails

Behavior:

- each runner creates its journal table automatically if missing
- each `.up` migration file is hashed (`sha256`) and checksum is stored in DB
- if already applied migration file was changed, runner returns checksum mismatch error
- runner validates that each `*.up.*` has paired `*.down.*` file and vice versa
- `status` shows total/applied/pending, checksum mismatches and orphan applied migrations
- `up` applies only pending migrations in filename order
- `down` rolls back one latest applied local migration (LIFO) and removes it from journal

Scylla notes:

- migration journal keyspace: `SCYLLA_MIGRATIONS_KEYSPACE` (fallback: `SCYLLA_KEYSPACE`, then `app`)
- keyspace is auto-created if missing
- in `.cql` files you can use placeholder `{{KEYSPACE}}`
