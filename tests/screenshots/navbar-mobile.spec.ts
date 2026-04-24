import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('NavBar mobile — panel hidden on load, H1 clears nav', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  await expect(page.locator('[data-nav-panel]')).toBeHidden();
  await expect(page.locator('[data-nav-toggle]')).toHaveAttribute('aria-expanded', 'false');

  const navBottom = await page.locator('nav[data-section-type="nav-bar"] > div > div').first().evaluate(
    (el) => el.getBoundingClientRect().bottom
  );
  const h1Top = await page.locator('h1').first().evaluate((el) => el.getBoundingClientRect().top);
  expect(h1Top).toBeGreaterThan(navBottom);

  await page.screenshot({
    path: 'tests/__results__/navbar-mobile-closed.png',
    clip: { x: 0, y: 0, width: 375, height: 280 },
    animations: 'disabled',
  });
});

test('NavBar mobile — toggle opens panel, icon swaps to close', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const toggle = page.locator('[data-nav-toggle]');
  await toggle.click();
  await page.waitForTimeout(100);

  const panel = page.locator('[data-nav-panel]');
  await expect(panel).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Zamknij menu');

  // Menu icon hidden, close icon visible
  const iconState = await page.evaluate(() => {
    const t = document.querySelector('[data-nav-toggle]');
    if (!t) return null;
    const svgs = t.querySelectorAll('svg');
    return Array.from(svgs).map((s) => ({
      icon: s.getAttribute('data-icon'),
      display: getComputedStyle(s).display,
    }));
  });
  expect(iconState?.find((i) => i.icon === 'menu')?.display).toBe('none');
  expect(iconState?.find((i) => i.icon === 'close')?.display).not.toBe('none');

  // Panel not full-screen — it's below the nav bar and content-max wide
  const geom = await page.evaluate(() => {
    const p = document.querySelector('[data-nav-panel]') as HTMLElement;
    const rect = p.getBoundingClientRect();
    return { top: rect.top, height: rect.height, left: rect.left, width: rect.width };
  });
  expect(geom.top).toBeGreaterThanOrEqual(110); // below h-monumental (112px)
  expect(geom.height).toBeLessThan(800); // not full viewport

  // All 6 nav links visible
  const linkCount = await panel.locator('a').count();
  expect(linkCount).toBe(6);

  await page.screenshot({
    path: 'tests/__results__/navbar-mobile-open.png',
    clip: { x: 0, y: 0, width: 375, height: 600 },
    animations: 'disabled',
  });
});

test('NavBar mobile — second click closes panel', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const toggle = page.locator('[data-nav-toggle]');
  await toggle.click();
  await page.waitForTimeout(100);
  await expect(page.locator('[data-nav-panel]')).toBeVisible();

  await toggle.click();
  await page.waitForTimeout(100);
  await expect(page.locator('[data-nav-panel]')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('NavBar mobile — Escape closes panel', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  await page.locator('[data-nav-toggle]').click();
  await page.waitForTimeout(100);
  await expect(page.locator('[data-nav-panel]')).toBeVisible();

  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  await expect(page.locator('[data-nav-panel]')).toBeHidden();
});

test('NavBar desktop — inline links, no mobile panel', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  // Desktop inline list visible
  await expect(page.locator('nav[data-section-type="nav-bar"] ul').first()).toBeVisible();
  // Mobile toggle hidden at lg+
  const toggleVisible = await page.locator('[data-nav-toggle]').evaluate(
    (el) => getComputedStyle(el as HTMLElement).display !== 'none'
  );
  expect(toggleVisible).toBe(false);
});
