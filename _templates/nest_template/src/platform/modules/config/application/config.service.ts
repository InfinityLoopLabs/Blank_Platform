import { Inject, Injectable } from '@nestjs/common';

import { AppConfig } from '../domain/app-config';
import { ConfigRepository } from '../ports/config.repository';
import { EnvConfigRepository } from '../adapters/env-config.repository';
import { CONFIG_REPOSITORY_TOKEN } from '../transport/tokens';

@Injectable()
export class ConfigService {
  constructor(@Inject(CONFIG_REPOSITORY_TOKEN) private readonly repository: ConfigRepository) {}

  load(): AppConfig {
    return ConfigService.fromRepository(this.repository);
  }

  static fromEnv(env: NodeJS.ProcessEnv): AppConfig {
    return ConfigService.fromRepository(new EnvConfigRepository(env));
  }

  static fromRepository(repository: ConfigRepository): AppConfig {
    const appEnv = (repository.get('APP_ENV') ?? '').trim();
    if (!appEnv) {
      throw new Error('APP_ENV is required');
    }

    const appPortRaw = (repository.get('APP_PORT') ?? '').trim();
    if (!appPortRaw) {
      throw new Error('APP_PORT is required');
    }

    const appPort = Number(appPortRaw);
    if (!Number.isInteger(appPort) || appPort <= 0) {
      throw new Error('APP_PORT must be a positive integer');
    }

    const schemaModeRaw = (repository.get('SCHEMA_MODE') ?? 'ok').trim();
    const allowedModes = ['ok', 'dirty', 'checksum_mismatch', 'missing_version', 'db_down'] as const;
    if (!allowedModes.includes(schemaModeRaw as (typeof allowedModes)[number])) {
      throw new Error('SCHEMA_MODE must be one of: ok, dirty, checksum_mismatch, missing_version, db_down');
    }

    const otelSidecarEndpoint = (repository.get('OTEL_SIDECAR_ENDPOINT') ?? 'localhost:4317').trim();
    const isOtelSidecarAvailableRaw = (repository.get('OTEL_SIDECAR_AVAILABLE') ?? 'true').trim().toLowerCase();
    if (!['true', 'false'].includes(isOtelSidecarAvailableRaw)) {
      throw new Error('OTEL_SIDECAR_AVAILABLE must be true or false');
    }
    const isOtelSidecarAvailable = isOtelSidecarAvailableRaw === 'true';

    return {
      appEnv,
      appPort,
      schemaMode: schemaModeRaw as AppConfig['schemaMode'],
      otelSidecarEndpoint,
      isOtelSidecarAvailable,
    };
  }
}
