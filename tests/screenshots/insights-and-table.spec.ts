import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4321';
const SLUG = '/badanie-przewag-brand24';

test('insight rows + comparison table (xl)', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const insights = page.locator('[data-section-type="analysis"]').first().locator('h3', { hasText: 'Główne wnioski' }).first();
  await insights.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/insights-rows-xl.png',
    fullPage: false,
    animations: 'disabled',
  });

  const table = page.locator('[data-section-type="analysis"]').first().locator('h3', { hasText: 'Porównanie z konkurencją' }).first();
  await table.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/comparison-table-xl.png',
    fullPage: false,
    animations: 'disabled',
  });
});
