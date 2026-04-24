import { test } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('diag — desktop scope2 menu + screenshots', async ({ page }) => {
  mkdirSync('tests/__results__', { recursive: true });
  await page.setViewportSize({ width: 1536, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const snapshot = async (label: string, filename: string) => {
    const data = await page.evaluate(() => {
      const scopes = Array.from(document.querySelectorAll('[data-menu-scope]'));
      const scope2 = scopes[2] as HTMLElement | undefined; // 3rd = dark+constellations
      const aside = scope2?.querySelector('aside') as HTMLElement | undefined;
      const menuInner = aside?.querySelector(':scope > div') as HTMLElement | undefined;
      return {
        scrollY: window.scrollY,
        docHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scopeCount: scopes.length,
        scope2: scope2 ? { top: scope2.getBoundingClientRect().top, bottom: scope2.getBoundingClientRect().bottom, height: scope2.getBoundingClientRect().height } : null,
        aside: aside ? { top: aside.getBoundingClientRect().top, bottom: aside.getBoundingClientRect().bottom, height: aside.getBoundingClientRect().height } : null,
        menuInner: menuInner ? { top: menuInner.getBoundingClientRect().top, bottom: menuInner.getBoundingClientRect().bottom } : null,
        s9Top: document.getElementById('ocena-strategiczna')?.getBoundingClientRect().top,
        c05Bottom: document.getElementById('constellation-05')?.getBoundingClientRect().bottom,
      };
    });
    console.log(label, JSON.stringify(data));
    await page.screenshot({ path: `tests/__results__/${filename}`, animations: 'disabled' });
  };

  // Scroll to near bottom of C05 (menu should still be visible)
  await page.evaluate(() => {
    const el = document.getElementById('constellation-05');
    const rect = el!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.bottom - window.innerHeight);
  });
  await page.waitForTimeout(300);
  await snapshot('near C05 bottom', 'diag-near-c05-bottom.png');

  // Scroll so S9 is at top of viewport
  await page.evaluate(() => {
    const el = document.getElementById('ocena-strategiczna');
    const rect = el!.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top);
  });
  await page.waitForTimeout(300);
  await snapshot('at S9 top', 'diag-at-s9-top.png');

  // Scroll to absolute bottom
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  await snapshot('document bottom', 'diag-bottom.png');
});
