const assert = require('node:assert/strict')
const test = require('node:test')

const { Kafka } = require('kafkajs')
const { GenericContainer, Wait } = require('testcontainers')

const {
  getFreePort,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'kafka container smoke test',
  {
    timeout: 240_000,
    skip: skipIfDisabled('KAFKA_ENABLED', 'Kafka'),
  },
  async () => {
    const externalPort = await getFreePort()
    const container = await startContainer(
      'Kafka',
      new GenericContainer('docker.redpanda.com/redpandadata/redpanda:v24.2.18')
        .withCommand([
          'redpanda',
          'start',
          '--overprovisioned',
          '--smp',
          '1',
          '--memory',
          '512M',
          '--reserve-memory',
          '0M',
          '--node-id',
          '0',
          '--check=false',
          '--kafka-addr',
          'PLAINTEXT://0.0.0.0:9092,OUTSIDE://0.0.0.0:29092',
          '--advertise-kafka-addr',
          `PLAINTEXT://localhost:9092,OUTSIDE://localhost:${externalPort}`,
        ])
        .withExposedPorts({ container: 29092, host: externalPort })
        .withWaitStrategy(Wait.forListeningPorts()),
    )

    const kafka = new Kafka({
      clientId: 'containers-smoke-test',
      brokers: [`localhost:${externalPort}`],
    })
    const admin = kafka.admin()

    try {
      await admin.connect()
      await admin.createTopics({
        topics: [{ topic: 'smoke-topic', numPartitions: 1, replicationFactor: 1 }],
        waitForLeaders: true,
      })
      const topics = await admin.listTopics()
      assert.ok(topics.includes('smoke-topic'))
    } finally {
      await admin.disconnect().catch(() => undefined)
      await container.stop()
    }
  },
)
