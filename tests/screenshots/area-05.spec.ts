import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('area 05 — Kombinacje wartości', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1600 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const a5 = page.locator('[data-section-type="analysis"][data-analysis-number="05"]');
  await a5.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await a5.screenshot({
    path: 'tests/__results__/area-05-full.png',
    animations: 'disabled',
  });
});
