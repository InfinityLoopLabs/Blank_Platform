import { ConfigService } from '../../src/platform/modules/config/application/config.service'

describe('ConfigService', () => {
  it('fails when required env is missing', () => {
    expect(() => ConfigService.fromEnv({})).toThrow('APP_ENV is required')
  })

  it('loads valid environment', () => {
    const config = ConfigService.fromEnv({
      APP_ENV: 'dev',
      APP_PORT: '3000',
      SCHEMA_MODE: 'ok',
      OTEL_SIDECAR_ENDPOINT: 'localhost:4317',
      OTEL_SIDECAR_AVAILABLE: 'true',
    })
    expect(config.appEnv).toBe('dev')
    expect(config.appPort).toBe(3000)
    expect(config.schemaMode).toBe('ok')
    expect(config.otelSidecarEndpoint).toBe('localhost:4317')
    expect(config.isOtelSidecarAvailable).toBe(true)
  })
})
