import { fetchWithAuth, HttpMethod } from '../apiClient';

// Mock dependencies
jest.mock('@/app/lib/auth/getAccessToken', () => ({
  getAccessToken: jest.fn()
}));

global.fetch = jest.fn();

describe('fetchWithAuth', () => {
  const mockGetAccessToken = require('@/app/lib/auth/getAccessToken').getAccessToken as jest.MockedFunction<any>;
  const mockFetch = global.fetch as jest.MockedFunction<any>;

  const endpoint = 'test-endpoint';
  const apiResponse = { foo: 'bar' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns not authorized if no token', async () => {
    mockGetAccessToken.mockResolvedValue(null);

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(false);
    expect(result.responseMessage).toMatch(/not authorized/i);
    expect(result.data).toBeDefined();
  });

  it('returns data and success on 200 OK', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      body: true,
      json: async () => apiResponse
    });

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(true);
    expect(result.data).toEqual(apiResponse);
    expect(result.responseMessage).toBe('');
  });

  it('returns error message and unsuccessful on !ok', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Unauthorized',
      body: true
    });

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(false);
    expect(result.responseMessage).toMatch(/unauthorized/i);
    expect(result.data).toBeDefined();
  });

  it('returns null data if response has no body', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      body: false,
      json: async () => null
    });

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(true);
    expect(result.data).toBeNull();
  });

  it('returns error message on fetch error', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(false);
    expect(result.responseMessage).toMatch(/error fetching data/i);
    expect(result.data).toBeDefined();
  });

  it('sends correct method and body for POST', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      body: true,
      json: async () => apiResponse
    });

    const body = { hello: 'world' };
    await fetchWithAuth({ endpoint, method: HttpMethod.POST, body });
    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(body)
    }));
  });
}); 