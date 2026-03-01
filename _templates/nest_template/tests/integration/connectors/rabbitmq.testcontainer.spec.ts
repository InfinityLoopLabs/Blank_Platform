const assert = require('node:assert/strict')
const test = require('node:test')

const amqp = require('amqplib')
const { GenericContainer, Wait } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  skipIfDisabled,
  startContainer,
} = require('./_helpers')

test(
  'rabbitmq container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('RABBITMQ_ENABLED', 'RabbitMQ'),
  },
  async () => {
    const username = 'app'
    const password = 'app'
    const container = await startContainer(
      'RabbitMQ',
      new GenericContainer('rabbitmq:3.13-management-alpine')
        .withEnvironment({
          RABBITMQ_DEFAULT_USER: username,
          RABBITMQ_DEFAULT_PASS: password,
        })
        .withExposedPorts(5672)
        .withWaitStrategy(Wait.forLogMessage('Server startup complete')),
    )

    try {
      const host = container.getHost()
      const port = container.getMappedPort(5672)
      const queue = 'smoke-test-queue'
      const payload = 'rabbitmq-ok'

      const connection = await amqp.connect(
        `amqp://${username}:${password}@${host}:${port}`,
      )
      const channel = await connection.createChannel()

      await channel.assertQueue(queue, { durable: false })
      const sent = channel.sendToQueue(queue, Buffer.from(payload))
      assert.equal(sent, true)

      const message = await channel.get(queue, { noAck: true })
      assert.ok(message)
      assert.equal(message.content.toString(), payload)

      await channel.close()
      await connection.close()
    } finally {
      await container.stop()
    }
  },
)
