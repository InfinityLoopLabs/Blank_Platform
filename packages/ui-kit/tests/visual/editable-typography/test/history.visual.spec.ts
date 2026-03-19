import fs from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const packageRoot = process.cwd()
const runId = process.env.VISUAL_RUN_ID ?? 'local'
const runLabel = (() => {
  const value = runId
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return value.length > 0 ? value : 'local'
})()
const runRoot = path.join(packageRoot, 'tests', 'visual', 'runs', 'latest')
const resultsDir = path.join(runRoot, 'results')
const runHistoryRoot = path.resolve(
  runRoot,
  'editable-typography',
  'test',
  'history',
)

type DiffStats = {
  diffPixels: number | null
  diffRatio: number | null
  diffPath: string | null
  width: number | null
  height: number | null
}

type ArtifactGroup = {
  id: string
  testCase: string
  screenshotName: string
  capturedAt: string
  baselineExists: boolean
  baselinePath: string
  actualPath: string
  diffPath: string | null
  diffPixels: number | null
  diffRatio: number | null
  width: number | null
  height: number | null
}

const rootTestId = 'editable-typography-history'

const storyCases = [
  {
    typography: 'Heading',
    storyId: 'molecules-editabletypography-test-history--heading',
  },
  {
    typography: 'SectionHeader',
    storyId: 'molecules-editabletypography-test-history--section-header',
  },
  {
    typography: 'CompactHeader',
    storyId: 'molecules-editabletypography-test-history--compact-header',
  },
  {
    typography: 'Action',
    storyId: 'molecules-editabletypography-test-history--action',
  },
  {
    typography: 'Subheader',
    storyId: 'molecules-editabletypography-test-history--subheader',
  },
  {
    typography: 'Body',
    storyId: 'molecules-editabletypography-test-history--body',
  },
  {
    typography: 'BodySmall',
    storyId: 'molecules-editabletypography-test-history--body-small',
  },
  {
    typography: 'Caption',
    storyId: 'molecules-editabletypography-test-history--caption',
  },
  {
    typography: 'CompactCaption',
    storyId: 'molecules-editabletypography-test-history--compact-caption',
  },
] as const

const ensureDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true })
}

const toPosixRelativePath = (absolutePath: string) =>
  path.relative(packageRoot, absolutePath).split(path.sep).join('/')

const toSlug = (value: string) =>
  value
    .replace(/[^a-z0-9-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

const buildArtifactName = (storyId: string, testCase: string, projectName: string) =>
  `${runLabel}-${toSlug(storyId)}-${toSlug(testCase)}-${toSlug(projectName)}.png`

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

  if (baselinePng.width !== actualPng.width || baselinePng.height !== actualPng.height) {
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

ensureDir(runHistoryRoot)
ensureDir(resultsDir)

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ui-kit-storybook-theme', 'dark')
  })
})

for (const storyCase of storyCases) {
  test(`visual: ${storyCase.storyId}`, async ({
    page,
    baseURL,
  }, testInfo) => {
    if (!baseURL) {
      throw new Error('Playwright baseURL is required for editable typography history tests')
    }

    const url = `${baseURL}/iframe.html?id=${storyCase.storyId}&viewMode=story`
    const typographySlug = toSlug(storyCase.typography)
    const actualHistoryDir = path.join(runHistoryRoot, typographySlug)
    const diffHistoryDir = path.join(actualHistoryDir, 'diff')
    const resultPath = path.join(resultsDir, `${toSlug(storyCase.storyId)}.json`)
    ensureDir(actualHistoryDir)
    ensureDir(diffHistoryDir)

    let status: 'passed' | 'failed' = 'passed'
    let failureMessage: string | null = null
    const artifactGroups: ArtifactGroup[] = []
    const capturedAt = new Date().toISOString()

    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
      })

      await page.waitForSelector('#storybook-root > *')
      await page.evaluate(async () => {
        await document.fonts.ready
      })

      const historyRoot = page.getByTestId(rootTestId)
      const textTrigger = historyRoot.locator('.cursor-text')
      const input = historyRoot.locator('input')

      const captureStep = async (stepName: string) => {
        const snapshotName = ['history', typographySlug, `${stepName}.png`] as const
        const baselinePath = path.join(
          packageRoot,
          'tests',
          'visual',
          'editable-typography',
          'test',
          'history.visual.spec.ts-snapshots',
          'history',
          typographySlug,
          `${stepName}-${testInfo.project.name}-${process.platform}.png`,
        )
        const screenshotName = buildArtifactName(storyCase.storyId, stepName, testInfo.project.name)
        const actualPath = path.join(actualHistoryDir, screenshotName)
        const diffPath = path.join(diffHistoryDir, screenshotName)

        await historyRoot.screenshot({
          path: actualPath,
          animations: 'disabled',
          caret: 'hide',
        })

        const actualBuffer = fs.readFileSync(actualPath)
        await expect(actualBuffer).toMatchSnapshot(snapshotName, { maxDiffPixelRatio: 0.01 })

        const baselineExists = fs.existsSync(baselinePath)
        const diffStats = buildDiffStats(baselinePath, actualPath, diffPath)
        artifactGroups.push({
          id: toSlug(stepName),
          testCase: stepName,
          screenshotName,
          capturedAt,
          baselineExists,
          baselinePath: toPosixRelativePath(baselinePath),
          actualPath: toPosixRelativePath(actualPath),
          diffPath: diffStats.diffPath,
          diffPixels: diffStats.diffPixels,
          diffRatio: diffStats.diffRatio,
          width: diffStats.width,
          height: diffStats.height,
        })
      }

      await captureStep('01-initial')

      await textTrigger.click()
      await expect(input).toBeVisible()
      await captureStep('02-focus')

      await input.type('A')
      await captureStep('03-type')

      await input.blur()
      await expect(input).toHaveCount(0)
      await captureStep('04-blur')
    } catch (error) {
      status = 'failed'
      failureMessage = error instanceof Error ? error.message : 'Unknown visual regression failure'
      throw error
    } finally {
      const primaryGroup = artifactGroups[0] ?? null
      const result = {
        schemaVersion: 2,
        runId,
        storyId: storyCase.storyId,
        snapshotName: `${storyCase.storyId}.png`,
        projectName: testInfo.project.name,
        browserName: testInfo.project.use.browserName,
        status,
        failureMessage,
        capturedAt,
        testCase: primaryGroup?.testCase ?? null,
        screenshotName: primaryGroup?.screenshotName ?? null,
        baselineExists: primaryGroup?.baselineExists ?? false,
        baselinePath: primaryGroup?.baselinePath ?? null,
        actualPath: primaryGroup?.actualPath ?? null,
        diffPath: primaryGroup?.diffPath ?? null,
        diffPixels: primaryGroup?.diffPixels ?? null,
        diffRatio: primaryGroup?.diffRatio ?? null,
        width: primaryGroup?.width ?? null,
        height: primaryGroup?.height ?? null,
        artifactGroups,
      }

      fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n')
    }
  })
}
