# Local Infra

Локальный инфраструктурный стек:
- ClickHouse
- PostgreSQL
- ScyllaDB
- Redis
- Kafka (KRaft, single-node)
- MinIO (S3)

Примечание для Apple Silicon (`M1/M2/M3`): Kafka запускается через `linux/amd64`-эмуляцию, так как Bitnami-образ сейчас без `arm64`-манифеста.

## Быстрый старт

```bash
cd local-infra
cp .env.example .env
docker compose up -d
```

Проверка статуса:

```bash
docker compose ps
```

Остановка:

```bash
docker compose down
```

Полная очистка данных (осторожно):

```bash
rm -rf data
```

## Порты

- PostgreSQL: `localhost:20432`
- ClickHouse HTTP: `localhost:20123`
- ClickHouse Native: `localhost:20010`
- Scylla CQL: `localhost:20042`
- Redis: `localhost:20379`
- Kafka external: `localhost:20092`
- MinIO S3 API: `localhost:20000`
- MinIO Console: `http://localhost:20001`

## Карта портов (20***)

| Service | Host | Container |
|---|---:|---:|
| PostgreSQL | 20432 | 5432 |
| ClickHouse HTTP | 20123 | 8123 |
| ClickHouse Native | 20010 | 9000 |
| Scylla CQL | 20042 | 9042 |
| Redis | 20379 | 6379 |
| Kafka external | 20092 | 20092 |
| MinIO S3 API | 20000 | 9000 |
| MinIO Console | 20001 | 9001 |

## Подключения

PostgreSQL:

```text
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:20432/${POSTGRES_DB}
```

ClickHouse HTTP:

```text
http://localhost:20123
```

Scylla (CQL):

```text
localhost:20042
```

Redis:

```text
redis://localhost:20379
```

Kafka bootstrap servers:

```text
localhost:20092
```

MinIO:

- Endpoint: `http://localhost:20000`
- Console: `http://localhost:20001`
- Access key: `${MINIO_ROOT_USER}`
- Secret key: `${MINIO_ROOT_PASSWORD}`
