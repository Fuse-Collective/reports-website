import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('analysis-menu layout — xl (inline), lg (drawer), mobile', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });

  // Navigate + wait for first load so we can capture section offsets.
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  // Scroll the first analysis section into view so the sticky menu is active.
  await page.locator('[data-section-type="analysis"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // xl viewport (1536px) — inline sticky menu visible as right column.
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.waitForTimeout(200);
  await page.locator('[data-section-type="analysis"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/analysis-menu-xl-1536.png',
    fullPage: false,
    animations: 'disabled',
  });

  // Wide desktop (1920px) — inline sticky menu, wider content column.
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(200);
  await page.locator('[data-section-type="analysis"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/analysis-menu-wide-1920.png',
    fullPage: false,
    animations: 'disabled',
  });

  // lg viewport (1200px) — below xl breakpoint, menu should NOT render inline;
  // drawer trigger handles TOC at this size.
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout(200);
  await page.locator('[data-section-type="analysis"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/analysis-menu-lg-1200.png',
    fullPage: false,
    animations: 'disabled',
  });

  // Mobile (375px) — drawer trigger visible bottom-right, no inline menu.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(200);
  await page.locator('[data-section-type="analysis"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'tests/__results__/analysis-menu-mobile-375.png',
    fullPage: false,
    animations: 'disabled',
  });
});
