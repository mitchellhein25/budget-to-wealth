import { deleteRequest } from '../deleteRequest';

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

describe('deleteRequest', () => {
  const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a DELETE request with correct parameters', async () => {
    const mockResponse = { data: null, successful: true, responseMessage: 'Success' };
    mockFetchWithAuth.mockResolvedValue(mockResponse);

    const url = '/api/test';
    const id = 123;
    const result = await deleteRequest(url, id);

    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: `${url}/${id}`,
      method: 'DELETE',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle network errors', async () => {
    mockFetchWithAuth.mockRejectedValue(new Error('Network error'));

    const url = '/api/test';
    const id = 123;
    
    await expect(deleteRequest(url, id)).rejects.toThrow('Network error');
  });

  it('should handle non-ok responses', async () => {
    const mockResponse = { data: null, successful: false, responseMessage: 'Not authorized.' };
    mockFetchWithAuth.mockResolvedValue(mockResponse);

    const url = '/api/test';
    const id = 123;
    
    const result = await deleteRequest(url, id);
    expect(result).toEqual(mockResponse);
  });
}); 