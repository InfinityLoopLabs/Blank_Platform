const assert = require('node:assert/strict')
const test = require('node:test')

const { Client } = require('hazelcast-client')
const { GenericContainer, Wait } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  retryUntilSuccess,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'hazelcast container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('HAZELCAST_ENABLED', 'Hazelcast'),
  },
  async () => {
    const clusterName = 'dev'
    const container = await startContainer(
      'Hazelcast',
      new GenericContainer('hazelcast/hazelcast:5.5.0')
        .withEnvironment({
          HZ_CLUSTERNAME: clusterName,
        })
        .withExposedPorts(5701)
        .withWaitStrategy(Wait.forLogMessage('is STARTED')),
    )

    const host = container.getHost()
    const port = container.getMappedPort(5701)
    const client = await retryUntilSuccess('Hazelcast', 60_000, async () =>
      Client.newHazelcastClient({
        clusterName,
        network: {
          clusterMembers: [`${host}:${port}`],
        },
      }),
    )

    try {
      const map = await client.getMap('smoke-map')
      await map.put('ping', 'hazelcast-ok')
      const value = await map.get('ping')
      assert.equal(value, 'hazelcast-ok')
    } finally {
      await client.shutdown().catch(() => undefined)
      await container.stop()
    }
  },
)
