import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('areas-menu — current circle close-up (numeric centering)', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900, deviceScaleFactor: 2 } as any);
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  await page.locator('[data-section-type="analysis"][data-analysis-number="01"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const circle = page.locator('li[data-current="true"] .bg-surface-dark').first();
  await circle.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const box = await circle.boundingBox();

  if (box) {
    await page.screenshot({
      path: 'tests/__results__/areas-menu-circle-crop.png',
      animations: 'disabled',
      clip: {
        x: Math.max(0, box.x - 12),
        y: Math.max(0, box.y - 12),
        width: box.width + 24,
        height: box.height + 24,
      },
    });
  }
});
