import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('InsightRow mobile — no horizontal padding', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const row = page.locator('[data-section-type="analysis"]').first().locator('h3:has-text("AI zamiast surowych danych")').locator('..');
  const padding = await row.evaluate((el) => {
    const s = getComputedStyle(el as HTMLElement);
    return { left: s.paddingLeft, right: s.paddingRight, top: s.paddingTop, bottom: s.paddingBottom };
  });

  expect(padding.left).toBe('0px');
  expect(padding.right).toBe('0px');
  expect(padding.top).toBe('32px');
  expect(padding.bottom).toBe('32px');
});

test('InsightRow desktop — full padding preserved', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const row = page.locator('[data-section-type="analysis"]').first().locator('h3:has-text("AI zamiast surowych danych")').locator('..');
  const padding = await row.evaluate((el) => {
    const s = getComputedStyle(el as HTMLElement);
    return { left: s.paddingLeft, right: s.paddingRight, top: s.paddingTop, bottom: s.paddingBottom };
  });

  expect(padding.left).toBe('32px');
  expect(padding.right).toBe('32px');
  expect(padding.top).toBe('32px');
  expect(padding.bottom).toBe('32px');
});
