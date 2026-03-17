import { expect, test } from '@playwright/test'

const stories = [
  { id: 'atoms-button--all-colors', snapshot: 'atoms-button-all-colors.png' },
  { id: 'atoms-tag--playground', snapshot: 'atoms-tag-playground.png' },
  { id: 'design-typography--playground', snapshot: 'design-typography-playground.png' },
] as const

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ui-kit-storybook-theme', 'dark')
  })
})

for (const story of stories) {
  test(`visual: ${story.id}`, async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/iframe.html?id=${story.id}&viewMode=story`, {
      waitUntil: 'networkidle',
    })

    await page.waitForSelector('#storybook-root > *')
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    await expect(page).toHaveScreenshot(story.snapshot, {
      fullPage: false,
    })
  })
}
