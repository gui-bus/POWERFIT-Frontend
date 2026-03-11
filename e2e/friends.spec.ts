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

const mockFriends = [
  {
    id: 'friend-1',
    name: 'Jane Smith',
    image: null,
    since: '2026-01-01T00:00:00Z',
  }
];

const mockIncomingRequests = [
  {
    id: 'req-1',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    user: {
      id: 'user-2',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      image: null,
    }
  }
];

test.describe('Friends Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/get-session', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockSession }) });
    });

    // Mock friends list
    await page.route('**/friendships/', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockFriends }) });
    });

    // Mock incoming requests
    await page.route('**/friendships/requests?type=RECEIVED', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: mockIncomingRequests }) });
    });

    // Mock sent requests (empty)
    await page.route('**/friendships/requests?type=SENT', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
    });

    // Mock user details for sidebar
    await page.route('**/friendships/me', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { ...mockSession.user, level: 5, xp: 5000, friendCode: 'JD123' } }) });
    });
  });

  test('should display friends list and incoming requests', async ({ page }) => {
    await page.goto('/friends');
    
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('Bob Wilson')).toBeVisible();
    await expect(page.getByText('Novas Solicitações')).toBeVisible();
  });

  test('should allow accepting a friend request', async ({ page }) => {
    await page.goto('/friends');
    
    await page.route('**/friendships/requests/req-1/accept', async (route) => {
      await route.fulfill({ status: 204 });
    });

    const acceptButton = page.getByRole('button', { name: /Aceitar/i });
    await acceptButton.click();
    
    // Page should refresh or the request should disappear (mock handles it)
  });

  test('should allow adding a friend by code', async ({ page }) => {
    await page.goto('/friends');
    
    const codeInput = page.getByPlaceholder(/Código ou Email/i);
    await codeInput.fill('BW456');
    
    await page.route('**/friendships/', async (route) => {
        if (route.request().method() === 'POST') {
            await route.fulfill({ status: 200, body: JSON.stringify({ data: { id: 'user-2', name: 'Bob Wilson' } }) });
        } else {
            await route.continue();
        }
    });

    await page.getByRole('button', { name: /Adicionar Atleta/i }).click();
    
    await expect(page.getByText('Convite enviado!')).toBeVisible();
  });
});
