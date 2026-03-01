const assert = require('node:assert/strict')
const test = require('node:test')

const neo4j = require('neo4j-driver')
const { GenericContainer, Wait } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'neo4j container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('NEO4J_ENABLED', 'Neo4j'),
  },
  async () => {
    const username = 'neo4j'
    const password = 'neo4jpass123'
    const container = await startContainer(
      'Neo4j',
      new GenericContainer('neo4j:5-community')
        .withEnvironment({ NEO4J_AUTH: `${username}/${password}` })
        .withExposedPorts(7687)
        .withWaitStrategy(Wait.forLogMessage('Bolt enabled on')),
    )

    const driver = neo4j.driver(
      `bolt://${container.getHost()}:${container.getMappedPort(7687)}`,
      neo4j.auth.basic(username, password),
    )

    try {
      const session = driver.session()
      const result = await session.run('RETURN 1 AS ok')
      const value = result.records[0]?.get('ok')
      const numberValue =
        typeof value?.toNumber === 'function' ? value.toNumber() : Number(value)
      assert.equal(numberValue, 1)
      await session.close()
    } finally {
      await driver.close().catch(() => undefined)
      await container.stop()
    }
  },
)
