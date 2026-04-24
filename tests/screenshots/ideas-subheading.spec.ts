import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('ideas subheading — Powered by star Fuse Foresight', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900, deviceScaleFactor: 2 } as any);
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const target = page.locator('a[href="#jak-powstaly-te-pomysly"]').first();
  const container = target.locator('xpath=ancestor::p').first();
  await container.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const box = await container.boundingBox();
  if (box) {
    await page.screenshot({
      path: 'tests/__results__/ideas-subheading.png',
      animations: 'disabled',
      clip: { x: box.x - 10, y: box.y - 10, width: Math.min(box.width + 20, 500), height: box.height + 20 },
    });
  }
});
