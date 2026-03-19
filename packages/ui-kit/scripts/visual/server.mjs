import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn, spawnSync } from 'node:child_process'

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

const MAX_RUN_LOG_LENGTH = 120_000
let latestRun = null

const trimLog = value =>
  value.length > MAX_RUN_LOG_LENGTH ? value.slice(value.length - MAX_RUN_LOG_LENGTH) : value

const appendRunLog = (field, chunk) => {
  if (!latestRun || typeof chunk !== 'string' || chunk.length === 0) {
    return
  }

  latestRun[field] = trimLog(`${latestRun[field]}${chunk}`)
}

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getRunSnapshot = () =>
  latestRun ?? {
    status: 'idle',
  }

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

const normalizeStoryArtifactGroups = storyLike => {
  const fromArray = Array.isArray(storyLike?.artifactGroups) ? storyLike.artifactGroups : []
  const normalized = fromArray
    .map((group, index) => {
      const groupId =
        typeof group?.id === 'string' && group.id.trim().length > 0
          ? group.id.trim()
          : typeof group?.testCase === 'string' && group.testCase.trim().length > 0
            ? group.testCase.trim()
            : index === 0
              ? 'default'
              : `case-${index + 1}`
      const testCase =
        typeof group?.testCase === 'string' && group.testCase.trim().length > 0
          ? group.testCase.trim()
          : groupId
      return {
        id: groupId,
        testCase,
        screenshotName:
          typeof group?.screenshotName === 'string' && group.screenshotName.trim().length > 0
            ? group.screenshotName.trim()
            : null,
        capturedAt:
          typeof group?.capturedAt === 'string' && group.capturedAt.trim().length > 0
            ? group.capturedAt.trim()
            : null,
        baselineExists: typeof group?.baselineExists === 'boolean' ? group.baselineExists : Boolean(group?.baselinePath),
        baselinePath:
          typeof group?.baselinePath === 'string' && group.baselinePath.trim().length > 0
            ? group.baselinePath.trim()
            : null,
        actualPath:
          typeof group?.actualPath === 'string' && group.actualPath.trim().length > 0
            ? group.actualPath.trim()
            : null,
        diffPath:
          typeof group?.diffPath === 'string' && group.diffPath.trim().length > 0
            ? group.diffPath.trim()
            : null,
        diffPixels: typeof group?.diffPixels === 'number' ? group.diffPixels : null,
        diffRatio: typeof group?.diffRatio === 'number' ? group.diffRatio : null,
        width: typeof group?.width === 'number' ? group.width : null,
        height: typeof group?.height === 'number' ? group.height : null,
      }
    })
    .filter(group => group.baselinePath || group.actualPath || group.diffPath)

  if (normalized.length > 0) {
    return normalized
  }

  const baselinePath =
    typeof storyLike?.baselinePath === 'string' && storyLike.baselinePath.trim().length > 0
      ? storyLike.baselinePath.trim()
      : null
  const actualPath =
    typeof storyLike?.actualPath === 'string' && storyLike.actualPath.trim().length > 0
      ? storyLike.actualPath.trim()
      : null
  const diffPath =
    typeof storyLike?.diffPath === 'string' && storyLike.diffPath.trim().length > 0
      ? storyLike.diffPath.trim()
      : null

  if (!baselinePath && !actualPath && !diffPath) {
    return []
  }

  return [
    {
      id: 'default',
      testCase:
        typeof storyLike?.testCase === 'string' && storyLike.testCase.trim().length > 0
          ? storyLike.testCase.trim()
          : 'default',
      screenshotName:
        typeof storyLike?.screenshotName === 'string' && storyLike.screenshotName.trim().length > 0
          ? storyLike.screenshotName.trim()
          : null,
      capturedAt:
        typeof storyLike?.capturedAt === 'string' && storyLike.capturedAt.trim().length > 0
          ? storyLike.capturedAt.trim()
          : null,
      baselineExists: Boolean(baselinePath),
      baselinePath,
      actualPath,
      diffPath,
      diffPixels: typeof storyLike?.diffPixels === 'number' ? storyLike.diffPixels : null,
      diffRatio: typeof storyLike?.diffRatio === 'number' ? storyLike.diffRatio : null,
      width: typeof storyLike?.width === 'number' ? storyLike.width : null,
      height: typeof storyLike?.height === 'number' ? storyLike.height : null,
    },
  ]
}

const resolveStoryArtifacts = storyId => {
  const manifest = loadManifest()
  const state = loadState()
  const manifestStory = manifest.stories?.[storyId] ?? null
  const stateStory = state.stories?.[storyId] ?? null
  const manifestGroups = normalizeStoryArtifactGroups(manifestStory)
  const stateGroups = normalizeStoryArtifactGroups(stateStory?.lastRun ?? null)
  const artifactGroups = manifestGroups.length > 0 ? manifestGroups : stateGroups
  const primaryGroup = artifactGroups[0] ?? null

  return {
    baselinePath:
      primaryGroup?.baselinePath ?? manifestStory?.baselinePath ?? stateStory?.baselinePath ?? null,
    actualPath:
      primaryGroup?.actualPath ?? manifestStory?.actualPath ?? stateStory?.lastRun?.actualPath ?? null,
    diffPath: primaryGroup?.diffPath ?? manifestStory?.diffPath ?? stateStory?.lastRun?.diffPath ?? null,
    artifactGroups,
  }
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

app.get('/api/visual/run', (_request, response) => {
  response.json(getRunSnapshot())
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

app.get('/api/visual/artifact', (request, response) => {
  const storyId = typeof request.query.storyId === 'string' ? request.query.storyId : ''
  const kind = typeof request.query.kind === 'string' ? request.query.kind : ''
  const artifactId = typeof request.query.artifactId === 'string' ? request.query.artifactId.trim() : ''

  if (!storyId) {
    response.status(400).json({ error: 'Query parameter "storyId" is required' })
    return
  }

  if (!['b', 'a', 'd'].includes(kind)) {
    response.status(400).json({ error: 'Query parameter "kind" must be one of: b, a, d' })
    return
  }

  const artifacts = resolveStoryArtifacts(storyId)
  const artifactGroup =
    artifactId.length > 0
      ? artifacts.artifactGroups.find(group => group.id === artifactId || group.testCase === artifactId) ?? null
      : artifacts.artifactGroups[0] ?? null
  const relativePath = artifactGroup
    ? kind === 'b'
      ? artifactGroup.baselinePath
      : kind === 'a'
        ? artifactGroup.actualPath
        : artifactGroup.diffPath
    : kind === 'b'
      ? artifacts.baselinePath
      : kind === 'a'
        ? artifacts.actualPath
        : artifacts.diffPath

  if (!relativePath) {
    response.status(404).json({
      error: artifactId
        ? `No artifact path found for story "${storyId}" and artifact "${artifactId}"`
        : `No artifact path found for story "${storyId}"`,
    })
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
      error: error instanceof Error ? error.message : 'Invalid artifact path',
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

app.post('/api/visual/run', (request, response) => {
  if (latestRun?.status === 'running') {
    response.status(409).json({
      error: 'Visual tests are already running',
      run: getRunSnapshot(),
    })
    return
  }

  const rawStoryId = request.body?.storyId
  const storyId =
    typeof rawStoryId === 'string' && rawStoryId.trim().length > 0 ? rawStoryId.trim() : null

  if (rawStoryId != null && storyId == null) {
    response.status(400).json({ error: 'storyId must be a non-empty string when provided' })
    return
  }

  const scriptArgs = ['./scripts/visual/run-visual-tests.mjs']
  if (storyId) {
    // Use a loose regex for current-story runs: Playwright grep can include
    // additional title-path segments depending on context.
    scriptArgs.push('--grep', escapeRegExp(storyId))
  }

  latestRun = {
    id:
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: 'running',
    storyId,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    exitCode: null,
    pid: null,
    stdout: '',
    stderr: '',
    command: `${process.execPath} ${scriptArgs.join(' ')}`,
  }

  const child = spawn(process.execPath, scriptArgs, {
    cwd: packageRoot,
    env: process.env,
  })

  latestRun.pid = child.pid ?? null

  child.stdout?.setEncoding('utf8')
  child.stderr?.setEncoding('utf8')
  child.stdout?.on('data', chunk => {
    appendRunLog('stdout', chunk)
  })
  child.stderr?.on('data', chunk => {
    appendRunLog('stderr', chunk)
  })

  child.on('error', error => {
    if (!latestRun) {
      return
    }

    latestRun.status = 'failed'
    latestRun.exitCode = null
    latestRun.finishedAt = new Date().toISOString()
    appendRunLog('stderr', error instanceof Error ? `${error.message}\n` : 'Unknown run error\n')
  })

  child.on('close', code => {
    if (!latestRun) {
      return
    }

    latestRun.status = code === 0 ? 'passed' : 'failed'
    latestRun.exitCode = typeof code === 'number' ? code : null
    latestRun.finishedAt = new Date().toISOString()
  })

  response.status(202).json({
    ok: true,
    run: getRunSnapshot(),
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
    const storyArtifactGroups = normalizeStoryArtifactGroups(manifestStory)
    const copiedGroups = []

    for (const group of storyArtifactGroups) {
      if (!group.actualPath || !group.baselinePath) {
        continue
      }

      const actualAbsolutePath = resolveSafePath(group.actualPath)
      const baselineAbsolutePath = resolveSafePath(group.baselinePath)
      if (!fs.existsSync(actualAbsolutePath)) {
        continue
      }

      fs.mkdirSync(path.dirname(baselineAbsolutePath), { recursive: true })
      fs.copyFileSync(actualAbsolutePath, baselineAbsolutePath)
      copiedGroups.push({
        ...group,
        baselineExists: true,
      })
    }

    const fallbackActualPath =
      typeof manifestStory.actualPath === 'string' && manifestStory.actualPath.length > 0
        ? manifestStory.actualPath
        : null
    const fallbackBaselinePath =
      typeof manifestStory.baselinePath === 'string' && manifestStory.baselinePath.length > 0
        ? manifestStory.baselinePath
        : null

    if (copiedGroups.length === 0 && fallbackActualPath && fallbackBaselinePath) {
      const actualAbsolutePath = resolveSafePath(fallbackActualPath)
      const baselineAbsolutePath = resolveSafePath(fallbackBaselinePath)
      if (!fs.existsSync(actualAbsolutePath)) {
        response.status(404).json({ error: `Actual image not found: ${fallbackActualPath}` })
        return
      }

      fs.mkdirSync(path.dirname(baselineAbsolutePath), { recursive: true })
      fs.copyFileSync(actualAbsolutePath, baselineAbsolutePath)
      copiedGroups.push({
        id: 'default',
        testCase: 'default',
        baselineExists: true,
        baselinePath: fallbackBaselinePath,
        actualPath: fallbackActualPath,
        diffPath:
          typeof manifestStory.diffPath === 'string' && manifestStory.diffPath.length > 0
            ? manifestStory.diffPath
            : null,
        diffPixels: typeof manifestStory.diffPixels === 'number' ? manifestStory.diffPixels : null,
        diffRatio: typeof manifestStory.diffRatio === 'number' ? manifestStory.diffRatio : null,
        screenshotName:
          typeof manifestStory.screenshotName === 'string' ? manifestStory.screenshotName : null,
        capturedAt: typeof manifestStory.capturedAt === 'string' ? manifestStory.capturedAt : null,
        width: typeof manifestStory.width === 'number' ? manifestStory.width : null,
        height: typeof manifestStory.height === 'number' ? manifestStory.height : null,
      })
    }

    if (copiedGroups.length === 0) {
      response.status(404).json({ error: `No actual artifacts found to approve for "${storyId}"` })
      return
    }

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
    current.lastAction = {
      type: 'approve',
      at: now,
    }

    const primaryApprovedGroup = copiedGroups[0]
    const primaryBaselineAbsolutePath = resolveSafePath(primaryApprovedGroup.baselinePath)
    current.baselinePath = toPosixRelativePath(primaryBaselineAbsolutePath)
    current.baselineHash = hashFile(primaryBaselineAbsolutePath)
    current.baselineUpdatedAt = now

    if (manifestStory) {
      current.lastRun = {
        runId: manifest.runId,
        status: manifestStory.status,
        capturedAt: manifestStory.capturedAt,
        diffPixels: manifestStory.diffPixels,
        diffRatio: manifestStory.diffRatio,
        actualPath: primaryApprovedGroup.actualPath,
        diffPath: primaryApprovedGroup.diffPath,
        artifactGroups: copiedGroups,
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
  console.log(
    '[visual] endpoints: /api/visual/artifact, /api/visual/run, /api/visual/state, /api/visual/manifest, /api/visual/stories',
  )
})
