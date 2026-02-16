import { expect, test } from '@playwright/test'

test('home page should render', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/New React Router App/i)
})
