import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('Overview anchors — ids present', async ({ page }) => {
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#overview-areas')).toHaveCount(1);
  await expect(page.locator('#overview-constellations')).toHaveCount(1);
});

test('Main pill headers — "6 obszarów", "Konstelacje", "Ocena" all link to overviews', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  await expect(page.locator('a[href="#overview-areas"]').first()).toHaveCount(1);
  await expect(page.locator('a[href="#overview-constellations"]').first()).toHaveCount(1);
  await expect(page.locator('a[href="#ocena-strategiczna"]').first()).toHaveCount(1);
});

test('Main pill clicks — Konstelacje jumps to overview-constellations', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  await page.locator('a[href="#overview-constellations"]').first().click();
  await page.waitForTimeout(400);

  expect(page.url()).toContain('#overview-constellations');
  const top = await page.locator('#overview-constellations').evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThan(-50);
  expect(top).toBeLessThan(80);
});

test('Main pill clicks — 6 obszarów jumps to overview-areas', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${BASE}${SLUG}#analysis-04`);
  await page.waitForLoadState('networkidle');

  await page.locator('a[href="#overview-areas"]').first().click();
  await page.waitForTimeout(400);

  expect(page.url()).toContain('#overview-areas');
  const top = await page.locator('#overview-areas').evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThan(-50);
  expect(top).toBeLessThan(80);
});
