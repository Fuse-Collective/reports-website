import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('Constellation header mobile — icon above heading', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const firstSection = page.locator('[data-section-type="constellation"]').first();
  await firstSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const geom = await firstSection.evaluate((sec) => {
    const header = sec.querySelector('h2')?.parentElement as HTMLElement;
    const svg = header.querySelector('svg') as SVGElement;
    const h2 = header.querySelector('h2') as HTMLElement;
    const svgRect = svg.getBoundingClientRect();
    const h2Rect = h2.getBoundingClientRect();
    return {
      iconAboveHeading: svgRect.bottom <= h2Rect.top + 2,
    };
  });

  expect(geom.iconAboveHeading).toBe(true);

  await firstSection.screenshot({
    path: 'tests/__results__/constellation-header-mobile.png',
    animations: 'disabled',
  });
});

test('Constellation header desktop — icon left of heading', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const firstSection = page.locator('[data-section-type="constellation"]').first();
  await firstSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const geom = await firstSection.evaluate((sec) => {
    const header = sec.querySelector('h2')?.parentElement as HTMLElement;
    const svg = header.querySelector('svg') as SVGElement;
    const h2 = header.querySelector('h2') as HTMLElement;
    return {
      iconLeftOfHeading: svg.getBoundingClientRect().right <= h2.getBoundingClientRect().left + 2,
    };
  });

  expect(geom.iconLeftOfHeading).toBe(true);
});
