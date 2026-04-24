import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('S9 renders OUTSIDE data-menu-scope', async ({ page }) => {
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const inScope = await page.locator('#ocena-strategiczna').evaluate((el) => {
    return !!el.closest('[data-menu-scope]');
  });
  expect(inScope).toBe(false);
});

test('C05 (last constellation) still INSIDE menu scope', async ({ page }) => {
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const inScope = await page.locator('#constellation-05').evaluate((el) => {
    return !!el.closest('[data-menu-scope]');
  });
  expect(inScope).toBe(true);
});

test('Mobile trigger hides when scrolled into S9', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  // Scroll past primary overview — trigger should appear
  await page.waitForTimeout(300); // let initial IO settle
  await page.evaluate(() => {
    const el = document.getElementById('analysis-03');
    const rect = el!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top);
  });
  await page.waitForTimeout(1500);
  const stateAtAnalysis = await page.evaluate(() => {
    const el = document.querySelector('[data-sidenav-trigger]') as HTMLElement;
    return { opacity: getComputedStyle(el).opacity, classes: el.className, debug: (window as any).__sidenav_debug, scrollY: window.scrollY };
  });
  console.log('at analysis-03:', JSON.stringify(stateAtAnalysis));
  expect(parseFloat(stateAtAnalysis.opacity)).toBeGreaterThan(0.5);

  // Scroll so the closing section intersects viewport → trigger should hide
  await page.evaluate(() => {
    const el = document.getElementById('ocena-strategiczna');
    const rect = el!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top);
  });
  await page.waitForTimeout(1500);
  const stateAtS9 = await page.evaluate(() => {
    const el = document.querySelector('[data-sidenav-trigger]') as HTMLElement;
    return { opacity: getComputedStyle(el).opacity, classes: el.className };
  });
  console.log('at ocena-strategiczna:', JSON.stringify(stateAtS9));
  expect(parseFloat(stateAtS9.opacity)).toBeLessThan(0.5);
});
