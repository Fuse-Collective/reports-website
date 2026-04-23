import { test } from '@playwright/test';

test('design-system preview — OverviewSection composition', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4325/design-system/sections/');
  await page.waitForLoadState('networkidle');

  const hero = page.locator('[data-section-type="overview-hero"]');
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const heroBox = await hero.boundingBox();
  if (heroBox) {
    await page.screenshot({
      path: 'tests/__results__/overview-preview-composition.png',
      clip: { x: 0, y: Math.max(0, heroBox.y - 20), width: 1920, height: 1060 },
    });
  }
});
