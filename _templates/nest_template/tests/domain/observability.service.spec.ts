import { ObservabilityService } from '../../src/platform/modules/observability/transport'

describe('ObservabilityService', () => {
  it('drops events when sidecar is down', () => {
    const service = new ObservabilityService(
      'localhost:4317',
      false,
      'sample-nest',
      'test',
    )
    for (let i = 0; i < 512; i += 1) {
      service.emit('request_timing', { idx: i })
    }
    expect(service.snapshot().droppedEvents).toBeGreaterThan(0)
  })

  it('returns structured log payload', () => {
    const service = new ObservabilityService(
      'localhost:4317',
      true,
      'sample-nest',
      'test',
    )
    const payload = service.log('info', 'hello', { requestId: 'req-1' })
    expect(payload.level).toBe('info')
    expect(payload.requestId).toBe('req-1')
    expect(payload.timestamp).toBeDefined()
  })
})
