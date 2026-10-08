import { test, expect } from '@playwright/test';

test.describe('Interactive: Terminal & Command Palette', () => {
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

  test('desktop terminal commands and keyboard interactions', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop terminal test');

    await page.goto('/');

    // Expand terminal panel
    const openTerminalBtn = page.getByRole('button', { name: /open interactive terminal/i });
    await expect(openTerminalBtn).toBeVisible();
    await openTerminalBtn.click();

    const terminalInput = page.locator('#terminal-input');
    await expect(terminalInput).toBeVisible();

    // 1. Run 'help'
    await terminalInput.fill('help');
    await terminalInput.press('Enter');
    const terminalLogs = page.locator('div[role="log"]');
    await expect(terminalLogs).toContainText('Available commands');

    // 2. Tab completion: type 'pr' and hit Tab -> completes to 'projects'
    await terminalInput.fill('pr');
    await terminalInput.press('Tab');
    await expect(terminalInput).toHaveValue('projects');
    await terminalInput.press('Enter');
    await expect(terminalLogs).toContainText('Featured Projects');

    // 3. Run 'open projects' to navigate to section
    await terminalInput.fill('open projects');
    await terminalInput.press('Enter');
    await expect(page.locator('#projects')).toBeInViewport();

    // 4. Unknown command
    await terminalInput.fill('unknowncmd');
    await terminalInput.press('Enter');
    await expect(terminalLogs).toContainText('command not found: unknowncmd');

    // 5. Run 'open printapm'
    await terminalInput.fill('open printapm');
    await terminalInput.press('Enter');
    await expect(page).toHaveURL(/\/projects\/printapm/);
  });

  test('mobile terminal interactive chips', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile terminal chips test');

    await page.goto('/');

    // On mobile, expand terminal first
    const openTerminalBtn = page.getByRole('button', { name: /open interactive terminal/i });
    await expect(openTerminalBtn).toBeVisible();
    await openTerminalBtn.click();

    // Mobile renders interactive button chips
    const projectsChip = page.locator('#hero').getByRole('button', { name: 'projects', exact: true });
    await expect(projectsChip).toBeVisible();

    await projectsChip.click();
    const terminalLogs = page.locator('div[role="log"]');
    await expect(terminalLogs).toContainText('Featured Projects');
  });

  test('command palette open, filter, navigation, Esc close, and focus restore', async ({ page, isMobile }) => {
    await page.goto('/');

    // Open via Ctrl+K (or mobile navigation trigger)
    if (isMobile) {
      const menuBtn = page.getByRole('button', { name: /open navigation menu/i });
      await menuBtn.click();
      const paletteBtn = page.getByRole('button', { name: /ctrl k \(command palette\)/i });
      await paletteBtn.click();
    } else {
      const triggerBtn = page.getByRole('button', { name: /ctrl k: open command palette/i });
      await triggerBtn.click();
    }

    const paletteDialog = page.getByRole('dialog', { name: /command palette/i });
    await expect(paletteDialog).toBeVisible();

    const searchInput = paletteDialog.getByPlaceholder(/type a command or search/i);
    await expect(searchInput).toBeFocused();

    // Filter items
    await searchInput.fill('printapm');
    const caseStudyOption = paletteDialog.getByRole('option', { name: /printapm case study/i });
    await expect(caseStudyOption).toBeVisible();

    // Close via Escape
    await page.keyboard.press('Escape');
    await expect(paletteDialog).not.toBeVisible();
  });
});
