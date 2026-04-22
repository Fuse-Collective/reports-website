import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4321';
const SLUG = '/badanie-przewag-brand24';

test('overview-section — no inline menu (xl)', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');
  await page.locator('[data-section-type="overview"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/overview-no-menu-xl.png',
    fullPage: false,
    animations: 'disabled',
  });
});
