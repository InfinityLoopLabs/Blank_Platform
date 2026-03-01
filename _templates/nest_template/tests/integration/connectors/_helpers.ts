const fs = require('node:fs')
const net = require('node:net')
const path = require('node:path')

const DEFAULT_TIMEOUT_MS = 180_000

function errorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

function parseEnvFile(content) {
  const result = {}
  const lines = content.split(/\r?\n/)

  for (const lineRaw of lines) {
    const line = lineRaw.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const equalsIndex = line.indexOf('=')
    if (equalsIndex <= 0) {
      continue
    }

    const key = line.slice(0, equalsIndex).trim()
    let value = line.slice(equalsIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    result[key] = value
  }

  return result
}

function loadRuntimeEnv(cwd = process.cwd()) {
  const env = { ...process.env }
  const runtime =
    (env.APP_ENV ?? env.NODE_ENV ?? 'development').trim().toLowerCase() ||
    'development'
  const files = [`.env.${runtime}`, '.env']

  for (const fileName of files) {
    const fullPath = path.join(cwd, fileName)
    if (!fs.existsSync(fullPath)) {
      continue
    }
    const parsed = parseEnvFile(fs.readFileSync(fullPath, 'utf8'))
    for (const [key, value] of Object.entries(parsed)) {
      if (env[key] === undefined) {
        env[key] = value
      }
    }
  }

  return env
}

const RUNTIME_ENV = loadRuntimeEnv()

function isEnabledByFlag(flagName, defaultEnabled = true) {
  const raw = RUNTIME_ENV[flagName]
  if (raw === undefined) {
    return defaultEnabled
  }
  return raw.trim().toLowerCase() !== 'false'
}

function skipIfDisabled(flagName, displayName) {
  if (isEnabledByFlag(flagName)) {
    return false
  }
  return `${displayName} disabled by ${flagName}=false`
}

async function startContainer(name, builder) {
  try {
    return await builder.start()
  } catch (error) {
    throw new Error(
      `Failed to start ${name} test container. Docker is unavailable or unhealthy: ${errorMessage(error)}`,
    )
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryUntilSuccess(name, timeoutMs, operation) {
  const deadline = Date.now() + timeoutMs
  let lastError

  while (Date.now() < deadline) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      await sleep(1_500)
    }
  }

  throw new Error(
    `${name} did not become ready in ${timeoutMs}ms: ${errorMessage(lastError)}`,
  )
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Failed to get a free port')))
        return
      }
      const { port } = address
      server.close(closeError => {
        if (closeError) {
          reject(closeError)
          return
        }
        resolve(port)
      })
    })
  })
}

async function streamToBuffer(stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

module.exports = {
  DEFAULT_TIMEOUT_MS,
  getFreePort,
  retryUntilSuccess,
  skipIfDisabled,
  startContainer,
  streamToBuffer,
}
