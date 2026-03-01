const assert = require('node:assert/strict')
const test = require('node:test')

const Minio = require('minio')
const { GenericContainer } = require('testcontainers')

const {
  DEFAULT_TIMEOUT_MS,
  skipIfDisabled,
  startContainer,
  streamToBuffer,
} = require('./_helpers')

test(
  'minio container smoke test',
  {
    timeout: DEFAULT_TIMEOUT_MS,
    skip: skipIfDisabled('MINIO_ENABLED', 'MinIO'),
  },
  async () => {
    const accessKey = 'minioadmin'
    const secretKey = 'minioadmin'
    const container = await startContainer(
      'MinIO',
      new GenericContainer('minio/minio:latest')
        .withCommand(['server', '/data'])
        .withEnvironment({
          MINIO_ROOT_USER: accessKey,
          MINIO_ROOT_PASSWORD: secretKey,
        })
        .withExposedPorts(9000),
    )

    const client = new Minio.Client({
      endPoint: container.getHost(),
      port: container.getMappedPort(9000),
      useSSL: false,
      accessKey,
      secretKey,
    })

    try {
      const bucket = 'smoke-bucket'
      const objectName = 'ping.txt'
      const payload = Buffer.from('minio-ok')

      await client.makeBucket(bucket, 'us-east-1')
      await client.putObject(bucket, objectName, payload)
      const stream = await client.getObject(bucket, objectName)
      const content = await streamToBuffer(stream)
      assert.equal(content.toString(), payload.toString())
    } finally {
      await container.stop()
    }
  },
)
