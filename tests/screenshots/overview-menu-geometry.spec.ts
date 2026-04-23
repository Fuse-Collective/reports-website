import { test } from '@playwright/test';

const BASE = 'http://localhost:4325';

test('live page — Overview split (hero + insight) with menu at xl', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE}/badanie-przewag-brand24`);
  await page.waitForLoadState('networkidle');

  const hero = page.locator('[data-section-type="overview-hero"]');
  const insight = page.locator('[data-section-type="overview-insight"]');

  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // Viewport screenshot that includes hero + insight together — proves the
  // menu starts BELOW the hero, not on top of the headline row.
  const heroBox = await hero.boundingBox();
  if (heroBox) {
    await page.screenshot({
      path: 'tests/__results__/overview-fix-hero-plus-insight.png',
      clip: { x: 0, y: Math.max(0, heroBox.y - 20), width: 1920, height: 1080 },
    });
  }

  // Individual captures for each half.
  await hero.screenshot({ path: 'tests/__results__/overview-fix-hero-only.png' });
  await insight.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await insight.screenshot({ path: 'tests/__results__/overview-fix-insight-only.png' });
});
