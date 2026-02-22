# Nest Template Replication Checklist

## 1. Scope
- Анализировалось: шаблон Nest-сервиса в `_templates/nest_template` и связанная внутренняя библиотека `packages/nest-connectors` (факт связи через dependency `file:../../packages/nest-connectors` в `_templates/nest_template/package.json`).
- Границы анализа:
  - архитектурные слои `features/*` и `platform/*`;
  - подключение коннекторов к БД и инфраструктуре;
  - механизм миграций;
  - transport-слой (HTTP/gRPC) и platform-модули.

## 2. Library Map
- Внутренние библиотеки:
  - `@infinityloop.labs/nest-connectors` (runtime, локальный workspace-пакет)  
    Где найдено: `_templates/nest_template/package.json`, `packages/nest-connectors/package.json`.
  - `@infinityloop.labs/eslint-config-backend` (dev-only)  
    Где найдено: `_templates/nest_template/package.json`.
- Внешние зависимости (runtime):
  - Nest stack: `@nestjs/common`, `@nestjs/core`, `@nestjs/config`, `@nestjs/platform-express`, `@nestjs/microservices`, `@nestjs/swagger`, `@nestjs/terminus`.
  - Infra clients: `pg`, `@clickhouse/client`, `cassandra-driver`, `ioredis`, `kafkajs`, `minio`.
  - Остальные: `class-transformer`, `class-validator`, `reflect-metadata`, `rxjs`, `swagger-ui-express`.
  - Где найдено: `_templates/nest_template/package.json`.
- Ключевые связи:
  - `AppModule` подключает `...connectorImports` и `MigrationsModule`, что связывает сервис с `@infinityloop.labs/nest-connectors`.  
    Где найдено: `_templates/nest_template/src/app.module.ts`, `_templates/nest_template/src/platform/modules/connectors/transport/connector-imports.ts`, `_templates/nest_template/src/platform/modules/migrations/transport/migration-imports.ts`.
  - `@infinityloop.labs/nest-connectors` реэкспортирует `platform/connectors` и `platform/migrations`, а peer deps совпадают с runtime DB/infra-клиентами шаблона.  
    Где найдено: `packages/nest-connectors/src/index.ts`, `packages/nest-connectors/package.json`.

## 3. DB Connector (Library)
- Где расположен:
  - Библиотека коннекторов: `packages/nest-connectors/src/platform/connectors/*`.
  - Подключение в шаблоне: `_templates/nest_template/src/platform/modules/connectors/transport/connector-imports.ts`.
- Как подключается:
  - Через `registerAsync(...)` + `ConditionalModule.registerWhen(...)` для каждого коннектора (`Postgres`, `ClickHouse`, `Scylla`, `Redis`, `Kafka`, `MinIO`) с env-флагами `*_ENABLED`.
  - Где найдено: `_templates/nest_template/src/platform/modules/connectors/transport/connector-imports.ts`, `_templates/nest_template/.env.development`.
- Что нужно воспроизвести в новом сервисе:
  - Оставить коннекторы как отдельные DI-модули c async-конфигом.
  - Сохранять feature flags на уровне импорта модулей (а не внутри бизнес-логики).
  - Переиспользовать репозитории из `nest-connectors` (например `PostgresRepository` и `forEntity(...)`).
  - Где найдено: `packages/nest-connectors/src/platform/connectors/postgres/postgres-connector.module.ts`, `packages/nest-connectors/src/platform/connectors/postgres/postgres.repository.ts`.

## 4. Migration Mechanism
- Инструменты и конфиги:
  - Миграционные модули/сервисы приходят из `@infinityloop.labs/nest-connectors` (`Postgres`, `ClickHouse`, `Scylla`).
  - Настройка через `migrationImports` и env.
  - Где найдено: `_templates/nest_template/src/platform/modules/migrations/transport/migration-imports.ts`, `packages/nest-connectors/src/platform/migrations/index.ts`.
- Как запускаются миграции:
  - На bootstrap приложения `MigrationBootstrapService` вызывает `run('up')` для доступных движков.
  - Где найдено: `_templates/nest_template/src/platform/modules/migrations/application/migration-bootstrap.service.ts`, `_templates/nest_template/src/platform/modules/migrations/transport/migrations.module.ts`.
- Что обязательно перенести:
  - Автозапуск миграций при старте сервиса.
  - Раздельные директории миграций по движкам (`src/migrations/postgres|clickhouse|scylla`).
  - Проверки целостности (`up/down` пары, checksum mismatch, orphan applied).
  - Поддержка команд `up | down | status`.
  - Где найдено: `_templates/nest_template/src/migrations/*`, `packages/nest-connectors/src/platform/migrations/migration-command.ts`, `packages/nest-connectors/src/platform/migrations/postgres/postgres-migration.service.ts`, `_templates/nest_template/README.md`.

## 5. Domain Layer
- Основные доменные модули/паттерны:
  - Feature slice по слоям: `domain -> application -> ports -> adapters -> transport`.
  - Пример: `sample` фича.
  - Где найдено: `_templates/nest_template/src/features/sample/domain/sample.entity.ts`, `_templates/nest_template/src/features/sample/application/create-sample.use-case.ts`, `_templates/nest_template/src/features/sample/ports/sample.repository.port.ts`, `_templates/nest_template/src/features/sample/adapters/memory/sample.repository.memory.ts`, `_templates/nest_template/src/features/sample/transport/http/sample.controller.ts`.
- Контракты и границы:
  - Use-case зависит от порта (`ISampleRepositoryPort`), а не от конкретной БД/ORM.
  - Transport-контроллер вызывает use-case и platform-сервисы (response/context/guards/interceptors), не содержит DB-логики.
  - Где найдено: `_templates/nest_template/src/features/sample/application/create-sample.use-case.ts`, `_templates/nest_template/src/features/sample/ports/sample.repository.port.ts`, `_templates/nest_template/src/features/sample/transport/http/sample.controller.ts`.
- Что стандартизировать для новых сервисов:
  - Формат feature-папок и контракты портов.
  - Инварианты сущностей в `domain`.
  - Изоляцию инфраструктуры в adapters/platform.

## 6. Platform Layer (Transports)
- Какие транспорты реализованы:
  - HTTP: guards, pipes, interceptors, middleware, filters, response factory.
  - gRPC: модуль, сервис-заглушка, context interceptor.
  - Где найдено: `_templates/nest_template/src/platform/transport/http/index.ts`, `_templates/nest_template/src/platform/transport/grpc/grpc.module.ts`, `_templates/nest_template/src/platform/transport/grpc/grpc.service.ts`.
- Как организованы адаптеры/инфраструктурные точки:
  - Кросс-срезовые platform-модули: `config`, `connectors`, `migrations`, `health`, `observability`, `integration-policy`.
  - Конфигурация централизована через `ConfigModule` и `AppConfigProvider`.
  - Где найдено: `_templates/nest_template/src/app.module.ts`, `_templates/nest_template/src/platform/modules/config/transport/config.module.ts`, `_templates/nest_template/src/platform/modules/health/transport/health.module.ts`, `_templates/nest_template/src/platform/modules/observability/transport/observability.module.ts`, `_templates/nest_template/src/platform/modules/integration-policy/transport/integration-policy.module.ts`.
- Что взять как базовый шаблон:
  - `AppModule` как композиционный корень.
  - `ConfigModule` + env validation как обязательный bootstrap-блок.
  - Единый request-context и response envelope для HTTP/gRPC.

## 7. Reuse Decisions
- Что копировать как есть:
  - Модули `connectorImports` и `migrationImports` как стандарт подключения infra.
  - `MigrationBootstrapService`.
  - Скелет `platform/transport/http` и `platform/transport/grpc`.
  - Паттерн feature-слоев (`domain/application/ports/adapters/transport`).
- Что параметризовать:
  - Env-ключи, порты, список включенных коннекторов, app name/service name.
  - Конкретные таблицы/топики/бакеты и map-функции репозиториев.
  - Политики интеграций (`integration-policy`) под конкретный сервис.
- Что делать опциональным:
  - gRPC transport (если сервис чисто HTTP).
  - Отдельные коннекторы (Redis/Kafka/MinIO/ClickHouse/Scylla) по требованиям сервиса.
  - OTEL sidecar export и swagger в production.

## 8. Replication Checklist (for new services)
- [ ] Скопировать структуру `src/features` и `src/platform` из шаблона.
- [ ] Настроить `tsconfig` aliases `@core/*` и `@features/*`.  
  Где найдено: `_templates/nest_template/tsconfig.json`.
- [ ] Подключить `ConfigModule` с env validation и `AppConfigProvider`.
- [ ] Подключить `@infinityloop.labs/nest-connectors` как workspace/internal dependency.
- [ ] Добавить `connectorImports` с `ConditionalModule.registerWhen(...)` и флагами `*_ENABLED`.
- [ ] Завести директории миграций `src/migrations/postgres`, `src/migrations/clickhouse`, `src/migrations/scylla`.
- [ ] Подключить `MigrationsModule` и `MigrationBootstrapService` в `AppModule`.
- [ ] Создать минимум одну рабочую пару миграций (`*.up` + `*.down`) для нужного движка.
- [ ] Реализовать production adapter(ы) для доменных портов (не оставлять только memory-адаптер).
- [ ] Подключить HTTP transport primitives (guards/pipes/interceptors/middleware/filters/response factory).
- [ ] Включить только нужные транспорта/модули platform-уровня (HTTP/gRPC/observability/integration-policy).
- [ ] Проверить старт приложения с включенными и выключенными коннекторами.
- [ ] Проверить `migrations status/up/down` сценарии на локальной infra.
- [ ] Добавить smoke-тест на bootstrap + health/readiness.

## 9. Open Questions
- В шаблоне директории миграций содержат только `.gitkeep`; рабочие SQL/CQL миграции нужно добавить при создании сервиса.  
  Где найдено: `_templates/nest_template/src/migrations/postgres/.gitkeep`, `_templates/nest_template/src/migrations/clickhouse/.gitkeep`, `_templates/nest_template/src/migrations/scylla/.gitkeep`.
- В sample feature есть только memory-репозиторий; нет готового production-адаптера к DB для `ISampleRepositoryPort`.  
  Где найдено: `_templates/nest_template/src/features/sample/adapters/memory/sample.repository.memory.ts`.
- Каталог `src/platform/modules/auth` присутствует, но файлов реализации нет. Нужно уточнить, должен ли auth быть обязательным модулем шаблона.  
  Где найдено: `_templates/nest_template/src/platform/modules/auth`.

## 10. Change Log
- 2026-02-22: создана первая версия чек-листа на основе фактического анализа `_templates/nest_template` и `packages/nest-connectors`.
- Добавлены: карта библиотек, правила переиспользования, базовый replication checklist и список открытых вопросов для следующей итерации.
