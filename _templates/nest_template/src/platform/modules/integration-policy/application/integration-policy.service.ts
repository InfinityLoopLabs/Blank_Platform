import { Inject, Injectable } from '@nestjs/common';

import { EnvConfigRepository } from '../../config/adapters/env-config.repository';
import { ConfigRepository } from '../../config/ports/config.repository';
import { CONFIG_REPOSITORY_TOKEN } from '../../config/transport/tokens';
import { IntegrationPolicy, IntegrationPolicies, IntegrationHealth } from '../domain/integration-policy';

@Injectable()
export class IntegrationPolicyService {
  constructor(@Inject(CONFIG_REPOSITORY_TOKEN) private readonly repository: ConfigRepository) {}

  load(): IntegrationPolicies {
    return IntegrationPolicyService.fromRepository(this.repository);
  }

  static fromEnv(env: NodeJS.ProcessEnv): IntegrationPolicies {
    return IntegrationPolicyService.fromRepository(new EnvConfigRepository(env));
  }

  static fromRepository(repository: ConfigRepository): IntegrationPolicies {
    const build = (name: string, isEnabledByDefault: boolean, defaultEndpoint: string): IntegrationPolicy => {
      const prefix = name.toUpperCase();
      const enabledRaw = (repository.get(`${prefix}_ENABLED`) ?? `${isEnabledByDefault}`).toLowerCase().trim();
      if (!['true', 'false'].includes(enabledRaw)) {
        throw new Error(`${prefix}_ENABLED must be true or false`);
      }
      const timeoutRaw = (repository.get(`${prefix}_TIMEOUT_MS`) ?? '2000').trim();
      const retryRaw = (repository.get(`${prefix}_RETRY_COUNT`) ?? '2').trim();
      const timeoutMs = Number(timeoutRaw);
      const retryCount = Number(retryRaw);
      if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
        throw new Error(`${prefix}_TIMEOUT_MS must be positive integer`);
      }
      if (!Number.isInteger(retryCount) || retryCount < 0) {
        throw new Error(`${prefix}_RETRY_COUNT must be >= 0`);
      }

      return {
        name,
        isEnabled: enabledRaw === 'true',
        endpoint: (repository.get(`${prefix}_ENDPOINT`) ?? defaultEndpoint).trim(),
        timeoutMs,
        retryCount,
      };
    };

    return {
      postgres: build('postgres', true, 'postgres://localhost:5432/sample'),
      kafka: build('kafka', true, 'localhost:9092'),
      redis: build('redis', true, 'localhost:6379'),
      clickhouse: build('clickhouse', false, 'localhost:8123'),
      scylla: build('scylla', false, 'localhost:9042'),
      neo4j: build('neo4j', false, 'bolt://localhost:7687'),
      qdrant: build('qdrant', false, 'http://localhost:6333'),
    };
  }

  static capabilityReport(config: IntegrationPolicies): IntegrationHealth[] {
    return Object.values(config).map((item) => {
      if (!item.isEnabled) {
        return { name: item.name, isEnabled: false, isHealthy: true, reason: 'disabled' };
      }
      if (!item.endpoint.trim()) {
        return { name: item.name, isEnabled: true, isHealthy: false, reason: 'missing endpoint' };
      }
      return { name: item.name, isEnabled: true, isHealthy: true, reason: 'ok' };
    });
  }
}
