import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..', '..')
const visualRoot = path.join(packageRoot, 'tests', 'visual')
const manifestPath = path.join(visualRoot, 'runs', 'latest', 'manifest.json')
const statePath = path.join(visualRoot, 'visual-state.json')

const app = express()
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  next()
})
app.use(express.json({ limit: '1mb' }))

const ensureStateFile = () => {
  if (fs.existsSync(statePath)) {
    return
  }

  fs.mkdirSync(path.dirname(statePath), { recursive: true })
  fs.writeFileSync(
    statePath,
    JSON.stringify(
      {
        schemaVersion: 1,
        updatedAt: null,
        stories: {},
      },
      null,
      2,
    ) + '\n',
  )
}

const readJson = (filePath, fallbackValue) => {
  if (!fs.existsSync(filePath)) {
    return fallbackValue
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallbackValue
  }
}

const writeJson = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n')
}

const hashFile = absolutePath => {
  const hash = crypto.createHash('sha256')
  hash.update(fs.readFileSync(absolutePath))
  return `sha256:${hash.digest('hex')}`
}

const toPosixRelativePath = absolutePath =>
  path.relative(packageRoot, absolutePath).split(path.sep).join('/')

const resolveSafePath = relativePath => {
  const absolutePath = path.resolve(packageRoot, relativePath)
  const expectedRoot = `${packageRoot}${path.sep}`

  if (!absolutePath.startsWith(expectedRoot) && absolutePath !== packageRoot) {
    throw new Error('Path is outside package root')
  }

  return absolutePath
}

const loadManifest = () =>
  readJson(manifestPath, {
    schemaVersion: 1,
    generatedAt: null,
    runId: null,
    stories: {},
  })

const loadState = () => {
  ensureStateFile()
  const state = readJson(statePath, {
    schemaVersion: 1,
    updatedAt: null,
    stories: {},
  })

  if (typeof state.stories !== 'object' || state.stories === null) {
    state.stories = {}
  }

  return state
}

app.get('/api/visual/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/visual/manifest', (_request, response) => {
  response.json(loadManifest())
})

app.get('/api/visual/state', (_request, response) => {
  response.json(loadState())
})

app.get('/api/visual/stories', (_request, response) => {
  const manifest = loadManifest()
  const state = loadState()

  const storyIds = new Set([
    ...Object.keys(manifest.stories ?? {}),
    ...Object.keys(state.stories ?? {}),
  ])

  const stories = Array.from(storyIds)
    .sort((left, right) => left.localeCompare(right))
    .map(storyId => ({
      storyId,
      manifest: manifest.stories?.[storyId] ?? null,
      state: state.stories?.[storyId] ?? null,
    }))

  response.json({ stories })
})

app.get('/api/visual/file', (request, response) => {
  const relativePath = typeof request.query.path === 'string' ? request.query.path : ''

  if (!relativePath) {
    response.status(400).json({ error: 'Query parameter "path" is required' })
    return
  }

  try {
    const absolutePath = resolveSafePath(relativePath)

    if (!fs.existsSync(absolutePath)) {
      response.status(404).json({ error: 'File not found' })
      return
    }

    response.sendFile(absolutePath)
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid path',
    })
  }
})

app.post('/api/visual/rebuild', (_request, response) => {
  const result = spawnSync(process.execPath, ['./scripts/visual/build-manifest.mjs'], {
    cwd: packageRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    response.status(500).json({
      error: 'Failed to rebuild visual manifest',
      stdout: result.stdout,
      stderr: result.stderr,
    })
    return
  }

  response.json({
    ok: true,
    stdout: result.stdout,
    stderr: result.stderr,
  })
})

app.post('/api/visual/approve', (request, response) => {
  const { storyId, approvedBy } = request.body ?? {}

  if (typeof storyId !== 'string' || !storyId) {
    response.status(400).json({ error: 'storyId is required' })
    return
  }

  const manifest = loadManifest()
  const state = loadState()
  const manifestStory = manifest.stories?.[storyId]

  if (!manifestStory) {
    response.status(404).json({ error: `Story "${storyId}" not found in latest manifest` })
    return
  }

  try {
    const actualAbsolutePath = resolveSafePath(manifestStory.actualPath)
    const baselineAbsolutePath = resolveSafePath(manifestStory.baselinePath)

    if (!fs.existsSync(actualAbsolutePath)) {
      response.status(404).json({ error: `Actual image not found: ${manifestStory.actualPath}` })
      return
    }

    fs.mkdirSync(path.dirname(baselineAbsolutePath), { recursive: true })
    fs.copyFileSync(actualAbsolutePath, baselineAbsolutePath)

    const now = new Date().toISOString()
    const current = state.stories?.[storyId] ?? {
      version: 0,
      approved: false,
      approvedAt: null,
      approvedBy: null,
    }

    current.version = Number(current.version ?? 0) + 1
    current.approved = true
    current.approvedAt = now
    current.approvedBy =
      typeof approvedBy === 'string' && approvedBy.trim().length > 0
        ? approvedBy.trim()
        : process.env.USER ?? 'unknown'
    current.rejectReason = null
    current.rejectedAt = null
    current.rejectedBy = null
    current.baselinePath = toPosixRelativePath(baselineAbsolutePath)
    current.baselineHash = hashFile(baselineAbsolutePath)
    current.baselineUpdatedAt = now
    current.lastAction = {
      type: 'approve',
      at: now,
    }

    if (manifestStory) {
      current.lastRun = {
        runId: manifest.runId,
        status: manifestStory.status,
        capturedAt: manifestStory.capturedAt,
        diffPixels: manifestStory.diffPixels,
        diffRatio: manifestStory.diffRatio,
        actualPath: manifestStory.actualPath,
        diffPath: manifestStory.diffPath,
      }
    }

    state.stories[storyId] = current
    state.updatedAt = now

    writeJson(statePath, state)

    response.json({
      ok: true,
      storyId,
      story: current,
    })
  } catch (error) {
    response.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to approve story',
    })
  }
})

app.post('/api/visual/reject', (request, response) => {
  const { storyId, rejectedBy, reason } = request.body ?? {}

  if (typeof storyId !== 'string' || !storyId) {
    response.status(400).json({ error: 'storyId is required' })
    return
  }

  const state = loadState()
  const current = state.stories?.[storyId] ?? {
    version: 0,
    approved: false,
    approvedAt: null,
    approvedBy: null,
  }

  const now = new Date().toISOString()
  current.approved = false
  current.rejectedAt = now
  current.rejectedBy =
    typeof rejectedBy === 'string' && rejectedBy.trim().length > 0
      ? rejectedBy.trim()
      : process.env.USER ?? 'unknown'
  current.rejectReason = typeof reason === 'string' && reason.trim().length > 0 ? reason.trim() : null
  current.lastAction = {
    type: 'reject',
    at: now,
  }

  state.stories[storyId] = current
  state.updatedAt = now
  writeJson(statePath, state)

  response.json({
    ok: true,
    storyId,
    story: current,
  })
})

const port = Number(process.env.VISUAL_SERVER_PORT ?? 6007)
app.listen(port, () => {
  console.log(`[visual] server started: http://127.0.0.1:${port}`)
  console.log('[visual] endpoints: /api/visual/state, /api/visual/manifest, /api/visual/stories')
})
