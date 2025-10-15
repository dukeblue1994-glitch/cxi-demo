import { test, expect } from '@playwright/test';
const BASE = process.env.BASE_URL || 'http://localhost:8888';
test('home renders @smoke', async ({ page }) => {
  await page.goto(BASE + '/');
  await expect(page.locator('body')).toBeVisible();
});
test('demo loads @smoke', async ({ page }) => {
  await page.goto(BASE + '/');
  await expect(page.locator('#cxi-magic')).toBeVisible();
});
test('functions reachable @smoke', async ({ request }) => {
  const res = await request.get(BASE + '/.netlify/functions/healthz');
  expect(res.status()).toBe(200);
});
