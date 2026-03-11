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

const mockRankingXP = {
  ranking: [
    { id: 'user-1', name: 'John Doe', image: null, streak: 5, xp: 5000, level: 5 },
    { id: 'user-2', name: 'Alice Smith', image: null, streak: 10, xp: 4500, level: 4 },
    { id: 'user-3', name: 'Bob Wilson', image: null, streak: 2, xp: 4000, level: 4 },
    { id: 'user-4', name: 'Charlie Brown', image: null, streak: 15, xp: 3500, level: 3 },
  ],
  myPosition: 1
};

const mockRankingStreak = {
  ranking: [
    { id: 'user-4', name: 'Charlie Brown', image: null, streak: 15, xp: 3500, level: 3 },
    { id: 'user-2', name: 'Alice Smith', image: null, streak: 10, xp: 4500, level: 4 },
    { id: 'user-1', name: 'John Doe', image: null, streak: 5, xp: 5000, level: 5 },
    { id: 'user-3', name: 'Bob Wilson', image: null, streak: 2, xp: 4000, level: 4 },
  ],
  myPosition: 3
};

test.describe('Ranking Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock ranking data (default XP)
    await page.route('**/ranking?sortBy=XP', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockRankingXP }) });
    });

    await page.route('**/ranking?sortBy=STREAK', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockRankingStreak }) });
    });
    
    // Catch-all for ranking without params
    await page.route('**/ranking', async (route) => {
        if (!route.request().url().includes('sortBy')) {
            await route.fulfill({ status: 200, body: JSON.stringify({ data: mockRankingXP }) });
        } else {
            await route.continue();
        }
    });
  });

  test('should display XP ranking by default', async ({ page }) => {
    await page.goto('/ranking');
    
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('5000')).toBeVisible(); // XP value
    await expect(page.getByText('Ouro')).toBeVisible(); // Podium label
  });

  test('should toggle to streak ranking', async ({ page }) => {
    await page.goto('/ranking');
    
    // Find the toggle button/tab for Streak
    const streakToggle = page.getByRole('button', { name: /Ofensiva/i });
    await streakToggle.click();
    
    await expect(page.getByText('Charlie Brown')).toBeVisible();
    await expect(page.getByText('15')).toBeVisible(); // Streak value
  });
});
