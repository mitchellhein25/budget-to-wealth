import { FetchResult, getRequestList, getRequestSingle, fetchWithAuth } from '@/app/lib/api';

  jest.mock('@/app/lib/api/apiClient', () => ({
  fetchWithAuth: jest.fn(),
  HttpMethod: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
}));

const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('Get Request Methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequestList', () => {
    it('calls fetchWithAuth with correct parameters for list request', async () => {
      const mockResponse: FetchResult<{ id: number; name: string }[]> = {
        data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestList<{ id: number; name: string }>('test-endpoint');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'test-endpoint',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles errors from fetchWithAuth', async () => {
      const mockError = new Error('API Error');
      mockFetchWithAuth.mockRejectedValue(mockError);
      
      await expect(getRequestList('test-endpoint')).rejects.toThrow('API Error');
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'test-endpoint',
        method: 'GET',
      });
    });

    it('works with different endpoint values', async () => {
      const mockResponse: FetchResult<{ id: number }[]> = {
        data: [{ id: 1 }],
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestList<{ id: number }>('another-endpoint');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'another-endpoint',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });

    it('works with empty endpoint', async () => {
      const mockResponse: FetchResult<{ id: number }[]> = {
        data: [],
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestList<{ id: number }>('');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRequestSingle', () => {
    it('calls fetchWithAuth with correct parameters for single request', async () => {
      const mockResponse: FetchResult<{ id: number; name: string }> = {
        data: { id: 1, name: 'Single Item' },
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestSingle<{ id: number; name: string }>('test-endpoint');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'test-endpoint',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles errors from fetchWithAuth', async () => {
      const mockError = new Error('API Error');
      mockFetchWithAuth.mockRejectedValue(mockError);
      
      await expect(getRequestSingle('test-endpoint')).rejects.toThrow('API Error');
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'test-endpoint',
        method: 'GET',
      });
    });

    it('works with different endpoint values', async () => {
      const mockResponse: FetchResult<{ id: number }> = {
        data: { id: 999 },
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestSingle<{ id: number }>('different-endpoint');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: 'different-endpoint',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });

    it('works with empty endpoint', async () => {
      const mockResponse: FetchResult<{ id: number }> = {
        data: null,
        responseMessage: 'Success',
        successful: true,
      };
      
      mockFetchWithAuth.mockResolvedValue(mockResponse);
      
      const result = await getRequestSingle<{ id: number }>('');
      
      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
