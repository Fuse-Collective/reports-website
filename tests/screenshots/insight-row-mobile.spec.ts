import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('InsightRow mobile — pill on left, spans both rows', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const firstInsight = page.locator('[data-section-type="analysis"]').first().locator('h3:has-text("AI zamiast surowych danych")').locator('..');
  await firstInsight.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await firstInsight.screenshot({
    path: 'tests/__results__/insight-row-mobile.png',
    animations: 'disabled',
  });

  const geometry = await firstInsight.evaluate((row) => {
    const h3 = row.querySelector('h3') as HTMLElement;
    const pill = row.querySelector('span[aria-hidden="true"]') as HTMLElement;
    const p = row.querySelector('p') as HTMLElement;
    const rRect = row.getBoundingClientRect();
    const hRect = h3.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const pRect = p.getBoundingClientRect();
    return {
      pillVisible: getComputedStyle(pill).display !== 'none',
      pillLeftOfHeading: pillRect.right <= hRect.left + 2,
      headingAboveDescription: hRect.bottom <= pRect.top + 2,
      pillAlignedToTop: Math.abs(pillRect.top - hRect.top) < 40,
      rowWidth: rRect.width,
    };
  });

  expect(geometry.pillVisible).toBe(true);
  expect(geometry.pillLeftOfHeading).toBe(true);
  expect(geometry.headingAboveDescription).toBe(true);
  expect(geometry.pillAlignedToTop).toBe(true);
});

test('InsightRow desktop — pill in middle column (unchanged)', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const firstInsight = page.locator('[data-section-type="analysis"]').first().locator('h3:has-text("AI zamiast surowych danych")').locator('..');
  await firstInsight.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const geometry = await firstInsight.evaluate((row) => {
    const h3 = row.querySelector('h3') as HTMLElement;
    const pill = row.querySelector('span[aria-hidden="true"]') as HTMLElement;
    const p = row.querySelector('p') as HTMLElement;
    return {
      headingLeftOfPill: h3.getBoundingClientRect().right <= pill.getBoundingClientRect().left + 2,
      pillLeftOfDescription: pill.getBoundingClientRect().right <= p.getBoundingClientRect().left + 2,
    };
  });

  expect(geometry.headingLeftOfPill).toBe(true);
  expect(geometry.pillLeftOfDescription).toBe(true);
});
