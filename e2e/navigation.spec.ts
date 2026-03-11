import { test, expect, devices } from '@playwright/test';

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

test.describe('Navigation', () => {
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
            activeWorkoutPlanId: 'plan-1',
            workoutStreak: 5,
            todayWorkoutDay: null,
            consistencyByDay: {}
          }
        }),
      });
    });
  });

  test('should navigate through main pages on desktop', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar navigation (desktop)
    // We can use URLs directly to verify links exist and work
    const navItems = [
      { href: '/feed', text: /Feed/i },
      { href: '/ranking', text: /Ranking/i },
      { href: '/stats', text: /Estatísticas/i },
      { href: '/profile', text: /Perfil/i },
    ];

    for (const item of navItems) {
        // Find links by href since text might be hidden or icons
        const link = page.locator(`nav >> a[href="${item.href}"]`).first();
        await expect(link).toBeVisible();
    }
  });

  test.describe('Mobile Navigation', () => {
    test.use({ ...devices['iPhone 13'] });

    test('should display bottom navigation on mobile', async ({ page }) => {
      await page.goto('/');
      
      const bottomNav = page.locator('nav.lg\\:hidden');
      await expect(bottomNav).toBeVisible();
      
      // Central sparkle button for AI Coach
      const sparkleButton = bottomNav.locator('button');
      await expect(sparkleButton).toBeVisible();
      
      await sparkleButton.click();
      await expect(page.getByText('Power AI')).toBeVisible();
    });
  });
});
