import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

async function locateGrid(page: import('@playwright/test').Page) {
  return page.locator('h2:has-text("Meaningfully different")').locator('..').locator('..').locator('div').filter({ has: page.locator('text=/^5x$/') }).first();
}

test('StatsGrid mobile (375) — 1 column', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const grid = await locateGrid(page);
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const rows = await grid.evaluate((el) => {
    const items = Array.from(el.children) as HTMLElement[];
    const tops = new Set(items.map(i => Math.round(i.getBoundingClientRect().top)));
    return tops.size;
  });
  expect(rows).toBe(3);

  await grid.screenshot({ path: 'tests/__results__/stats-grid-375.png', animations: 'disabled' });
});

test('StatsGrid tablet (800) — 2 columns', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const grid = await locateGrid(page);
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const layout = await grid.evaluate((el) => {
    const items = Array.from(el.children) as HTMLElement[];
    const rows = new Map<number, number>();
    items.forEach(i => {
      const top = Math.round(i.getBoundingClientRect().top);
      rows.set(top, (rows.get(top) ?? 0) + 1);
    });
    return { rowCount: rows.size, perRow: Array.from(rows.values()) };
  });
  expect(layout.rowCount).toBe(2);
  expect(layout.perRow).toEqual([2, 1]);

  await grid.screenshot({ path: 'tests/__results__/stats-grid-800.png', animations: 'disabled' });
});

test('StatsGrid desktop (1536) — 1 row, 3 across', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const grid = await locateGrid(page);
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const layout = await grid.evaluate((el) => {
    const items = Array.from(el.children) as HTMLElement[];
    const tops = new Set(items.map(i => Math.round(i.getBoundingClientRect().top)));
    return tops.size;
  });
  expect(layout).toBe(1);

  await grid.screenshot({ path: 'tests/__results__/stats-grid-1536.png', animations: 'disabled' });
});
