import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const axePath = path.resolve(__dirname, '../node_modules/axe-core/axe.min.js');

async function runAxeAudit(page) {
  await page.addScriptTag({ path: axePath });
  const results = await page.evaluate(async () => {
    // @ts-ignore
    const res = await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });
    return res.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  });
  return results;
}

test.describe('A11y Audit (axe-core) & Mobile Touch Targets', () => {
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

  test('zero critical or serious a11y violations on Home layout', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run axe desktop once for efficiency');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const violations = await runAxeAudit(page);
    expect(violations).toEqual([]);
  });

  test('zero critical or serious a11y violations on PrintAPM Case Study', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run axe desktop once for efficiency');

    await page.goto('/projects/printapm');
    await page.waitForLoadState('networkidle');

    const violations = await runAxeAudit(page);
    expect(violations).toEqual([]);
  });

  test('zero critical or serious a11y violations with Terminal expanded', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run axe desktop once for efficiency');

    await page.goto('/');
    const openTerminalBtn = page.getByRole('button', { name: /open interactive terminal/i });
    await openTerminalBtn.click();
    await expect(page.locator('#terminal-input')).toBeVisible();

    const violations = await runAxeAudit(page);
    expect(violations).toEqual([]);
  });

  test('zero critical or serious a11y violations with Command Palette open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Run axe desktop once for efficiency');

    await page.goto('/');
    const triggerBtn = page.getByRole('button', { name: /ctrl k: open command palette/i });
    await triggerBtn.click();
    await expect(page.getByRole('dialog', { name: /command palette/i })).toBeVisible();

    const violations = await runAxeAudit(page);
    expect(violations).toEqual([]);
  });

  test('mobile touch targets are >= 44x44 px', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Measure touch targets on mobile project');

    await page.goto('/');

    // Expand terminal on mobile to measure chips
    const openTerminalBtn = page.getByRole('button', { name: /open interactive terminal/i });
    await openTerminalBtn.click();

    const targets = [
      { name: 'Nav Toggle', locator: page.getByRole('button', { name: /open navigation menu/i }) },
      { name: 'Hero Primary CTA (./projects)', locator: page.locator('#hero').getByRole('button', { name: './projects' }) },
      { name: 'Hero Secondary CTA (resume)', locator: page.locator('#hero').getByRole('link', { name: /cat resume\.pdf/i }) },
      { name: 'Terminal Chip (projects)', locator: page.locator('#hero').getByRole('button', { name: 'projects', exact: true }) },
      { name: 'Terminal Chip (about)', locator: page.locator('#hero').getByRole('button', { name: 'about', exact: true }) },
      { name: 'Contact Submit Button', locator: page.getByRole('button', { name: /send message/i }) },
      { name: 'Resume Open Action', locator: page.locator('#resume').getByRole('link', { name: /^open/i }) },
      { name: 'Resume Download Action', locator: page.locator('#resume').getByRole('link', { name: /^download/i }) },
    ];

    const measurements = [];

    for (const target of targets) {
      await target.locator.scrollIntoViewIfNeeded();
      await expect(target.locator).toBeVisible();
      const box = await target.locator.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        measurements.push({
          element: target.name,
          widthPx: Math.round(box.width),
          heightPx: Math.round(box.height),
          targetOk: box.width >= 44 && box.height >= 44 ? 'PASS' : 'FAIL',
        });
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }

    console.log('\n--- Measured Mobile Touch Targets Table ---');
    console.table(measurements);
  });
});
