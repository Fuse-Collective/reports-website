import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('analysis sections — alternating light/muted surface', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1400 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const a1 = page.locator('[data-section-type="analysis"][data-analysis-number="01"]');
  const a2 = page.locator('[data-section-type="analysis"][data-analysis-number="02"]');

  await a1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await a1.screenshot({
    path: 'tests/__results__/area-01-light.png',
    animations: 'disabled',
  });

  await a2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await a2.screenshot({
    path: 'tests/__results__/area-02-muted.png',
    animations: 'disabled',
  });

  const boundaryY = await a2.evaluate((el) => el.getBoundingClientRect().top);
  await page.evaluate((y) => window.scrollBy(0, y - 120), boundaryY);
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/area-01-02-boundary.png',
    animations: 'disabled',
    clip: { x: 0, y: 0, width: 1536, height: 900 },
  });
});
