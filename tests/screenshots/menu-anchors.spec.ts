import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('Section anchors — ids present', async ({ page }) => {
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  for (const n of ['01', '02', '03', '04', '05', '06']) {
    await expect(page.locator(`#analysis-${n}`)).toHaveCount(1);
  }
  for (const n of ['01', '02', '03', '04', '05']) {
    await expect(page.locator(`#constellation-${n}`)).toHaveCount(1);
  }
  await expect(page.locator('#ocena-strategiczna')).toHaveCount(1);
});

test('Menu — area links point to analysis anchors', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>('li[data-area-number] a'))
      .map(a => ({ number: a.closest('li')?.getAttribute('data-area-number'), href: a.getAttribute('href') }))
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const { number, href } of hrefs) {
    expect(href).toBe(`#analysis-${number}`);
  }
});

test('Menu — clicking area jumps to section', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.emulateMedia({ reducedMotion: 'reduce' }); // disable smooth scroll
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const link = page.locator('li[data-area-number="03"] a').first();
  await link.click();
  await page.waitForTimeout(500);

  expect(page.url()).toContain('#analysis-03');

  // After anchor jump + scroll-mt-relaxed (32px), section top should be ~32px
  const sectionTop = await page.locator('#analysis-03').evaluate((el) => el.getBoundingClientRect().top);
  expect(sectionTop).toBeGreaterThan(-50);
  expect(sectionTop).toBeLessThan(80);
});

test('Menu — Ocena strategiczna pill links to S9', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}#preview-gate`);
  await page.waitForLoadState('networkidle');

  // At least one pill-header <a> with href to ocena-strategiczna
  const ocenaLink = page.locator('a[href="#ocena-strategiczna"]').first();
  await expect(ocenaLink).toHaveCount(1);
});

test('Menu — Konstelacje pill links to constellation-01', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1200 });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const konstLink = page.locator('a[href="#constellation-01"]').first();
  await expect(konstLink).toHaveCount(1);
});
