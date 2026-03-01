const assert = require('node:assert/strict')
const test = require('node:test')

const Redis = require('ioredis')
const { GenericContainer } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'redis container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('REDIS_ENABLED', 'Redis'),
  },
  async () => {
    const container = await startContainer(
      'Redis',
      new GenericContainer('redis:7-alpine').withExposedPorts(6379),
    )

    const redis = new Redis({
      host: container.getHost(),
      port: container.getMappedPort(6379),
    })

    try {
      const pong = await redis.ping()
      assert.equal(pong, 'PONG')
    } finally {
      await redis.quit().catch(() => undefined)
      await container.stop()
    }
  },
)
