import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('area 04 — Demokratyzacja, one risk card', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1600 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const a4 = page.locator('[data-section-type="analysis"][data-analysis-number="04"]');
  await a4.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await a4.screenshot({
    path: 'tests/__results__/area-04-full.png',
    animations: 'disabled',
  });
});
