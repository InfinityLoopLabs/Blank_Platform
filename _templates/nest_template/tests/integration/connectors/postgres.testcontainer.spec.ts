const assert = require('node:assert/strict')
const test = require('node:test')

const { Client: PgClient } = require('pg')
const { GenericContainer, Wait } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  retryUntilSuccess,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'postgres container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('POSTGRES_ENABLED', 'PostgreSQL'),
  },
  async () => {
    const container = await startContainer(
      'PostgreSQL',
      new GenericContainer('postgres:16-alpine')
        .withEnvironment({
          POSTGRES_DB: 'app',
          POSTGRES_USER: 'app',
          POSTGRES_PASSWORD: 'app',
        })
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forListeningPorts()),
    )

    try {
      const result = await retryUntilSuccess('PostgreSQL', 60_000, async () => {
        const client = new PgClient({
          host: container.getHost(),
          port: container.getMappedPort(5432),
          database: 'app',
          user: 'app',
          password: 'app',
        })
        try {
          await client.connect()
          return await client.query('SELECT 1 AS ok')
        } finally {
          await client.end().catch(() => undefined)
        }
      })
      assert.equal(result.rows[0]?.ok, 1)
    } finally {
      await container.stop()
    }
  },
)
