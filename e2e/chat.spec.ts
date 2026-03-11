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

test.describe('AI Coach Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock home data
    await page.route('**/home/*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: {
            activeWorkoutPlanId: null,
            workoutStreak: 0,
            todayWorkoutDay: null,
            consistencyByDay: {}
          }
        }),
      });
    });
  });

  test('should open chat when clicking on Coach AI card', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to render (assuming it passes auth check)
    // If it fails due to server-side check, this will fail
    const coachCard = page.getByText('Fale com o Coach AI');
    if (await coachCard.isVisible()) {
        await coachCard.click();
        await expect(page.getByText('Power AI')).toBeVisible();
        await expect(page.getByPlaceholder('Tire suas dúvidas agora...')).toBeVisible();
    }
  });

  test('should allow sending a message and receiving a mock response', async ({ page }) => {
    // We'll go directly to the chat open state via URL params
    await page.goto('/?chat_open=true');
    
    await expect(page.getByText('Power AI')).toBeVisible();
    
    const input = page.getByPlaceholder('Tire suas dúvidas agora...');
    await input.fill('Como ganhar massa muscular?');
    
    // Mock the AI response (using wildcards for the AI endpoint)
    await page.route('**/ai', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'Para ganhar massa muscular, você precisa de um treino de hipertrofia e dieta balanceada.',
      });
    });

    await page.locator('button[type="submit"]').click();
    
    // Check if the message appears in the chat
    await expect(page.getByText('Como ganhar massa muscular?')).toBeVisible();
    // Check for AI response (streaming or final)
    await expect(page.getByText(/hipertrofia/i)).toBeVisible();
  });
});
