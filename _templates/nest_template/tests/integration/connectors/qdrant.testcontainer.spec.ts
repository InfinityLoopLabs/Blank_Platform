const assert = require('node:assert/strict')
const test = require('node:test')

const { QdrantClient } = require('@qdrant/js-client-rest')
const { GenericContainer } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'qdrant container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('QDRANT_ENABLED', 'Qdrant'),
  },
  async () => {
    const container = await startContainer(
      'Qdrant',
      new GenericContainer('qdrant/qdrant:v1.13.4').withExposedPorts(6333),
    )

    const client = new QdrantClient({
      url: `http://${container.getHost()}:${container.getMappedPort(6333)}`,
      timeout: 10_000,
      checkCompatibility: false,
    })

    try {
      const collections = await client.getCollections()
      assert.ok(Array.isArray(collections.collections))
    } finally {
      await container.stop()
    }
  },
)
