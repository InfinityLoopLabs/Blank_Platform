import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

type StoryCase = {
  id: string
  snapshot: string
}

type DiffStats = {
  diffPixels: number | null
  diffRatio: number | null
  diffPath: string | null
  width: number | null
  height: number | null
}

const stories: readonly StoryCase[] = [
  { id: 'atoms-button--all-colors', snapshot: 'atoms-button-all-colors.png' },
  { id: 'atoms-tag--playground', snapshot: 'atoms-tag-playground.png' },
  { id: 'design-typography--playground', snapshot: 'design-typography-playground.png' },
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..', '..')
const runId = process.env.VISUAL_RUN_ID ?? 'local'

const runRoot = path.join(__dirname, 'runs', 'latest')
const actualDir = path.join(runRoot, 'actual')
const diffDir = path.join(runRoot, 'diff')
const resultsDir = path.join(runRoot, 'results')

const ensureDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true })
}

const toPosixRelativePath = (absolutePath: string) =>
  path.relative(packageRoot, absolutePath).split(path.sep).join('/')

const slugify = (value: string) =>
  value
    .replace(/\.png$/i, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

const buildDiffStats = (
  baselinePath: string,
  actualPath: string,
  outputDiffPath: string,
): DiffStats => {
  if (!fs.existsSync(baselinePath) || !fs.existsSync(actualPath)) {
    return {
      diffPixels: null,
      diffRatio: null,
      diffPath: null,
      width: null,
      height: null,
    }
  }

  const baselinePng = PNG.sync.read(fs.readFileSync(baselinePath))
  const actualPng = PNG.sync.read(fs.readFileSync(actualPath))

  if (
    baselinePng.width !== actualPng.width ||
    baselinePng.height !== actualPng.height
  ) {
    return {
      diffPixels: null,
      diffRatio: null,
      diffPath: null,
      width: baselinePng.width,
      height: baselinePng.height,
    }
  }

  const diffPng = new PNG({ width: baselinePng.width, height: baselinePng.height })
  const diffPixels = pixelmatch(
    baselinePng.data,
    actualPng.data,
    diffPng.data,
    baselinePng.width,
    baselinePng.height,
    {
      threshold: 0.1,
    },
  )

  ensureDir(path.dirname(outputDiffPath))
  fs.writeFileSync(outputDiffPath, PNG.sync.write(diffPng))

  const totalPixels = baselinePng.width * baselinePng.height

  return {
    diffPixels,
    diffRatio: Number((diffPixels / totalPixels).toFixed(6)),
    diffPath: toPosixRelativePath(outputDiffPath),
    width: baselinePng.width,
    height: baselinePng.height,
  }
}

ensureDir(actualDir)
ensureDir(diffDir)
ensureDir(resultsDir)

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ui-kit-storybook-theme', 'dark')
  })
})

for (const story of stories) {
  test(`visual: ${story.id}`, async ({ page, baseURL }, testInfo) => {
    if (!baseURL) {
      throw new Error('Playwright baseURL is required for visual tests')
    }

    const artifactStem = `${slugify(story.snapshot)}-${testInfo.project.name}`
    const actualPath = path.join(actualDir, `${artifactStem}.png`)
    const diffPath = path.join(diffDir, `${artifactStem}.png`)
    const resultPath = path.join(resultsDir, `${slugify(story.id)}.json`)
    const baselinePath = testInfo.snapshotPath(story.snapshot)

    let status: 'passed' | 'failed' = 'passed'
    let failureMessage: string | null = null

    try {
      await page.goto(`${baseURL}/iframe.html?id=${story.id}&viewMode=story`, {
        waitUntil: 'networkidle',
      })

      await page.waitForSelector('#storybook-root > *')
      await page.evaluate(async () => {
        await document.fonts.ready
      })

      await page.screenshot({
        path: actualPath,
        fullPage: false,
        animations: 'disabled',
        caret: 'hide',
      })

      const actualBuffer = fs.readFileSync(actualPath)
      await expect(actualBuffer).toMatchSnapshot(story.snapshot, {
        maxDiffPixelRatio: 0.01,
      })
    } catch (error) {
      status = 'failed'
      failureMessage = error instanceof Error ? error.message : 'Unknown visual regression failure'
      throw error
    } finally {
      const baselineExists = fs.existsSync(baselinePath)
      const diffStats = buildDiffStats(baselinePath, actualPath, diffPath)

      const result = {
        schemaVersion: 1,
        runId,
        storyId: story.id,
        snapshotName: story.snapshot,
        projectName: testInfo.project.name,
        browserName: testInfo.project.use.browserName,
        status,
        failureMessage,
        capturedAt: new Date().toISOString(),
        baselineExists,
        baselinePath: toPosixRelativePath(baselinePath),
        actualPath: toPosixRelativePath(actualPath),
        diffPath: diffStats.diffPath,
        diffPixels: diffStats.diffPixels,
        diffRatio: diffStats.diffRatio,
        width: diffStats.width,
        height: diffStats.height,
      }

      fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n')
    }
  })
}
