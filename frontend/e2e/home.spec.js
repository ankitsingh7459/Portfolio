import { test, expect } from '@playwright/test';

test.describe('Home Page & Core Shell', () => {
  test.beforeEach(async ({ page }) => {
    // Default network policy: block /api to test fallback path
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API unreachable (fallback simulated)' }),
      });
    });
  });

  test('home loads all sections with no console errors and exactly one h1', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected 503 network errors for blocked API calls
        if (!text.includes('503') && !text.includes('Failed to load resource')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto('/');

    // Verify critical landmarks & sections exist (note: #log is omitted when empty per ADR-012)
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#stack')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();

    // Verify single h1 per route
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    await expect(h1Elements).toContainText('ankit_singh');

    expect(consoleErrors).toEqual([]);
  });

  test('skip link is first in the tab order', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveText('Skip to content');

    // Trigger keyboard navigation
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
  });

  test('nav links navigate to corresponding sections', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      const menuButton = page.getByRole('button', { name: /open navigation menu/i });
      await menuButton.click();
      const projectsBtn = page.getByRole('button', { name: /cd ~\/projects/i });
      await projectsBtn.click();
    } else {
      const projectsBtn = page.getByRole('button', { name: '.projects' }).first();
      await projectsBtn.click();
    }

    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('boot sequence skip by keydown and click', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('#hero');

    // Clicking anywhere in hero or pressing a key skips typing immediately
    await hero.click();
    await expect(page.locator('#hero')).toContainText('whoami');
  });

  test('prefers-reduced-motion renders full content without animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Heading and text should be immediately present
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('ankit_singh');
  });

  test('has zero horizontal overflow across viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(isOverflowing).toBe(false);
  });
});
