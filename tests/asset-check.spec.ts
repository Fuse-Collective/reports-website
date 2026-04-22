import { test, expect } from '@playwright/test';

/**
 * Asset Check — catches 404s on asset paths + runtime console errors.
 *
 * Per `references/browser-verification.md § Asset Check`:
 *   - notFound[]: 404 responses on /images/, /icons/, /fonts/, src/assets/
 *   - errors[]:   console errors + page errors (TypeErrors, uncaught exceptions)
 *   - Exit 1 if either array is non-empty
 *
 * Pages to check: comma-separated list via ASSET_CHECK_PATHS env var.
 *   Default: the report page.
 *
 * Base URL: PREVIEW_BASE_URL env var. Default: http://localhost:4321.
 *   Override at runtime when dev server runs on a non-standard port, e.g.
 *   PREVIEW_BASE_URL=http://localhost:4325 npx playwright test asset-check.spec.ts
 */

const BASE = process.env.PREVIEW_BASE_URL ?? 'http://localhost:4321';
const PATHS = (process.env.ASSET_CHECK_PATHS ?? '/badanie-przewag-brand24')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const ASSET_URL_RE = /\/images\/|\/icons\/|\/fonts\/|\/assets\//;

test('asset integrity — 404s and console errors', async ({ page }) => {
  const notFound: Array<{ url: string; page: string }> = [];
  const errors: Array<{ message: string; page: string }> = [];

  page.on('response', (res) => {
    if (res.status() === 404 && ASSET_URL_RE.test(res.url())) {
      notFound.push({ url: res.url(), page: page.url() });
    }
  });

  page.on('pageerror', (err) => {
    errors.push({ message: err.message, page: page.url() });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push({ message: msg.text(), page: page.url() });
    }
  });

  for (const path of PATHS) {
    await page.goto(`${BASE}${path}`);
    await page.waitForLoadState('networkidle');
  }

  const summary = { notFound, errors };
  console.log(JSON.stringify(summary, null, 2));

  expect.soft(notFound.length, `no 404s on asset paths (got ${notFound.length})`).toBe(0);
  expect.soft(errors.length, `no console errors (got ${errors.length})`).toBe(0);
});
