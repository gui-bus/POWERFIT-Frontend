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

const mockHomeDataWithWorkout = {
  activeWorkoutPlanId: 'plan-1',
  workoutStreak: 5,
  todayWorkoutDay: {
    id: 'day-1',
    name: 'Treino A - Peito e Tríceps',
    weekDay: 'MONDAY',
    isRestDay: false,
    coverImageUrl: null,
    estimatedDurationInSeconds: 3600,
    exercisesCount: 6,
  },
  consistencyByDay: {
    '2026-03-11': {
      workoutDayId: 'day-1',
      workoutDayCompleted: false,
      workoutDayStarted: false,
    }
  }
};

test.describe('Dashboard (Home)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication session
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockSession }),
      });
    });

    // Mock home data
    await page.route('**/home/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockHomeDataWithWorkout }),
      });
    });
  });

  test('should display user welcome message', async ({ page }) => {
    await page.goto('/');
    console.log('Current URL:', page.url());
    const content = await page.content();
    console.log('Page content length:', content.length);
    if (content.includes('Bem-vindo')) {
        console.log('Found Bem-vindo in content');
    } else {
        console.log('Bem-vindo NOT found in content');
    }
    await expect(page.getByText('Bem-vindo de volta, John!')).toBeVisible();
  });

  test('should display current workout card', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible();
    await expect(page.getByText('6 EXERCÍCIOS')).toBeVisible();
    await expect(page.getByText('60 MIN')).toBeVisible();
  });

  test('should navigate to workout execution page when clicking start workout', async ({ page }) => {
    await page.goto('/');
    const startButton = page.getByRole('link', { name: /Iniciar Treino de hoje/i });
    await startButton.click();
    await expect(page).toHaveURL(/\/workout-plans\/plan-1\/days\/day-1/);
  });

  test('should display consistency grid with correct streak', async ({ page }) => {
    await page.goto('/');
    // Check for streak text
    await expect(page.getByText('5 Dias')).toBeVisible();
  });
});

test.describe('Dashboard Scenarios', () => {
  test('should display rest day view when no workout is scheduled', async ({ page }) => {
    const mockRestDay = {
      ...mockHomeDataWithWorkout,
      todayWorkoutDay: null,
    };

    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    await page.route('**/home/*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockRestDay }) });
    });

    await page.goto('/');
    await expect(page.getByText('Sem treino hoje')).toBeVisible();
    await expect(page.getByText('Aproveite para descansar')).toBeVisible();
  });

  test('should display call to action when no workout plan exists', async ({ page }) => {
    const mockNoPlan = {
      activeWorkoutPlanId: null,
      workoutStreak: 0,
      todayWorkoutDay: null,
      consistencyByDay: {}
    };

    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    await page.route('**/home/*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockNoPlan }) });
    });

    await page.goto('/');
    await expect(page.getByText('CRIE SEU PLANO')).toBeVisible();
    await expect(page.getByText('Fale com o Coach AI')).toBeVisible();
    
    const chatButton = page.getByText('Iniciar conversa');
    await expect(chatButton).toBeVisible();
  });
});
