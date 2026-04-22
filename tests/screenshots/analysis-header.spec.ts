import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4321';
const SLUG = '/badanie-przewag-brand24';

test('analysis header — split title (lead bold + rest on new line)', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const header = page.locator('[data-section-type="analysis"]').first().locator('header').first();
  await header.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await header.screenshot({
    path: 'tests/__results__/analysis-header-xl.png',
    animations: 'disabled',
  });
});
