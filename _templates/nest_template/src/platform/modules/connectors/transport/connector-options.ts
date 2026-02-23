import { EnvConfigRepository } from '../../config/transport'
import {
  optionalString,
  requiredBoolean,
  requiredCsv,
  requiredNonNegativeInt,
  requiredPositiveInt,
  requiredString,
} from './env-readers'

export function buildPostgresConnectorOptions(env: EnvConfigRepository) {
  return {
    host: requiredString(env, 'POSTGRES_HOST'),
    port: requiredPositiveInt(env, 'POSTGRES_PORT'),
    database: requiredString(env, 'POSTGRES_DB'),
    user: requiredString(env, 'POSTGRES_USER'),
    password: requiredString(env, 'POSTGRES_PASSWORD'),
  }
}

export function buildClickHouseConnectorOptions(env: EnvConfigRepository) {
  return {
    url: requiredString(env, 'CLICKHOUSE_URL'),
    database: requiredString(env, 'CLICKHOUSE_DATABASE'),
    username: requiredString(env, 'CLICKHOUSE_USER'),
    password: requiredString(env, 'CLICKHOUSE_PASSWORD'),
    requestTimeoutMs: requiredPositiveInt(env, 'CLICKHOUSE_TIMEOUT_MS'),
  }
}

export function buildScyllaConnectorOptions(env: EnvConfigRepository) {
  return {
    contactPoints: requiredCsv(env, 'SCYLLA_CONTACT_POINTS'),
    localDataCenter: requiredString(env, 'SCYLLA_LOCAL_DC'),
    keyspace: optionalString(env, 'SCYLLA_KEYSPACE'),
    username: optionalString(env, 'SCYLLA_USERNAME'),
    password: optionalString(env, 'SCYLLA_PASSWORD'),
  }
}

export function buildRedisConnectorOptions(env: EnvConfigRepository) {
  return {
    host: requiredString(env, 'REDIS_HOST'),
    port: requiredPositiveInt(env, 'REDIS_PORT'),
    db: requiredNonNegativeInt(env, 'REDIS_DB'),
    password: optionalString(env, 'REDIS_PASSWORD'),
  }
}

export function buildKafkaConnectorOptions(env: EnvConfigRepository) {
  return {
    client: {
      clientId: requiredString(env, 'KAFKA_CLIENT_ID'),
      brokers: requiredCsv(env, 'KAFKA_BROKERS'),
    },
    consumer: {
      groupId: requiredString(env, 'KAFKA_GROUP_ID'),
    },
  }
}

export function buildMinioConnectorOptions(env: EnvConfigRepository) {
  return {
    endPoint: requiredString(env, 'MINIO_ENDPOINT'),
    port: requiredPositiveInt(env, 'MINIO_PORT'),
    useSSL: requiredBoolean(env, 'MINIO_USE_SSL'),
    accessKey: requiredString(env, 'MINIO_ACCESS_KEY'),
    secretKey: requiredString(env, 'MINIO_SECRET_KEY'),
    region: optionalString(env, 'MINIO_REGION'),
  }
}
