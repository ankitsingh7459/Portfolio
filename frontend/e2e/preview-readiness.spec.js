import { test, expect } from '@playwright/test';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { projects, github } from './fixtures/preview-api';

const evidence = path.resolve('playwright-report/preview');
test.beforeEach(async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  await page.route('**/api/**', route => {
    const pathname = new URL(route.request().url()).pathname;
    return route.fulfill({ json: pathname === '/api/projects' ? { data: projects }
      : pathname === '/api/analytics/github' ? { data: github } : { success: true } });
  });
});
async function audit(page, name) {
  await page.addScriptTag({ path: path.resolve('node_modules/axe-core/axe.min.js') });
  const result = await page.evaluate(() => window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  }));
  await mkdir(evidence, { recursive: true });
  await writeFile(path.join(evidence, `${name}-axe.json`), JSON.stringify(result, null, 2));
  expect(result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
}

test('mobile navigation accessibility, keyboard and touch targets', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-specific surface');
  await page.goto('/');
  const toggle = page.locator('header button[aria-label$="navigation menu"]');
  await toggle.focus();
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const nav = page.getByRole('dialog', { name: 'Mobile Navigation' });
  await expect(nav).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(nav.getByRole('button').first()).toBeFocused();
  for (const button of await nav.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: path.join(evidence, 'mobile-navigation.png') });
  await audit(page, 'mobile-navigation');
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  // Escape must not leave keyboard focus on a removed menu item.
  await expect(toggle).toBeFocused();
});

test('mobile palette accessibility, focus trap, filtering and navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-specific surface');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('button', { name: 'Ctrl K (Command Palette)', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette', exact: true });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.press('Tab');
  await expect(input).toBeFocused();
  await input.press('Shift+Tab');
  await expect(input).toBeFocused();
  await page.mouse.move(0, 0);
  await input.press('Home');
  await input.press('ArrowDown');
  await expect(dialog.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');
  await input.fill('printapm');
  await expect(dialog.getByRole('option', { name: /PrintAPM case study/i })).toBeVisible();
  const optionBox = await dialog.getByRole('option', { name: /PrintAPM case study/i }).boundingBox();
  expect(optionBox.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: path.join(evidence, 'mobile-command-palette.png') });
  await audit(page, 'mobile-command-palette');
  await input.fill('no-such-command');
  await expect(dialog).toContainText('no matches');
  await input.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('button', { name: 'Ctrl K (Command Palette)', exact: true }).click();
  await dialog.getByRole('combobox').fill('printapm');
  await dialog.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/\/projects\/printapm$/);
  await expect(page.locator('h1')).toBeFocused();
});

test('admin mocked login, persisted session, create/read/update/delete and logout', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'tablet', 'Desktop and mobile coverage');
  let projects = [{ id: 17, title: 'Fixture project', description: 'Mock record', tech_stack: ['React'], github_url: 'https://github.com/example/mock', live_url: null, featured: true }];
  const mutations = [];
  await page.route('**/api/**', async route => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    let status = 200, body;
    if (pathname === '/api/auth/login') {
      const credentials = request.postDataJSON();
      status = credentials.password === 'mock-password' ? 200 : 401;
      body = status === 200 ? { token: 'isolated-test-token' } : { error: 'Invalid credentials' };
    } else if (pathname.startsWith('/api/projects')) {
      if (request.method() !== 'GET') {
        expect(request.headers().authorization).toBe('Bearer isolated-test-token');
        mutations.push({ method: request.method(), pathname, payload: request.postDataJSON() });
        if (request.method() === 'POST') { projects.push({ id: 18, ...request.postDataJSON() }); status = 201; }
        if (request.method() === 'PUT') projects = projects.map(p => p.id === 18 ? { id: 18, ...request.postDataJSON() } : p);
        if (request.method() === 'DELETE') projects = projects.filter(p => p.id !== 18);
      }
      body = { data: projects };
    } else throw new Error(`Unexpected mock request ${pathname}`);
    await route.fulfill({ status, json: body });
  });
  await page.goto('/admin');
  await page.locator('#admin-email').fill('mock@example.test');
  await page.locator('#admin-password').fill('wrong-password');
  await page.getByRole('button', { name: '$ authenticate', exact: true }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
  await page.locator('#admin-password').fill('mock-password');
  await page.getByRole('button', { name: '$ authenticate', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Fixture project', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
  await page.getByPlaceholder('Project title').fill('Created fixture');
  await page.getByPlaceholder('Project description').fill('Created with isolated mocks');
  await page.getByPlaceholder('React, Node.js, MySQL').fill('React, Node.js');
  await page.getByRole('button', { name: '$ save', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Created fixture', exact: true })).toBeVisible();
  expect(mutations[0].payload.tech_stack).toEqual(['React', 'Node.js']);
  await page.getByRole('button', { name: 'Edit Created fixture' }).click();
  await expect(page.getByPlaceholder('React, Node.js, MySQL')).toHaveValue('React, Node.js');
  await page.getByPlaceholder('Project title').fill('Updated fixture');
  await page.getByRole('button', { name: '$ update', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Updated fixture', exact: true })).toBeVisible();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete Updated fixture' }).click();
  await expect(page.getByRole('heading', { name: 'Updated fixture', exact: true })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete Updated fixture' }).click();
  await expect(page.getByRole('heading', { name: 'Updated fixture', exact: true })).toHaveCount(0);
  expect(mutations.map(m => m.method)).toEqual(['POST', 'PUT', 'DELETE']);
  await writeFile(path.join(evidence, `admin-${testInfo.project.name}-requests.json`), JSON.stringify(mutations, null, 2));
  await page.getByRole('button', { name: 'logout' }).click();
  await expect(page.locator('#admin-email')).toBeVisible();
  await page.reload();
  await expect(page.locator('#admin-email')).toBeVisible();
});

test('successful fixture screenshots', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'tablet', 'Desktop/mobile attachments');
  await page.goto('/');
  await expect(page.locator('#projects')).toContainText('Portfolio');
  await expect(page.locator('#github')).toContainText('CoSupport');
  await page.keyboard.press('Escape'); // completes the optional boot typing
  await page.evaluate(async () => { await document.fonts.ready; });
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: path.join(evidence, `${testInfo.project.name}-viewport.png`) });
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(evidence, `${testInfo.project.name}.png`), fullPage: true });
});

test('intentional API failure: admin rejected save/delete and expired session limitation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Separate failure scenario');
  let expired = false;
  await page.route('**/api/**', async route => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (pathname === '/api/auth/login') return route.fulfill({ json: { token: 'isolated-test-token' } });
    if (request.method() === 'GET') return route.fulfill({ status: expired ? 401 : 200, json: expired ? { error: 'Expired' } : { data: [{ id: 17, title: 'Failure fixture', tech_stack: [] }] } });
    return route.fulfill({ status: 500, json: { error: 'Intentional failure' } });
  });
  await page.goto('/admin');
  await page.locator('#admin-email').fill('mock@example.test');
  await page.locator('#admin-password').fill('mock-password');
  await page.getByRole('button', { name: '$ authenticate', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Failure fixture', exact: true })).toBeVisible();
  await page.getByPlaceholder('Project title').fill('Unsaved fixture');
  await page.getByPlaceholder('Project description').fill('Intentional failure test');
  page.once('dialog', async dialog => { expect(dialog.message()).toBe('Failed to save project'); await dialog.dismiss(); });
  await page.getByRole('button', { name: '$ save', exact: true }).click();
  await expect(page.getByPlaceholder('Project title')).toHaveValue('Unsaved fixture');
  await expect(page.getByRole('button', { name: '$ save', exact: true })).toBeEnabled();
  page.once('dialog', dialog => dialog.accept());
  const alert = page.waitForEvent('dialog', { predicate: dialog => dialog.type() === 'alert' });
  await page.getByRole('button', { name: 'Delete Failure fixture' }).click();
  const failureDialog = await alert;
  expect(failureDialog.message()).toBe('Failed to delete');
  await failureDialog.dismiss();
  await expect(page.getByRole('heading', { name: 'Failure fixture', exact: true })).toBeVisible();
  expired = true;
  await page.reload();
  // Characterization: current frontend retains the stored token and shows an empty dashboard on 401.
  await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
  await expect(page.getByText('No projects recorded in database.')).toBeVisible();
  await writeFile(path.join(evidence, 'admin-failure-limitations.json'), JSON.stringify({ save500: 'alert and form retained', delete500: 'alert and record retained', expired401: 'empty dashboard; no automatic logout' }, null, 2));
});

