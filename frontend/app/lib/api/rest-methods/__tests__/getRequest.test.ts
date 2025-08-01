import { getRequestSingle } from '../getRequest';

jest.mock('@/app/lib/api/apiClient', () => ({
  fetchWithAuth: jest.fn(),
  HttpMethod: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
}));

import { fetchWithAuth } from '@/app/lib/api/apiClient';

describe('getRequestSingle', () => {
  const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request with correct parameters', async () => {
    const mockResponse = { data: 'test', successful: true, responseMessage: '' };
    mockFetchWithAuth.mockResolvedValue(mockResponse);

    const url = '/api/test';
    const result = await getRequestSingle(url);

    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: url,
      method: 'GET',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle network errors', async () => {
    mockFetchWithAuth.mockRejectedValue(new Error('Network error'));

    const url = '/api/test';
    
    await expect(getRequestSingle(url)).rejects.toThrow('Network error');
  });

  it('should handle non-ok responses', async () => {
    const mockResponse = { data: null, successful: false, responseMessage: 'Not authorized.' };
    mockFetchWithAuth.mockResolvedValue(mockResponse);

    const url = '/api/test';
    
    const result = await getRequestSingle(url);
    expect(result).toEqual(mockResponse);
  });
}); 