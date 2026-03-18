import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..', '..')
const visualRoot = path.join(packageRoot, 'tests', 'visual')
const runsLatestRoot = path.join(visualRoot, 'runs', 'latest')
const resultsDir = path.join(runsLatestRoot, 'results')
const manifestPath = path.join(runsLatestRoot, 'manifest.json')
const statePath = path.join(visualRoot, 'visual-state.json')
const storybookIndexPath = path.join(packageRoot, 'storybook-static', 'index.json')

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

const toPosixRelativePath = absolutePath =>
  path.relative(packageRoot, absolutePath).split(path.sep).join('/')

const hashFile = absolutePath => {
  const hash = crypto.createHash('sha256')
  hash.update(fs.readFileSync(absolutePath))
  return `sha256:${hash.digest('hex')}`
}

const ensureDir = dirPath => {
  fs.mkdirSync(dirPath, { recursive: true })
}

ensureDir(runsLatestRoot)

const storybookIndex = readJson(storybookIndexPath, { entries: {} })
const storyIndexById = new Map(
  Object.values(storybookIndex.entries ?? {}).map(entry => [entry.id, entry]),
)

const resultFiles = fs.existsSync(resultsDir)
  ? fs
      .readdirSync(resultsDir)
      .filter(fileName => fileName.endsWith('.json'))
      .sort((left, right) => left.localeCompare(right))
  : []

const stories = {}
for (const resultFile of resultFiles) {
  const resultPath = path.join(resultsDir, resultFile)
  const result = readJson(resultPath, null)

  if (!result || typeof result.storyId !== 'string') {
    continue
  }

  const indexEntry = storyIndexById.get(result.storyId)
  stories[result.storyId] = {
    ...result,
    title: indexEntry?.title ?? null,
    name: indexEntry?.name ?? null,
  }
}

const generatedAt = new Date().toISOString()
const runId = process.env.VISUAL_RUN_ID ?? readJson(path.join(runsLatestRoot, 'run-meta.json'), {}).runId ?? 'latest'

const manifest = {
  schemaVersion: 1,
  generatedAt,
  runId,
  stories,
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')

const state = readJson(statePath, {
  schemaVersion: 1,
  updatedAt: null,
  stories: {},
})

if (typeof state.stories !== 'object' || state.stories === null) {
  state.stories = {}
}

for (const [storyId, result] of Object.entries(stories)) {
  const baselineAbsolutePath = path.resolve(packageRoot, result.baselinePath)
  const baselineExists = fs.existsSync(baselineAbsolutePath)

  const currentStoryState = state.stories[storyId] ?? {
    version: baselineExists ? 1 : 0,
    approved: false,
    approvedAt: null,
    approvedBy: null,
  }

  if (baselineExists && Number(currentStoryState.version ?? 0) <= 0) {
    currentStoryState.version = 1
  }

  currentStoryState.baselinePath = result.baselinePath
  currentStoryState.lastSeenAt = generatedAt
  currentStoryState.lastRun = {
    runId,
    status: result.status,
    capturedAt: result.capturedAt,
    diffPixels: result.diffPixels,
    diffRatio: result.diffRatio,
    actualPath: result.actualPath,
    diffPath: result.diffPath,
  }

  if (baselineExists) {
    const baselineStat = fs.statSync(baselineAbsolutePath)
    currentStoryState.baselineHash = hashFile(baselineAbsolutePath)
    currentStoryState.baselineUpdatedAt = baselineStat.mtime.toISOString()
  }

  if (typeof currentStoryState.approved !== 'boolean') {
    currentStoryState.approved = false
  }

  state.stories[storyId] = currentStoryState
}

state.schemaVersion = 1
state.updatedAt = generatedAt
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n')

const storyList = Object.values(stories)
const passed = storyList.filter(story => story.status === 'passed').length
const failed = storyList.filter(story => story.status === 'failed').length

console.log(
  `[visual] manifest updated: ${toPosixRelativePath(manifestPath)} (stories=${storyList.length}, passed=${passed}, failed=${failed})`,
)
console.log(`[visual] state updated: ${toPosixRelativePath(statePath)}`)
