import { HealthService } from '../../src/platform/modules/health/transport'

describe('HealthService', () => {
  it('returns readiness down for dirty mode', () => {
    const health = new HealthService('dirty')
    const status = health.status()
    expect(status.isReadinessUp).toBe(false)
    expect(status.reasonCode).toBe('SCHEMA_INCOMPATIBLE')
  })

  it('returns readiness down for db_down mode', () => {
    const health = new HealthService('db_down')
    const status = health.status()
    expect(status.isReadinessUp).toBe(false)
    expect(status.reasonCode).toBe('DEPENDENCY_UNAVAILABLE')
  })

  it('returns readiness up for ok mode', () => {
    const health = new HealthService('ok')
    const status = health.status()
    expect(status.isReadinessUp).toBe(true)
    expect(status.canWrite).toBe(true)
  })
})
