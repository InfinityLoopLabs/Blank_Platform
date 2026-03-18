import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..', '..')
const runsLatestRoot = path.join(packageRoot, 'tests', 'visual', 'runs', 'latest')
const runId = new Date().toISOString().replace(/[:.]/g, '-')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const forwardedArgs = process.argv.slice(2)

fs.rmSync(runsLatestRoot, { recursive: true, force: true })
fs.mkdirSync(runsLatestRoot, { recursive: true })
fs.writeFileSync(
  path.join(runsLatestRoot, 'run-meta.json'),
  JSON.stringify(
    {
      runId,
      startedAt: new Date().toISOString(),
      args: forwardedArgs,
    },
    null,
    2,
  ) + '\n',
)

const testResult = spawnSync(
  npmCommand,
  ['exec', '--', 'playwright', 'test', '-c', './playwright.config.ts', ...forwardedArgs],
  {
    cwd: packageRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      VISUAL_RUN_ID: runId,
    },
  },
)

const manifestResult = spawnSync(process.execPath, ['./scripts/visual/build-manifest.mjs'], {
  cwd: packageRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VISUAL_RUN_ID: runId,
  },
})

if (manifestResult.status !== 0) {
  process.exit(manifestResult.status ?? 1)
}

if (typeof testResult.status === 'number') {
  process.exit(testResult.status)
}

process.exit(1)
