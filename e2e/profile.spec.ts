import { test, expect } from '@playwright/test';

const mockSession = {
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://github.com/shadcn.png',
  },
  session: {
    token: 'mock-token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
  }
};

const mockTrainData = {
  weightInGrams: 75000,
  heightInCentimeters: 180,
  age: 25,
  bodyFatPercentage: 0.15,
};

const mockBodyHistory = [
  {
    id: 'entry-1',
    weightInGrams: 75000,
    heightInCentimeters: 180,
    age: 25,
    bodyFatPercentage: 0.15,
    loggedAt: new Date().toISOString(),
  },
  {
    id: 'entry-2',
    weightInGrams: 77000,
    heightInCentimeters: 180,
    age: 25,
    bodyFatPercentage: 0.16,
    loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  }
];

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock session
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock train data
    await page.route('**/me', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockTrainData }) });
    });

    // Mock body progress history
    await page.route('**/body-progress', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockBodyHistory }) });
    });
  });

  test('should display profile information and history', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john@example.com')).toBeVisible();
    
    // Check evolution cards
    await expect(page.getByText('75kg')).toBeVisible();
    await expect(page.getByText('15.0%')).toBeVisible();
    await expect(page.getByText('180cm')).toBeVisible();
    
    // Check trend (75kg - 77kg = -2kg)
    await expect(page.getByText('2.0kg')).toBeVisible();
  });

  test('should open edit profile dialog and allow updating data', async ({ page }) => {
    await page.goto('/profile');
    
    await page.getByRole('button', { name: /Editar Perfil/i }).click();
    
    await expect(page.getByText('Editar Perfil', { exact: true })).toBeVisible();
    
    const weightInput = page.locator('input[name="weight"]');
    await weightInput.fill('76');
    
    // Mock the upsert request
    await page.route('**/me', async (route) => {
        if (route.request().method() === 'PUT' || route.request().method() === 'POST' || route.request().method() === 'PATCH') {
            await route.fulfill({ status: 200, body: JSON.stringify({ data: { ...mockTrainData, weightInGrams: 76000 } }) });
        } else {
            await route.continue();
        }
    });

    await page.getByRole('button', { name: /Salvar Alterações/i }).click();
    
    await expect(page.getByText('Perfil atualizado com sucesso!')).toBeVisible();
  });
});
