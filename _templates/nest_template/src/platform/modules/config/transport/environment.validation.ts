type RuntimeEnv = Record<string, string | undefined>;

const ALLOWED_SCHEMA_MODES = ['ok', 'dirty', 'checksum_mismatch', 'missing_version', 'db_down'] as const;

export function validateEnvironment(source: RuntimeEnv): RuntimeEnv {
  const env = source;

  requireNonEmpty(env, 'APP_ENV');
  requirePositiveInteger(env, 'APP_PORT');
  requireOneOf(env, 'SCHEMA_MODE', ALLOWED_SCHEMA_MODES);
  requireNonEmpty(env, 'OTEL_SIDECAR_ENDPOINT');
  requireBoolean(env, 'OTEL_SIDECAR_AVAILABLE');

  const postgresEnabled = requireBoolean(env, 'POSTGRES_ENABLED');
  const clickhouseEnabled = requireBoolean(env, 'CLICKHOUSE_ENABLED');
  const scyllaEnabled = requireBoolean(env, 'SCYLLA_ENABLED');
  const redisEnabled = requireBoolean(env, 'REDIS_ENABLED');
  const kafkaEnabled = requireBoolean(env, 'KAFKA_ENABLED');
  const minioEnabled = requireBoolean(env, 'MINIO_ENABLED');

  if (postgresEnabled) {
    requireNonEmpty(env, 'POSTGRES_HOST');
    requirePositiveInteger(env, 'POSTGRES_PORT');
    requireNonEmpty(env, 'POSTGRES_DB');
    requireNonEmpty(env, 'POSTGRES_USER');
    requireNonEmpty(env, 'POSTGRES_PASSWORD');
  }

  if (clickhouseEnabled) {
    requireNonEmpty(env, 'CLICKHOUSE_URL');
    requireNonEmpty(env, 'CLICKHOUSE_DATABASE');
    requireNonEmpty(env, 'CLICKHOUSE_USER');
    requireNonEmpty(env, 'CLICKHOUSE_PASSWORD');
    requirePositiveInteger(env, 'CLICKHOUSE_TIMEOUT_MS');
  }

  if (scyllaEnabled) {
    requireNonEmpty(env, 'SCYLLA_CONTACT_POINTS');
    requireNonEmpty(env, 'SCYLLA_LOCAL_DC');
  }

  if (redisEnabled) {
    requireNonEmpty(env, 'REDIS_HOST');
    requirePositiveInteger(env, 'REDIS_PORT');
    requireNonNegativeInteger(env, 'REDIS_DB');
  }

  if (kafkaEnabled) {
    requireNonEmpty(env, 'KAFKA_CLIENT_ID');
    requireNonEmpty(env, 'KAFKA_GROUP_ID');
    requireNonEmpty(env, 'KAFKA_BROKERS');
  }

  if (minioEnabled) {
    requireNonEmpty(env, 'MINIO_ENDPOINT');
    requirePositiveInteger(env, 'MINIO_PORT');
    requireBoolean(env, 'MINIO_USE_SSL');
    requireNonEmpty(env, 'MINIO_ACCESS_KEY');
    requireNonEmpty(env, 'MINIO_SECRET_KEY');
  }

  return env;
}

function requireNonEmpty(env: RuntimeEnv, key: string): string {
  const value = (env[key] ?? '').trim();
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

function requireBoolean(env: RuntimeEnv, key: string): boolean {
  const value = requireNonEmpty(env, key).toLowerCase();
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(`Invalid boolean env ${key}: ${value}`);
}

function requirePositiveInteger(env: RuntimeEnv, key: string): number {
  const value = requireNonEmpty(env, key);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid positive integer env ${key}: ${value}`);
  }
  return parsed;
}

function requireNonNegativeInteger(env: RuntimeEnv, key: string): number {
  const value = requireNonEmpty(env, key);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid non-negative integer env ${key}: ${value}`);
  }
  return parsed;
}

function requireOneOf<T extends readonly string[]>(env: RuntimeEnv, key: string, allowed: T): T[number] {
  const value = requireNonEmpty(env, key) as T[number];
  if (!allowed.includes(value)) {
    throw new Error(`Invalid env ${key}: ${value}. Allowed: ${allowed.join(', ')}`);
  }
  return value;
}
