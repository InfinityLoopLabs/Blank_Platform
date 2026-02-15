export type IntegrationPolicy = {
  name: string;
  isEnabled: boolean;
  endpoint: string;
  timeoutMs: number;
  retryCount: number;
};

export type IntegrationPolicies = {
  postgres: IntegrationPolicy;
  kafka: IntegrationPolicy;
  redis: IntegrationPolicy;
  clickhouse: IntegrationPolicy;
  scylla: IntegrationPolicy;
  neo4j: IntegrationPolicy;
  qdrant: IntegrationPolicy;
};

export type IntegrationHealth = {
  name: string;
  isEnabled: boolean;
  isHealthy: boolean;
  reason: string;
};
