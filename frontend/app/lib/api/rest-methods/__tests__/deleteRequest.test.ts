import { deleteRequest } from '../deleteRequest';
import { fetchWithAuth, HttpMethod } from '../../apiClient';

jest.mock('../../apiClient', () => ({
  fetchWithAuth: jest.fn(),
  HttpMethod: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
}));

const mockFetchWithAuth = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('deleteRequest', () => {
  const testData = {
    endpoint: '/api/test',
    id: 123,
    mockResponse: { data: null, responseMessage: 'Deleted successfully', successful: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Requests', () => {
    it('should call fetchWithAuth with correct parameters', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/${testData.id}`,
        method: 'DELETE',
      });
      expect(result).toEqual(testData.mockResponse);
    });

    it('should handle successful deletion with data', async () => {
      const responseWithData = { data: { id: 123 }, responseMessage: 'Deleted', successful: true };
      mockFetchWithAuth.mockResolvedValue(responseWithData);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(result).toEqual(responseWithData);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const errorResponse = { data: null, responseMessage: 'Not found', successful: false };
      mockFetchWithAuth.mockResolvedValue(errorResponse);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(result).toEqual(errorResponse);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetchWithAuth.mockRejectedValue(networkError);

      await expect(deleteRequest(testData.endpoint, testData.id)).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockFetchWithAuth.mockRejectedValue(timeoutError);

      await expect(deleteRequest(testData.endpoint, testData.id)).rejects.toThrow('Request timeout');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero ID', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      await deleteRequest(testData.endpoint, 0);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/0`,
        method: 'DELETE',
      });
    });

    it('should handle negative ID', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      await deleteRequest(testData.endpoint, -1);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/-1`,
        method: 'DELETE',
      });
    });

    it('should handle large ID', async () => {
      const largeId = Number.MAX_SAFE_INTEGER;
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      await deleteRequest(testData.endpoint, largeId);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/${largeId}`,
        method: 'DELETE',
      });
    });

    it('should handle empty endpoint', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      await deleteRequest('', testData.id);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `/${testData.id}`,
        method: 'DELETE',
      });
    });

    it('should handle endpoint with trailing slash', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      await deleteRequest(`${testData.endpoint}/`, testData.id);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}//${testData.id}`,
        method: 'DELETE',
      });
    });
  });

  describe('Return Type', () => {
    it('should return correct type structure', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockResponse);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('responseMessage');
      expect(result).toHaveProperty('successful');
    });

    it('should handle null data in response', async () => {
      const responseWithNullData = { data: null, responseMessage: 'Success', successful: true };
      mockFetchWithAuth.mockResolvedValue(responseWithNullData);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(result.data).toBeNull();
    });

    it('should handle empty response message', async () => {
      const responseWithEmptyMessage = { data: null, responseMessage: '', successful: true };
      mockFetchWithAuth.mockResolvedValue(responseWithEmptyMessage);

      const result = await deleteRequest(testData.endpoint, testData.id);

      expect(result.responseMessage).toBe('');
    });
  });
}); 