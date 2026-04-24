import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

async function scrollPastOverview(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const el = document.getElementById('analysis-03');
    const rect = el!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top);
  });
  await page.waitForTimeout(500);
}

test('Chapter menu — trigger appears past overview, label stays', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');
  await scrollPastOverview(page);

  const root = page.locator('[data-sidenav-root]');
  const trigger = page.locator('[data-sidenav-trigger]');
  await expect(root).toHaveCSS('opacity', '1');
  await expect(trigger).toContainText('Spis treści'); // label kept
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await page.screenshot({
    path: 'tests/__results__/chapter-menu-closed.png',
    clip: { x: 0, y: 500, width: 375, height: 300 },
    animations: 'disabled',
  });
});

test('Chapter menu — click opens popover, label stays, icon swaps', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');
  await scrollPastOverview(page);

  const trigger = page.locator('[data-sidenav-trigger]');
  await trigger.click({ force: true });
  await page.waitForTimeout(150);

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-sidenav-panel]')).toBeVisible();
  await expect(trigger).toContainText('Spis treści'); // label unchanged when open

  // Icon swap — close visible, areas-indicator hidden
  const icons = await page.evaluate(() => {
    const t = document.querySelector('[data-sidenav-trigger]');
    return Array.from(t!.querySelectorAll('svg')).map((s) => ({
      icon: s.getAttribute('data-icon'),
      display: getComputedStyle(s).display,
    }));
  });
  expect(icons.find((i) => i.icon === 'areas-indicator')?.display).toBe('none');
  expect(icons.find((i) => i.icon === 'close')?.display).not.toBe('none');

  // Panel NOT full page width — ≤320px + padding
  const panelWidth = await page.locator('[data-sidenav-panel]').evaluate(
    (el) => el.getBoundingClientRect().width
  );
  expect(panelWidth).toBeLessThan(360);

  await page.screenshot({
    path: 'tests/__results__/chapter-menu-open.png',
    animations: 'disabled',
  });
});

test('Chapter menu — second click closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');
  await scrollPastOverview(page);

  // Dispatch direct click events to bypass astro-dev-toolbar overlay
  await page.evaluate(() => {
    const t = document.querySelector('[data-sidenav-trigger]') as HTMLButtonElement;
    t.click();
  });
  await page.waitForTimeout(150);
  await expect(page.locator('[data-sidenav-panel]')).toBeVisible();

  await page.evaluate(() => {
    const t = document.querySelector('[data-sidenav-trigger]') as HTMLButtonElement;
    t.click();
  });
  await page.waitForTimeout(150);
  await expect(page.locator('[data-sidenav-panel]')).toBeHidden();
  await expect(page.locator('[data-sidenav-trigger]')).toHaveAttribute('aria-expanded', 'false');
});

test('Main nav still uses full-screen black drawer (unchanged)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const navToggle = page.locator('[data-nav-toggle]');
  await navToggle.click();
  await page.waitForTimeout(150);

  const drawer = page.locator('[data-nav-drawer]');
  await expect(drawer).toBeVisible();

  // Full-screen: covers viewport
  const rect = await drawer.evaluate((el) => el.getBoundingClientRect());
  expect(rect.width).toBeGreaterThanOrEqual(375);
  expect(rect.height).toBeGreaterThanOrEqual(800);

  // ZAMKNIJ label present (reverted behavior)
  await expect(drawer.locator('text=ZAMKNIJ')).toBeVisible();
});
