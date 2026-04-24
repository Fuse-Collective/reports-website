import { test } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('diag — scroll & IO', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const snapshot = async (label: string) => {
    const data = await page.evaluate(() => ({
      scrollY: window.scrollY,
      debug: (window as any).__sidenav_debug,
      overviewTop: document.querySelector('[data-section-type="overview-hero"]')?.getBoundingClientRect().top,
    }));
    console.log(label, JSON.stringify(data));
  };

  await snapshot('initial');

  await page.evaluate(() => {
    document.getElementById('analysis-03')?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(800);
  await snapshot('after scrollIntoView analysis-03');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1000));
  await page.waitForTimeout(800);
  await snapshot('after scrollTo near bottom');
});
