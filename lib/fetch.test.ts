import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { customFetch } from './fetch'

describe('customFetch utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'https://api.test.com' };
  })

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  })

  it('should construct the correct URL with base path', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true })
    } as any);

    await customFetch('/test-endpoint', {});

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.com/test-endpoint',
      expect.objectContaining({
        credentials: 'include'
      })
    );
  })

  it('should handle trailing slashes in API_URL correctly', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com/';
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({})
    } as any);

    await customFetch('test-endpoint', {});
    expect(fetch).toHaveBeenCalledWith('https://api.test.com/test-endpoint', expect.any(Object));
  })

  it('should return null data for 204 No Content', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 204,
      headers: new Headers(),
    } as any);

    const result: any = await customFetch('/no-content', {});
    expect(result.status).toBe(204);
    expect(result.data).toBeNull();
  })

  it('should return null data if content-type is not JSON', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'text/html' }),
    } as any);

    const result: any = await customFetch('/html', {});
    expect(result.data).toBeNull();
  })

  it('should handle JSON parse errors gracefully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.reject(new Error('Invalid JSON'))
    } as any);

    const result: any = await customFetch('/invalid-json', {});
    expect(result.data).toBeNull();
  })

  it('should include server-side cookies when in server environment', async () => {
    // Simulate server environment
    vi.stubGlobal('window', undefined);
    
    // Mock next/headers
    vi.mock('next/headers', () => ({
      cookies: vi.fn().mockResolvedValue({
        toString: () => 'session-cookie=123'
      })
    }));

    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      headers: new Headers(),
    } as any);

    await customFetch('/server-call', { headers: { 'X-Test': 'true' } });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Test': 'true',
          cookie: 'session-cookie=123'
        })
      })
    );
  })
})
