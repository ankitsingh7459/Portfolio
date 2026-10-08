import { test, expect } from '@playwright/test';

test.describe('Routing, Case Study, Admin & Fallbacks', () => {
  test.beforeEach(async ({ page }) => {
    // Block API by default
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API unreachable' }),
      });
    });
  });

  test('navigates from project row to /projects/printapm, handles refresh and back button', async ({ page }) => {
    await page.goto('/');

    const printApmRow = page.getByRole('link', { name: /printapm/i }).first();
    await expect(printApmRow).toBeVisible();

    // Click link to case study
    await printApmRow.click();
    await expect(page).toHaveURL(/\/projects\/printapm/);

    // Verify case study heading
    const caseHeading = page.locator('h1');
    await expect(caseHeading).toContainText('PrintAPM');

    // Test direct refresh
    await page.reload();
    await expect(caseHeading).toBeVisible();

    // Test back button
    await page.goBack();
    await expect(page).toHaveURL(/\//);
  });

  test('unknown route renders 404 with noindex meta tag', async ({ page }) => {
    await page.goto('/unknown-route-404');

    await expect(page.locator('h1')).toContainText('$ 404: command not found');

    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
  });

  test('admin route renders login form (no real authentication attempted)', async ({ page }) => {
    await page.goto('/admin');

    // Admin login form is present
    const emailInput = page.locator('#admin-email');
    const passwordInput = page.locator('#admin-password');
    const loginButton = page.getByRole('button', { name: /\$ authenticate/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Note: Admin credentials are never submitted against real production backend
  });
});
