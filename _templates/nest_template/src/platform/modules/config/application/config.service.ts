import { Inject, Injectable } from '@nestjs/common'

import { EnvConfigRepository } from '../adapters/env-config.repository'
import { AppConfigType } from '../domain/app-config'
import { ALLOWED_SCHEMA_MODES } from '../domain/schema-mode'
import {
  CONFIG_REPOSITORY,
  IConfigRepository,
} from '../ports/config.repository'
import {
  requiredBoolean,
  requiredOneOf,
  requiredPositiveInt,
  requiredString,
} from '../transport/env-readers'
import {
  resolveRuntimeEnv,
  validateEnvironment,
  VALIDATION_ENV_KEYS,
} from '../transport/environment.validation'

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIG_REPOSITORY) private readonly repository: IConfigRepository,
  ) {}

  get(key: string): string | undefined {
    return this.repository.get(key)
  }

  getBoolean(key: string, fallback = false): boolean {
    const rawValue = (this.repository.get(key) ?? '').trim().toLowerCase()
    if (!rawValue) {
      return fallback
    }
    if (rawValue === 'true') {
      return true
    }
    if (rawValue === 'false') {
      return false
    }

    throw new Error(`Invalid boolean env ${key}: ${rawValue}`)
  }

  load(): AppConfigType {
    return ConfigService.fromRepository(this.repository)
  }

  static fromEnv(env: NodeJS.ProcessEnv): AppConfigType {
    return ConfigService.fromRepository(new EnvConfigRepository(env))
  }

  static fromRepository(repository: IConfigRepository): AppConfigType {
    const snapshot = ConfigService.readValidationSnapshot(repository)
    const validatedSnapshot = validateEnvironment(snapshot)
    const validatedRepository: IConfigRepository = {
      get: key => validatedSnapshot[key],
    }

    const appEnv = resolveRuntimeEnv(validatedSnapshot)
    const appPort = requiredPositiveInt(validatedRepository, 'APP_PORT')
    const schemaMode = requiredOneOf(
      validatedRepository,
      'SCHEMA_MODE',
      ALLOWED_SCHEMA_MODES,
    )
    const otelSidecarEndpoint = requiredString(
      validatedRepository,
      'OTEL_SIDECAR_ENDPOINT',
    )
    const isOtelSidecarAvailable = requiredBoolean(
      validatedRepository,
      'OTEL_SIDECAR_AVAILABLE',
    )

    return {
      appEnv,
      appPort,
      schemaMode,
      otelSidecarEndpoint,
      isOtelSidecarAvailable,
    }
  }

  private static readValidationSnapshot(
    repository: IConfigRepository,
  ): Record<string, string | undefined> {
    return VALIDATION_ENV_KEYS.reduce<Record<string, string | undefined>>(
      (accumulator, key) => {
        accumulator[key] = repository.get(key)

        return accumulator
      },
      {},
    )
  }
}
