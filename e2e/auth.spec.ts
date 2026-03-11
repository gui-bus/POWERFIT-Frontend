import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {
  test('should load the auth page correctly', async ({ page }) => {
    // Start from the auth page
    await page.goto('/auth');

    // Check for the main heading
    // Using a more flexible locator since it's a large h1 with line breaks
    await expect(page.locator('h1')).toContainText('Domine seu');
    await expect(page.locator('h1')).toContainText('Potencial');

    // Check for the login button
    const loginButton = page.getByRole('button', { name: /Fazer login com Google/i });
    await expect(loginButton).toBeVisible();
  });

  test('should have the correct metadata', async ({ page }) => {
    await page.goto('/auth');
    // POWER.FIT should be in the title
    await expect(page).toHaveTitle(/POWER\.FIT/i);
  });
});
