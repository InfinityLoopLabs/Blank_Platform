import { IntegrationPolicyService } from '../../src/platform/modules/integration-policy/transport';

describe('IntegrationPolicyService', () => {
  it('loads defaults with optional adapters disabled', () => {
    const config = IntegrationPolicyService.fromEnv({});
    expect(config.postgres.isEnabled).toBe(true);
    expect(config.clickhouse.isEnabled).toBe(false);
  });

  it('builds capability report', () => {
    const config = IntegrationPolicyService.fromEnv({});
    const report = IntegrationPolicyService.capabilityReport(config);
    expect(report.length).toBe(7);
  });
});
