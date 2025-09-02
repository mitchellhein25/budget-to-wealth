import { fetchWithAuth, HttpMethod } from '@/app/lib/api';
import { getAccessToken } from '@/app/lib/auth';

// Mock dependencies
jest.mock('@/app/lib/auth/getAccessToken', () => ({
  getAccessToken: jest.fn()
}));

global.fetch = jest.fn();

describe('fetchWithAuth', () => {
  const mockGetAccessToken = getAccessToken as jest.MockedFunction<() => Promise<string | null>>;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  const endpoint = 'test-endpoint';
  const apiResponse = { foo: 'bar' };

  const createMockResponse = (overrides: Partial<Response> = {}) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    body: null,
    bodyUsed: false,
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
    json: jest.fn(),
    ...overrides
  } as unknown as Response);

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
    mockFetch.mockResolvedValue(createMockResponse({
      body: {} as any,
      json: async () => apiResponse
    }));

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(true);
    expect(result.data).toEqual(apiResponse);
    expect(result.responseMessage).toBe('');
  });

  it('returns error message and unsuccessful on !ok', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue(createMockResponse({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Unauthorized'
    }));

    const result = await fetchWithAuth({ endpoint, method: HttpMethod.GET });
    expect(result.successful).toBe(false);
    expect(result.responseMessage).toMatch(/unauthorized/i);
    expect(result.data).toBeDefined();
  });

  it('returns null data if response has no body', async () => {
    mockGetAccessToken.mockResolvedValue('token');
    mockFetch.mockResolvedValue(createMockResponse({
      json: async () => null
    }));

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
    mockFetch.mockResolvedValue(createMockResponse({
      body: {} as any,
      json: async () => apiResponse
    }));

    const body = { hello: 'world' };
    await fetchWithAuth({ endpoint, method: HttpMethod.POST, body });
    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(body)
    }));
  });
}); 