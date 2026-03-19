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

const slugify = value =>
  String(value ?? '')
    .replace(/\.png$/i, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

const normalizeNullablePath = value =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const normalizeNullableNumber = value => (typeof value === 'number' ? value : null)

const normalizeArtifactGroups = result => {
  const fromArray = Array.isArray(result?.artifactGroups) ? result.artifactGroups : []

  const normalizedFromArray = fromArray
    .map((group, index) => {
      const testCase =
        typeof group?.testCase === 'string' && group.testCase.trim().length > 0
          ? group.testCase.trim()
          : typeof result?.testCase === 'string' && result.testCase.trim().length > 0
            ? result.testCase.trim()
            : index === 0
              ? 'default'
              : `case-${index + 1}`

      return {
        id:
          typeof group?.id === 'string' && group.id.trim().length > 0
            ? group.id.trim()
            : slugify(testCase) || `case-${index + 1}`,
        testCase,
        screenshotName:
          typeof group?.screenshotName === 'string' && group.screenshotName.trim().length > 0
            ? group.screenshotName.trim()
            : typeof result?.snapshotName === 'string'
              ? result.snapshotName
              : null,
        capturedAt:
          typeof group?.capturedAt === 'string' && group.capturedAt.trim().length > 0
            ? group.capturedAt.trim()
            : typeof result?.capturedAt === 'string'
              ? result.capturedAt
              : null,
        baselineExists:
          typeof group?.baselineExists === 'boolean'
            ? group.baselineExists
            : Boolean(group?.baselinePath ?? result?.baselineExists),
        baselinePath: normalizeNullablePath(group?.baselinePath),
        actualPath: normalizeNullablePath(group?.actualPath),
        diffPath: normalizeNullablePath(group?.diffPath),
        diffPixels: normalizeNullableNumber(group?.diffPixels),
        diffRatio: normalizeNullableNumber(group?.diffRatio),
        width: normalizeNullableNumber(group?.width),
        height: normalizeNullableNumber(group?.height),
      }
    })
    .filter(group => group.baselinePath || group.actualPath || group.diffPath)

  if (normalizedFromArray.length > 0) {
    return normalizedFromArray
  }

  const fallbackTestCase =
    typeof result?.testCase === 'string' && result.testCase.trim().length > 0
      ? result.testCase.trim()
      : 'default'
  const fallbackGroup = {
    id: slugify(fallbackTestCase) || 'default',
    testCase: fallbackTestCase,
    screenshotName:
      typeof result?.screenshotName === 'string' && result.screenshotName.trim().length > 0
        ? result.screenshotName.trim()
        : typeof result?.snapshotName === 'string'
          ? result.snapshotName
          : null,
    capturedAt:
      typeof result?.capturedAt === 'string' && result.capturedAt.trim().length > 0
        ? result.capturedAt.trim()
        : null,
    baselineExists: typeof result?.baselineExists === 'boolean' ? result.baselineExists : Boolean(result?.baselinePath),
    baselinePath: normalizeNullablePath(result?.baselinePath),
    actualPath: normalizeNullablePath(result?.actualPath),
    diffPath: normalizeNullablePath(result?.diffPath),
    diffPixels: normalizeNullableNumber(result?.diffPixels),
    diffRatio: normalizeNullableNumber(result?.diffRatio),
    width: normalizeNullableNumber(result?.width),
    height: normalizeNullableNumber(result?.height),
  }

  return fallbackGroup.baselinePath || fallbackGroup.actualPath || fallbackGroup.diffPath
    ? [fallbackGroup]
    : []
}

const mergeArtifactGroups = (leftGroups, rightGroups) => {
  const mergedMap = new Map()
  ;[...(leftGroups ?? []), ...(rightGroups ?? [])].forEach(group => {
    const key = typeof group?.id === 'string' && group.id.trim().length > 0 ? group.id : slugify(group?.testCase) || 'default'
    mergedMap.set(key, {
      ...group,
      id: key,
    })
  })
  return Array.from(mergedMap.values())
}

const selectPrimaryGroup = groups => groups.find(group => group.actualPath || group.baselinePath || group.diffPath) ?? null

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

const generatedAt = new Date().toISOString()

const stories = {}
for (const resultFile of resultFiles) {
  const resultPath = path.join(resultsDir, resultFile)
  const result = readJson(resultPath, null)

  if (!result || typeof result.storyId !== 'string') {
    continue
  }

  const indexEntry = storyIndexById.get(result.storyId)
  const nextGroups = normalizeArtifactGroups(result)
  const currentEntry = stories[result.storyId] ?? null
  const mergedGroups = currentEntry ? mergeArtifactGroups(currentEntry.artifactGroups, nextGroups) : nextGroups
  const primaryGroup = selectPrimaryGroup(mergedGroups)
  const currentCapturedAt =
    currentEntry && typeof currentEntry.capturedAt === 'string' ? currentEntry.capturedAt : null
  const nextCapturedAt = typeof result.capturedAt === 'string' ? result.capturedAt : null

  stories[result.storyId] = {
    ...result,
    schemaVersion: 2,
    artifactGroups: mergedGroups,
    testCase: primaryGroup?.testCase ?? null,
    screenshotName: primaryGroup?.screenshotName ?? null,
    baselineExists:
      typeof primaryGroup?.baselineExists === 'boolean'
        ? primaryGroup.baselineExists
        : Boolean(primaryGroup?.baselinePath),
    baselinePath: primaryGroup?.baselinePath ?? null,
    actualPath: primaryGroup?.actualPath ?? null,
    diffPath: primaryGroup?.diffPath ?? null,
    diffPixels: primaryGroup?.diffPixels ?? null,
    diffRatio: primaryGroup?.diffRatio ?? null,
    width: primaryGroup?.width ?? null,
    height: primaryGroup?.height ?? null,
    status:
      currentEntry && currentEntry.status === 'failed'
        ? 'failed'
        : result.status === 'failed'
          ? 'failed'
          : 'passed',
    failureMessage:
      result.status === 'failed' && typeof result.failureMessage === 'string'
        ? result.failureMessage
        : currentEntry?.failureMessage ?? null,
    capturedAt:
      nextCapturedAt && currentCapturedAt
        ? nextCapturedAt >= currentCapturedAt
          ? nextCapturedAt
          : currentCapturedAt
        : nextCapturedAt ?? currentCapturedAt ?? generatedAt,
    title: indexEntry?.title ?? null,
    name: indexEntry?.name ?? null,
  }
}

const runId = process.env.VISUAL_RUN_ID ?? readJson(path.join(runsLatestRoot, 'run-meta.json'), {}).runId ?? 'latest'

const manifest = {
  schemaVersion: 2,
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
  const baselineAbsolutePath =
    typeof result.baselinePath === 'string' && result.baselinePath.length > 0
      ? path.resolve(packageRoot, result.baselinePath)
      : null
  const baselineExists = baselineAbsolutePath ? fs.existsSync(baselineAbsolutePath) : false

  const currentStoryState = state.stories[storyId] ?? {
    version: baselineExists ? 1 : 0,
    approved: false,
    approvedAt: null,
    approvedBy: null,
  }

  if (baselineExists && Number(currentStoryState.version ?? 0) <= 0) {
    currentStoryState.version = 1
  }

  if (typeof result.baselinePath === 'string' && result.baselinePath.length > 0) {
    currentStoryState.baselinePath = result.baselinePath
  }
  currentStoryState.lastSeenAt = generatedAt
  currentStoryState.lastRun = {
    runId,
    status: result.status,
    capturedAt: result.capturedAt,
    diffPixels: result.diffPixels,
    diffRatio: result.diffRatio,
    actualPath: result.actualPath,
    diffPath: result.diffPath,
    artifactGroups: Array.isArray(result.artifactGroups) ? result.artifactGroups : [],
  }

  if (baselineExists && baselineAbsolutePath) {
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
