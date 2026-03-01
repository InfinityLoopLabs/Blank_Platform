const assert = require('node:assert/strict')
const test = require('node:test')

const { createClient: createClickHouseClient } = require('@clickhouse/client')
const { GenericContainer, Wait } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  retryUntilSuccess,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'clickhouse container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('CLICKHOUSE_ENABLED', 'ClickHouse'),
  },
  async () => {
    const container = await startContainer(
      'ClickHouse',
      new GenericContainer('clickhouse/clickhouse-server:24.12')
        .withEnvironment({
          CLICKHOUSE_DB: 'default',
          CLICKHOUSE_USER: 'app',
          CLICKHOUSE_PASSWORD: 'app',
        })
        .withExposedPorts(8123)
        .withWaitStrategy(Wait.forListeningPorts()),
    )

    const client = createClickHouseClient({
      url: `http://${container.getHost()}:${container.getMappedPort(8123)}`,
      database: 'default',
      username: 'app',
      password: 'app',
    })

    try {
      const resultSet = await retryUntilSuccess('ClickHouse', 60_000, async () =>
        client.query({
          query: 'SELECT 1 AS ok',
          format: 'JSONEachRow',
        }),
      )
      const rows = await resultSet.json()
      assert.equal(rows[0]?.ok, 1)
    } finally {
      await client.close().catch(() => undefined)
      await container.stop()
    }
  },
)
