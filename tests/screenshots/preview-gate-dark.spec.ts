import { test } from '@playwright/test';

const URL = 'http://localhost:4321/badanie-przewag-brand24';

test.describe('Preview-gate dark surface', () => {
  test('desktop — full preview-gate section in context', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    const hero = page.locator('section#gate');
    await hero.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const heroBox = await hero.boundingBox();
    if (heroBox) {
      await page.screenshot({
        path: 'tests/__results__/preview-gate-dark-desktop.png',
        clip: {
          x: 0,
          y: Math.max(0, heroBox.y - 80),
          width: 1920,
          height: 1300,
        },
      });
    }
  });

  test('mobile — preview-gate section', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    const hero = page.locator('section#gate');
    await hero.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'tests/__results__/preview-gate-dark-mobile.png',
      fullPage: false,
    });
  });
});
