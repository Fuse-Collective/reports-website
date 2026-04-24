import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('areas-menu — pill look across light/muted surfaces', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  // Area 01 (white section)
  await page.locator('[data-section-type="analysis"][data-analysis-number="01"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: 'tests/__results__/areas-menu-on-light.png',
    animations: 'disabled',
    clip: { x: 1080, y: 50, width: 456, height: 460 },
  });

  // Area 02 (muted section)
  await page.locator('[data-section-type="analysis"][data-analysis-number="02"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: 'tests/__results__/areas-menu-on-muted.png',
    animations: 'disabled',
    clip: { x: 1080, y: 50, width: 456, height: 460 },
  });
});
