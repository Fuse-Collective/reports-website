import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('book icon in featured CTA — crop', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900, deviceScaleFactor: 2 } as any);
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const cta = page.locator('.bg-surface-accent a[href*="fusecollective"]').first();
  await cta.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await cta.boundingBox();
  if (box) {
    await page.screenshot({
      path: 'tests/__results__/book-icon-crop.png',
      animations: 'disabled',
      clip: { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: box.height + 20 },
    });
  }
});
