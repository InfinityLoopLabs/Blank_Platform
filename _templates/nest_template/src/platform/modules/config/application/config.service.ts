import { Injectable } from '@nestjs/common'

import { EnvConfigRepository } from '../adapters/env-config.repository'
import { AppConfigType } from '../domain/app-config'
import { IConfigRepository } from '../ports/config.repository'

@Injectable()
export class ConfigService {
  constructor(private readonly repository: EnvConfigRepository) {}

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
    const appEnv = (repository.get('APP_ENV') ?? '').trim()
    if (!appEnv) {
      throw new Error('APP_ENV is required')
    }

    const appPortRaw = (repository.get('APP_PORT') ?? '').trim()
    if (!appPortRaw) {
      throw new Error('APP_PORT is required')
    }

    const appPort = Number(appPortRaw)
    if (!Number.isInteger(appPort) || appPort <= 0) {
      throw new Error('APP_PORT must be a positive integer')
    }

    const schemaModeRaw = (repository.get('SCHEMA_MODE') ?? '').trim()
    if (!schemaModeRaw) {
      throw new Error('SCHEMA_MODE is required')
    }
    const allowedModes = [
      'ok',
      'dirty',
      'checksum_mismatch',
      'missing_version',
      'db_down',
    ] as const
    if (
      !allowedModes.includes(schemaModeRaw as (typeof allowedModes)[number])
    ) {
      throw new Error(
        'SCHEMA_MODE must be one of: ok, dirty, checksum_mismatch, missing_version, db_down',
      )
    }

    const otelSidecarEndpoint = (
      repository.get('OTEL_SIDECAR_ENDPOINT') ?? ''
    ).trim()
    if (!otelSidecarEndpoint) {
      throw new Error('OTEL_SIDECAR_ENDPOINT is required')
    }

    const isOtelSidecarAvailableRaw = (
      repository.get('OTEL_SIDECAR_AVAILABLE') ?? ''
    )
      .trim()
      .toLowerCase()
    if (!isOtelSidecarAvailableRaw) {
      throw new Error('OTEL_SIDECAR_AVAILABLE is required')
    }
    if (!['true', 'false'].includes(isOtelSidecarAvailableRaw)) {
      throw new Error('OTEL_SIDECAR_AVAILABLE must be true or false')
    }
    const isOtelSidecarAvailable = isOtelSidecarAvailableRaw === 'true'

    return {
      appEnv,
      appPort,
      schemaMode: schemaModeRaw as AppConfigType['schemaMode'],
      otelSidecarEndpoint,
      isOtelSidecarAvailable,
    }
  }
}
