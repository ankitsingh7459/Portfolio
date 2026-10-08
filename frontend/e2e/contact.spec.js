import { test, expect } from '@playwright/test';

test.describe('Contact Form Workflow (Mocked API)', () => {
  test('validates form inputs client-side before submission', async ({ page }) => {
    await page.goto('/');

    const submitBtn = page.getByRole('button', { name: /send message/i });
    await submitBtn.scrollIntoViewIfNeeded();

    // Click submit empty
    await submitBtn.click();

    // Validation messages appear
    await expect(page.locator('#contact-name-error')).toBeVisible();
    await expect(page.locator('#contact-email-error')).toBeVisible();
    await expect(page.locator('#contact-message-error')).toBeVisible();
  });

  test('successfully submits contact form when API responds 201 (mocked)', async ({ page }) => {
    // Intercept contact submission to ensure no real message is ever sent
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully!' }),
      });
    });

    await page.goto('/');

    const nameInput = page.locator('#contact-name');
    const emailInput = page.locator('#contact-email');
    const messageInput = page.locator('#contact-message');
    const submitBtn = page.getByRole('button', { name: /send message/i });

    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.fill('Test Reviewer');
    await emailInput.fill('reviewer@example.com');
    await messageInput.fill('This is an automated E2E test message verifying contact flow.');

    await submitBtn.click();

    // Terminal status success message
    await expect(page.getByText(/message sent/i)).toBeVisible();
  });

  test('handles 429 rate limiting gracefully (mocked)', async ({ page }) => {
    await page.route('**/api/contact', (route) => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Too many contact submissions. Try again in an hour.' }),
      });
    });

    await page.goto('/');

    const nameInput = page.locator('#contact-name');
    const emailInput = page.locator('#contact-email');
    const messageInput = page.locator('#contact-message');
    const submitBtn = page.getByRole('button', { name: /send message/i });

    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.fill('Test Reviewer');
    await emailInput.fill('reviewer@example.com');
    await messageInput.fill('Testing rate limit response handling in contact form.');

    await submitBtn.click();

    // Terminal status 429 message
    await expect(page.getByText(/too many messages/i)).toBeVisible();
  });
});
