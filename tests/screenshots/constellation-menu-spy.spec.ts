import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('constellation menu — scroll-spy highlighting', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  // Scroll into C03 mid
  const c3 = page.locator('[data-section-type="constellation"][data-constellation-number="03"]');
  await c3.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'tests/__results__/constellation-menu-c03.png',
    animations: 'disabled',
    clip: { x: 1080, y: 50, width: 456, height: 600 },
  });
});
