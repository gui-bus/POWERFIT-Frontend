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

const mockFeed = {
  activities: [
    {
      id: 'act-1',
      userId: 'user-2',
      userName: 'Jane Smith',
      userImage: null,
      workoutDayName: 'Leg Day',
      workoutPlanName: 'Mass Gain',
      statusMessage: 'Great workout today!',
      imageUrl: null,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      powerupsCount: 2,
      hasPowerupByMe: false,
      createdAt: new Date().toISOString(),
      comments: [
        {
          id: 'comm-1',
          userId: 'user-3',
          userName: 'Bob Wilson',
          userImage: null,
          content: 'Nice job!',
          createdAt: new Date().toISOString(),
        }
      ],
      taggedUsers: []
    }
  ],
  nextCursor: null
};

test.describe('Feed Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock feed data
    await page.route('**/feed/**', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({ status: 200, body: JSON.stringify({ data: mockFeed }) });
        } else {
            await route.continue();
        }
    });
  });

  test('should display feed activities', async ({ page }) => {
    await page.goto('/feed');
    
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('Great workout today!')).toBeVisible();
    await expect(page.getByText('Leg Day')).toBeVisible();
  });

  test('should allow toggling powerup', async ({ page }) => {
    await page.goto('/feed');
    
    await page.route('**/feed/activities/act-1/powerup', async (route) => {
      await route.fulfill({ status: 204 });
    });

    const powerupButton = page.getByRole('button', { name: /POWERUP/i }).first();
    await powerupButton.click();
    
    // Check if count or state changes (UI updates locally before refresh)
    await expect(powerupButton).toHaveClass(/bg-primary/);
  });

  test('should allow adding a comment', async ({ page }) => {
    await page.goto('/feed');
    
    // Click comment button to show comments
    await page.getByRole('button', { name: /Comentar/i }).first().click();
    
    const commentInput = page.getByPlaceholder('Adicione um comentário...');
    await commentInput.fill('Awesome work!');
    
    await page.route('**/feed/activities/act-1/comments', async (route) => {
      await route.fulfill({ status: 204 });
    });

    await page.locator('button[type="submit"]').click();
    
    // Check for success toast
    await expect(page.getByText('Comentário adicionado!')).toBeVisible();
  });
});
