import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('constellation 02 — AI intelligence', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 2200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const c2 = page.locator('[data-section-type="constellation"][data-constellation-number="02"]');
  await c2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await c2.screenshot({
    path: 'tests/__results__/constellation-02.png',
    animations: 'disabled',
  });
});
