# @infinityloop.labs/nest-connectors

Reusable NestJS connectors and generic repositories for:

- PostgreSQL
- ClickHouse
- Scylla
- Redis
- Kafka
- MinIO

## Install

```bash
npm i @infinityloop.labs/nest-connectors
```

## Usage

```ts
import { Module } from '@nestjs/common';
import {
  PostgresConnectorModule,
  PostgresRepository,
} from '@infinityloop.labs/nest-connectors';

@Module({
  imports: [
    PostgresConnectorModule.register({
      host: 'localhost',
      port: 20432,
      database: 'app',
      user: 'app',
      password: 'app',
    }),
  ],
})
export class AppModule {}
```

## Exports

Package entrypoint re-exports everything from `src/platform/connectors`.
