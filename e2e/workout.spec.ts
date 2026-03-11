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

const mockWorkoutDay = {
  id: 'day-1',
  name: 'Treino A - Peito e Tríceps',
  weekDay: 'MONDAY',
  isRestDay: false,
  coverImageUrl: null,
  estimatedDurationInSeconds: 3600,
  exercises: [
    {
      id: 'ex-1',
      name: 'Supino Reto',
      sets: 3,
      reps: 10,
      restTimeInSeconds: 60,
      instructions: 'Desça a barra até o peito e empurre para cima.',
    }
  ],
  sessions: [
    {
      id: 'session-1',
      startedAt: new Date().toISOString(),
      completedAt: null,
    }
  ]
};

const mockHistory = {
  lastSets: [
    {
      weightInGrams: 60000,
      reps: 10,
      setIndex: 0,
    }
  ]
};

test.describe('Workout Execution', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock workout day details
    await page.route('**/workout-plans/plan-1/days/day-1', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockWorkoutDay }) });
    });

    // Mock exercise history
    await page.route('**/friendships/me', async (route) => {
        // Assuming this is used for some basic user info in PageHeader
        await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession.user }) });
    });

    // Mock workout exercise history
    await page.route('**/exercises/ex-1/history', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockHistory }) });
    });

    // Mock upsert set
    await page.route('**/workout-plans/sessions/session-1/exercises/ex-1/sets/*', async (route) => {
      await route.fulfill({ status: 204 });
    });
  });

  test('should display exercise details correctly', async ({ page }) => {
    await page.goto('/workout-plans/plan-1/days/day-1');
    
    await expect(page.getByText('Treino A - Peito e Tríceps')).toBeVisible();
    await expect(page.getByText('Supino Reto')).toBeVisible();
    await expect(page.getByText('01:00 Pausa')).toBeVisible();
  });

  test('should allow marking a set as completed', async ({ page }) => {
    await page.goto('/workout-plans/plan-1/days/day-1');
    
    // Fill reps and weight (they might be pre-filled from history)
    const weightInput = page.locator('input[type="number"]').first();
    const repsInput = page.locator('input[type="number"]').nth(1);
    
    await weightInput.fill('70');
    await repsInput.fill('10');
    
    // Click the complete set button (CircleIcon/CheckCircleIcon)
    const completeButton = page.getByTitle('Marcar set como concluído').first();
    await completeButton.click();
    
    // Check if timer appears
    await expect(page.getByText('DESCANSO')).toBeVisible();
  });

  test('should show instructions when clicking the help button', async ({ page }) => {
    await page.goto('/workout-plans/plan-1/days/day-1');
    
    const helpButton = page.getByText('Instruções');
    await helpButton.click();
    
    // Should open chat with initial message
    await expect(page.getByText('Power AI')).toBeVisible();
    await expect(page.getByText('Poderia me dar instruções sobre como executar o Supino Reto?')).toBeVisible();
  });
});
