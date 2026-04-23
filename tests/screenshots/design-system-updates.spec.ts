import { test } from '@playwright/test';

const BASE = 'http://localhost:4325';

test.describe('Design system — new tiles (session 2026-04-22)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('components — new report blocks (2.8–2.11)', async ({ page }) => {
    await page.goto(`${BASE}/design-system/components/`);
    await page.waitForLoadState('networkidle');

    for (const id of ['analysis-header', 'insight-row', 'risk-card', 'report-areas-menu']) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await el.screenshot({ path: `tests/__results__/components-${id}.png` });
    }
  });

  test('sections — new sections (cover, chapter, overview, analysis)', async ({ page }) => {
    await page.goto(`${BASE}/design-system/sections/`);
    await page.waitForLoadState('networkidle');

    // Scroll through the page to capture each new section
    const sectionSelectors = [
      { name: 'report-cover', selector: '[data-section-type="report-cover"]' },
      { name: 'chapter-title', selector: '[data-section-type="chapter-title"]' },
      { name: 'overview', selector: '[data-section-type="overview"]' },
      { name: 'analysis', selector: '[data-section-type="analysis"]' },
    ];

    for (const { name, selector } of sectionSelectors) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await section.screenshot({ path: `tests/__results__/sections-${name}.png` });
    }
  });

  test('report-areas-menu — scroll-spy dual variant proof', async ({ page }) => {
    await page.goto(`${BASE}/design-system/components/#report-areas-menu`);
    await page.waitForLoadState('networkidle');

    const tile = page.locator('#report-areas-menu');
    await tile.scrollIntoViewIfNeeded();

    // Default state — nothing active
    await tile.screenshot({ path: 'tests/__results__/menu-default-none-active.png' });

    // Click area 02
    await tile.locator('[data-dim="current"][data-value="02"]').click();
    await page.waitForTimeout(150);
    await tile.screenshot({ path: 'tests/__results__/menu-area-02-active.png' });

    // Click area 05
    await tile.locator('[data-dim="current"][data-value="05"]').click();
    await page.waitForTimeout(150);
    await tile.screenshot({ path: 'tests/__results__/menu-area-05-active.png' });
  });
});
