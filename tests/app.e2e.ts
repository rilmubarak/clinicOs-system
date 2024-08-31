import { test, expect } from '@playwright/test';

test('home page should have the correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const title = await page.title();
  expect(title).toContain('Clinic Os Admin');
});
