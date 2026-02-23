import { EnvConfigRepository } from '../../config/transport'

export function requiredString(env: EnvConfigRepository, key: string): string {
  const value = (env.get(key) ?? '').trim()
  if (!value) {
    throw new Error(`Missing required env: ${key}`)
  }

  return value
}

export function optionalString(
  env: EnvConfigRepository,
  key: string,
): string | undefined {
  const value = (env.get(key) ?? '').trim()

  return value ? value : undefined
}

export function requiredPositiveInt(
  env: EnvConfigRepository,
  key: string,
): number {
  const value = requiredString(env, key)
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid positive integer env ${key}: ${value}`)
  }

  return parsed
}

export function requiredNonNegativeInt(
  env: EnvConfigRepository,
  key: string,
): number {
  const value = requiredString(env, key)
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid non-negative integer env ${key}: ${value}`)
  }

  return parsed
}

export function requiredBoolean(env: EnvConfigRepository, key: string): boolean {
  const value = requiredString(env, key).toLowerCase()
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  throw new Error(`Invalid boolean env ${key}: ${value}`)
}

export function requiredCsv(env: EnvConfigRepository, key: string): string[] {
  const source = requiredString(env, key)
  const values = source
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
  if (values.length === 0) {
    throw new Error(`Env must contain at least one value: ${key}`)
  }

  return values
}
