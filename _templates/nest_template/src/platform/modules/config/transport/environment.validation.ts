import { ALLOWED_SCHEMA_MODES } from '../domain/schema-mode'
import { IConfigRepository } from '../ports/config.repository'
import {
  requiredBoolean,
  requiredNonNegativeInt,
  requiredOneOf,
  requiredPositiveInt,
  requiredString,
} from './env-readers'

type RuntimeEnvType = Record<string, string | undefined>

export const APP_CONFIG_KEYS = [
  'APP_ENV',
  'NODE_ENV',
  'APP_PORT',
  'SCHEMA_MODE',
  'OTEL_SIDECAR_ENDPOINT',
  'OTEL_SIDECAR_AVAILABLE',
] as const

export const VALIDATION_ENV_KEYS = [
  ...APP_CONFIG_KEYS,
  'POSTGRES_ENABLED',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'CLICKHOUSE_ENABLED',
  'CLICKHOUSE_URL',
  'CLICKHOUSE_DATABASE',
  'CLICKHOUSE_USER',
  'CLICKHOUSE_PASSWORD',
  'CLICKHOUSE_TIMEOUT_MS',
  'SCYLLA_ENABLED',
  'SCYLLA_CONTACT_POINTS',
  'SCYLLA_LOCAL_DC',
  'REDIS_ENABLED',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_DB',
  'KAFKA_ENABLED',
  'KAFKA_CLIENT_ID',
  'KAFKA_GROUP_ID',
  'KAFKA_BROKERS',
  'MINIO_ENABLED',
  'MINIO_ENDPOINT',
  'MINIO_PORT',
  'MINIO_USE_SSL',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
] as const

export function resolveRuntimeEnv(source: RuntimeEnvType): string {
  return (
    (source.APP_ENV ?? source.NODE_ENV ?? 'development').trim().toLowerCase() ||
    'development'
  )
}

export function validateEnvironment(source: RuntimeEnvType): RuntimeEnvType {
  const env = source
  const envRepository: IConfigRepository = {
    get: key => env[key],
  }

  env.APP_ENV = resolveRuntimeEnv(env)
  requiredPositiveInt(envRepository, 'APP_PORT')
  requiredOneOf(envRepository, 'SCHEMA_MODE', ALLOWED_SCHEMA_MODES)
  requiredString(envRepository, 'OTEL_SIDECAR_ENDPOINT')
  requiredBoolean(envRepository, 'OTEL_SIDECAR_AVAILABLE')

  const isPostgresEnabled = requiredBoolean(envRepository, 'POSTGRES_ENABLED')
  const isClickhouseEnabled = requiredBoolean(
    envRepository,
    'CLICKHOUSE_ENABLED',
  )
  const isScyllaEnabled = requiredBoolean(envRepository, 'SCYLLA_ENABLED')
  const isRedisEnabled = requiredBoolean(envRepository, 'REDIS_ENABLED')
  const isKafkaEnabled = requiredBoolean(envRepository, 'KAFKA_ENABLED')
  const isMinioEnabled = requiredBoolean(envRepository, 'MINIO_ENABLED')

  if (isPostgresEnabled) {
    requiredString(envRepository, 'POSTGRES_HOST')
    requiredPositiveInt(envRepository, 'POSTGRES_PORT')
    requiredString(envRepository, 'POSTGRES_DB')
    requiredString(envRepository, 'POSTGRES_USER')
    requiredString(envRepository, 'POSTGRES_PASSWORD')
  }

  if (isClickhouseEnabled) {
    requiredString(envRepository, 'CLICKHOUSE_URL')
    requiredString(envRepository, 'CLICKHOUSE_DATABASE')
    requiredString(envRepository, 'CLICKHOUSE_USER')
    requiredString(envRepository, 'CLICKHOUSE_PASSWORD')
    requiredPositiveInt(envRepository, 'CLICKHOUSE_TIMEOUT_MS')
  }

  if (isScyllaEnabled) {
    requiredString(envRepository, 'SCYLLA_CONTACT_POINTS')
    requiredString(envRepository, 'SCYLLA_LOCAL_DC')
  }

  if (isRedisEnabled) {
    requiredString(envRepository, 'REDIS_HOST')
    requiredPositiveInt(envRepository, 'REDIS_PORT')
    requiredNonNegativeInt(envRepository, 'REDIS_DB')
  }

  if (isKafkaEnabled) {
    requiredString(envRepository, 'KAFKA_CLIENT_ID')
    requiredString(envRepository, 'KAFKA_GROUP_ID')
    requiredString(envRepository, 'KAFKA_BROKERS')
  }

  if (isMinioEnabled) {
    requiredString(envRepository, 'MINIO_ENDPOINT')
    requiredPositiveInt(envRepository, 'MINIO_PORT')
    requiredBoolean(envRepository, 'MINIO_USE_SSL')
    requiredString(envRepository, 'MINIO_ACCESS_KEY')
    requiredString(envRepository, 'MINIO_SECRET_KEY')
  }

  return env
}
