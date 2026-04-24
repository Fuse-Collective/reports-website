import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('area 03 — DNA firmy, no comparison table', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1400 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const a3 = page.locator('[data-section-type="analysis"][data-analysis-number="03"]');
  await a3.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await a3.screenshot({
    path: 'tests/__results__/area-03-full.png',
    animations: 'disabled',
  });
});
