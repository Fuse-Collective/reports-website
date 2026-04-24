import { test, expect } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('S9 strategic assessment — on page', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 1400 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const allServices = page.locator('[data-section-type="services"]');
  const count = await allServices.count();
  expect(count).toBeGreaterThanOrEqual(2);

  const s9 = allServices.last();
  await s9.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await s9.screenshot({
    path: 'tests/__results__/s9-strategic-assessment.png',
    animations: 'disabled',
  });
});
