# Integration Profile Harness

This folder is reserved for NestJS integration tests executed against the shared profile harness (`integration/profiles.json`).

Planned command:
- `python3 scripts/run_integration_profile.py core`
- `python3 scripts/run_integration_profile.py optional`

Available smoke tests:
- `npm run test:containers`
- `npm run test:rabbitmq:container`

Connector smoke test files:
- `tests/integration/connectors/postgres.testcontainer.spec.ts` (`POSTGRES_ENABLED`)
- `tests/integration/connectors/clickhouse.testcontainer.spec.ts` (`CLICKHOUSE_ENABLED`)
- `tests/integration/connectors/scylla.testcontainer.spec.ts` (`SCYLLA_ENABLED`)
- `tests/integration/connectors/redis.testcontainer.spec.ts` (`REDIS_ENABLED`)
- `tests/integration/connectors/hazelcast.testcontainer.spec.ts` (`HAZELCAST_ENABLED`)
- `tests/integration/connectors/kafka.testcontainer.spec.ts` (`KAFKA_ENABLED`)
- `tests/integration/connectors/rabbitmq.testcontainer.spec.ts` (`RABBITMQ_ENABLED`)
- `tests/integration/connectors/minio.testcontainer.spec.ts` (`MINIO_ENABLED`)
- `tests/integration/connectors/neo4j.testcontainer.spec.ts` (`NEO4J_ENABLED`)
- `tests/integration/connectors/qdrant.testcontainer.spec.ts` (`QDRANT_ENABLED`)

Env gating rule:
- if `<CONNECTOR>_ENABLED=false`, matching connector smoke test is skipped
- any value other than `false` enables both module wiring and test execution
