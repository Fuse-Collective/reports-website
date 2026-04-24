import { test } from '@playwright/test';

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4325';

test('diag — capture page load + errors', async ({ page }) => {
  const logs: string[] = [];
  const errors: string[] = [];
  page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => errors.push(e.message));

  const resp = await page.goto(`${BASE}/badanie-przewag-brand24`);
  console.log('STATUS:', resp?.status());
  await page.waitForLoadState('networkidle').catch(() => {});

  const html = await page.content();
  console.log('HTML length:', html.length);
  console.log('HTML first 2000:', html.slice(0, 2000));
  console.log('ERRORS:', errors);
  console.log('LOGS:', logs.slice(0, 20));
});
