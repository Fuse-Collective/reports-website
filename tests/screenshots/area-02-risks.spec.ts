import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('area 02 — risks grid with Kompromisy bullet list', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const area = page.locator('[data-section-type="analysis"][data-analysis-number="02"]');
  await area.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await area.screenshot({
    path: 'tests/__results__/area-02-full.png',
    animations: 'disabled',
  });

  const risks = area.locator('.grid.lg\\:grid-cols-2').last();
  await risks.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await risks.screenshot({
    path: 'tests/__results__/area-02-risks.png',
    animations: 'disabled',
  });
});
