import { test } from '@playwright/test';

const URL = 'http://localhost:4321/badanie-przewag-brand24';

test.describe('Phase 3 — UnlockModal', () => {
  test('desktop — closed and open states', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    // Scroll to the preview-gate so the CTA is visible
    const cta = page.locator('a[href="#unlock-modal"]').first();
    await cta.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'tests/__results__/unlock-modal-1-cta-visible.png',
      fullPage: false,
    });

    // Open the modal
    await cta.click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/__results__/unlock-modal-2-open-empty.png',
      fullPage: false,
    });

    // Fill the form
    await page.locator('input[name="email"]').fill('preview@example.com');
    await page.locator('input[name="firma"]').fill('Acme Industries');
    await page.locator('input[name="rodzajFirmy"][value="agency"]').check();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: 'tests/__results__/unlock-modal-3-filled.png',
      fullPage: false,
    });
  });

  test('mobile — closed and open states', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    const cta = page.locator('a[href="#unlock-modal"]').first();
    await cta.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'tests/__results__/unlock-modal-mobile-1-cta-visible.png',
      fullPage: false,
    });

    await cta.click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/__results__/unlock-modal-mobile-2-open-empty.png',
      fullPage: false,
    });
  });

  test('desktop — validation error visible', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(URL);
    await page.waitForLoadState('networkidle');

    const cta = page.locator('a[href="#unlock-modal"]').first();
    await cta.scrollIntoViewIfNeeded();
    await cta.click();
    await page.waitForTimeout(200);

    // Submit empty — server should reject; HTML5 will probably catch first.
    // Force an invalid email past HTML5 by filling a syntactically valid one
    // that fails server-side regex. We use one that PASSES our regex but
    // BYPASSES MailerLite — then a real subscribe error path. Easier: just
    // submit the form bypassing native validation.
    await page.evaluate(() => {
      const form = document.querySelector('[data-unlock-form]') as HTMLFormElement | null;
      if (!form) return;
      form.noValidate = true;
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
    });
    await page.waitForTimeout(400);

    await page.screenshot({
      path: 'tests/__results__/unlock-modal-4-validation-error.png',
      fullPage: false,
    });
  });
});
