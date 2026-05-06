import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4321';
const SLUG = '/badanie-przewag-brand24';

const sectionSelector = '[data-section-type="offer-cards"]';

test('offer-cards — desktop', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await section.screenshot({
    path: 'tests/__results__/offer-cards-desktop.png',
    animations: 'disabled',
  });
});

test('offer-cards — desktop full width 1920', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1920, height: 1800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await section.screenshot({
    path: 'tests/__results__/offer-cards-desktop-1920.png',
    animations: 'disabled',
  });
});

test('offer-cards — mobile', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 375, height: 1800 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await section.screenshot({
    path: 'tests/__results__/offer-cards-mobile.png',
    animations: 'disabled',
  });
});
