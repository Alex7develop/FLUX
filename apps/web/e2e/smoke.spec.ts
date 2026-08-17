import { expect, test } from '@playwright/test';

test('landing page shows FLUX and opens the app shell', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /drop anything/i })).toBeVisible();
  await expect(page.getByText('FLUX').first()).toBeVisible();

  await page.getByRole('link', { name: 'Try FLUX' }).first().click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('button', { name: /drop anything/i })).toBeVisible();
  await expect(page.getByText('Ready for anything.')).toBeVisible();
});

test('two tabs can pair with a connection code', async ({ browser }) => {
  const context = await browser.newContext();
  const host = await context.newPage();
  const guest = await context.newPage();

  await host.goto('/app/devices');
  await host.getByRole('button', { name: /create connection code/i }).click();
  const code = await host.getByTestId('pairing-code').innerText();

  await guest.goto('/app/devices');
  await guest.getByPlaceholder('K7M2QX').fill(code);
  await guest.getByRole('button', { name: /join device/i }).click();

  await expect(host.getByText('Connected')).toBeVisible({ timeout: 20_000 });
  await expect(guest.getByText('Connected')).toBeVisible({ timeout: 20_000 });
  await context.close();
});

test('devices page can create a pairing code', async ({ page }) => {
  await page.goto('/app/devices');
  await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();
  await page.getByRole('button', { name: /create connection code/i }).click();
  await expect(page.getByTestId('pairing-code')).toHaveText(/^[A-Z2-9]{6}$/);
});
