const assert = require('node:assert/strict')
const test = require('node:test')

const Cassandra = require('cassandra-driver')
const { GenericContainer, Wait } = require('testcontainers')

const {
  retryUntilSuccess,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'scylla cql container smoke test',
  {
    timeout: 240_000,
    skip: skipIfDisabled('SCYLLA_ENABLED', 'Scylla'),
  },
  async () => {
    const container = await startContainer(
      'Scylla',
      new GenericContainer('scylladb/scylla:6.2')
        .withCommand([
          '--smp',
          '1',
          '--memory',
          '1G',
          '--overprovisioned',
          '1',
          '--developer-mode',
          '1',
        ])
        .withExposedPorts(9042)
        .withWaitStrategy(Wait.forLogMessage('Starting listening for CQL clients')),
    )

    const client = new Cassandra.Client({
      contactPoints: [`${container.getHost()}:${container.getMappedPort(9042)}`],
      localDataCenter: 'datacenter1',
    })

    try {
      const result = await retryUntilSuccess('Scylla CQL', 90_000, async () => {
        await client.connect()
        return await client.execute('SELECT release_version FROM system.local')
      })
      assert.ok(result.rows.length > 0)
    } finally {
      await client.shutdown().catch(() => undefined)
      await container.stop()
    }
  },
)
