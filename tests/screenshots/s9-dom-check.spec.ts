import { test, expect } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';
const SLUG = '/badanie-przewag-brand24';

test('S9 DOM — icons, body, headline, 3 cards', async ({ page }) => {
  await page.goto(`${BASE}${SLUG}`);
  await page.waitForLoadState('networkidle');

  const data = await page.evaluate(() => {
    const all = document.querySelectorAll('[data-section-type="services"]');
    const s9 = all[all.length - 1] as HTMLElement;
    if (!s9) return null;
    const h2 = s9.querySelector('h2')?.textContent?.trim() ?? null;
    const bodyP = s9.querySelector('p')?.textContent?.trim() ?? null;
    const h3s = Array.from(s9.querySelectorAll('h3')).map(h => h.textContent?.trim() ?? '');
    const svgs = Array.from(s9.querySelectorAll('svg')).map(s => ({
      w: s.getAttribute('width'),
      viewBox: s.getAttribute('viewBox'),
    }));
    const numberedSpans = Array.from(s9.querySelectorAll('span'))
      .map(s => s.textContent?.trim() ?? '')
      .filter(t => /^\d{2}$/.test(t));
    return { h2, bodyP, h3s, svgCount: svgs.length, svgs, numberedSpans };
  });

  console.log('S9 DOM:', JSON.stringify(data, null, 2));
  expect(data?.h2).toContain('Brand24 robi rzeczy');
  expect(data?.bodyP).toContain('Ten jeden mianownik');
  expect(data?.h3s).toEqual([
    'Najsilniejsza przewaga',
    'Największy potencjał',
    'Największe ryzyko',
  ]);
  expect(data?.svgCount).toBeGreaterThanOrEqual(3);
  expect(data?.numberedSpans).toEqual([]);
});
