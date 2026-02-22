export type IntegrationPolicyType = {
  name: string
  isEnabled: boolean
  endpoint: string
  timeoutMs: number
  retryCount: number
}

export type IntegrationPoliciesType = {
  postgres: IntegrationPolicyType
  kafka: IntegrationPolicyType
  redis: IntegrationPolicyType
  clickhouse: IntegrationPolicyType
  scylla: IntegrationPolicyType
  neo4j: IntegrationPolicyType
  qdrant: IntegrationPolicyType
}

export type IntegrationHealthType = {
  name: string
  isEnabled: boolean
  isHealthy: boolean
  reason: string
}
