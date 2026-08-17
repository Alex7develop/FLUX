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
