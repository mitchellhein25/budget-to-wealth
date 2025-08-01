import { getRequestList, getRequestSingle } from '../getRequest';
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

describe('getRequest', () => {
  const testData = {
    endpoint: '/api/test',
    mockListResponse: { data: [{ id: 1 }, { id: 2 }], responseMessage: 'Success', successful: true },
    mockSingleResponse: { data: { id: 1 }, responseMessage: 'Success', successful: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequestList', () => {
    it('should call fetchWithAuth with correct parameters for list', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockListResponse);

      const result = await getRequestList(testData.endpoint);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: testData.endpoint,
        method: 'GET',
      });
      expect(result).toEqual(testData.mockListResponse);
    });

    it('should handle successful list request with data', async () => {
      const responseWithData = { 
        data: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }], 
        responseMessage: 'Success', 
        successful: true 
      };
      mockFetchWithAuth.mockResolvedValue(responseWithData);

      const result = await getRequestList(testData.endpoint);

      expect(result).toEqual(responseWithData);
      expect(result.data).toHaveLength(2);
    });

    it('should handle empty list response', async () => {
      const emptyResponse = { data: [], responseMessage: 'No items found', successful: true };
      mockFetchWithAuth.mockResolvedValue(emptyResponse);

      const result = await getRequestList(testData.endpoint);

      expect(result).toEqual(emptyResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle null data in list response', async () => {
      const nullDataResponse = { data: null, responseMessage: 'Error', successful: false };
      mockFetchWithAuth.mockResolvedValue(nullDataResponse);

      const result = await getRequestList(testData.endpoint);

      expect(result).toEqual(nullDataResponse);
      expect(result.data).toBeNull();
    });

    it('should handle API errors for list', async () => {
      const errorResponse = { data: null, responseMessage: 'Not found', successful: false };
      mockFetchWithAuth.mockResolvedValue(errorResponse);

      const result = await getRequestList(testData.endpoint);

      expect(result).toEqual(errorResponse);
    });

    it('should handle network errors for list', async () => {
      const networkError = new Error('Network error');
      mockFetchWithAuth.mockRejectedValue(networkError);

      await expect(getRequestList(testData.endpoint)).rejects.toThrow('Network error');
    });
  });

  describe('getRequestSingle', () => {
    it('should call fetchWithAuth with correct parameters for single item', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockSingleResponse);

      const result = await getRequestSingle(testData.endpoint);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: testData.endpoint,
        method: 'GET',
      });
      expect(result).toEqual(testData.mockSingleResponse);
    });

    it('should handle successful single request with data', async () => {
      const responseWithData = { 
        data: { id: 1, name: 'Single Item' }, 
        responseMessage: 'Success', 
        successful: true 
      };
      mockFetchWithAuth.mockResolvedValue(responseWithData);

      const result = await getRequestSingle(testData.endpoint);

      expect(result).toEqual(responseWithData);
      expect(result.data).toEqual({ id: 1, name: 'Single Item' });
    });

    it('should handle null data in single response', async () => {
      const nullDataResponse = { data: null, responseMessage: 'Not found', successful: false };
      mockFetchWithAuth.mockResolvedValue(nullDataResponse);

      const result = await getRequestSingle(testData.endpoint);

      expect(result).toEqual(nullDataResponse);
      expect(result.data).toBeNull();
    });

    it('should handle API errors for single item', async () => {
      const errorResponse = { data: null, responseMessage: 'Not found', successful: false };
      mockFetchWithAuth.mockResolvedValue(errorResponse);

      const result = await getRequestSingle(testData.endpoint);

      expect(result).toEqual(errorResponse);
    });

    it('should handle network errors for single item', async () => {
      const networkError = new Error('Network error');
      mockFetchWithAuth.mockRejectedValue(networkError);

      await expect(getRequestSingle(testData.endpoint)).rejects.toThrow('Network error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty endpoint for list', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockListResponse);

      await getRequestList('');

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
      });
    });

    it('should handle empty endpoint for single', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockSingleResponse);

      await getRequestSingle('');

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
      });
    });

    it('should handle endpoint with trailing slash for list', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockListResponse);

      await getRequestList(`${testData.endpoint}/`);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/`,
        method: 'GET',
      });
    });

    it('should handle endpoint with trailing slash for single', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockSingleResponse);

      await getRequestSingle(`${testData.endpoint}/`);

      expect(mockFetchWithAuth).toHaveBeenCalledWith({
        endpoint: `${testData.endpoint}/`,
        method: 'GET',
      });
    });

    it('should handle timeout errors for list', async () => {
      const timeoutError = new Error('Request timeout');
      mockFetchWithAuth.mockRejectedValue(timeoutError);

      await expect(getRequestList(testData.endpoint)).rejects.toThrow('Request timeout');
    });

    it('should handle timeout errors for single', async () => {
      const timeoutError = new Error('Request timeout');
      mockFetchWithAuth.mockRejectedValue(timeoutError);

      await expect(getRequestSingle(testData.endpoint)).rejects.toThrow('Request timeout');
    });
  });

  describe('Return Type Structure', () => {
    it('should return correct type structure for list', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockListResponse);

      const result = await getRequestList(testData.endpoint);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('responseMessage');
      expect(result).toHaveProperty('successful');
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return correct type structure for single', async () => {
      mockFetchWithAuth.mockResolvedValue(testData.mockSingleResponse);

      const result = await getRequestSingle(testData.endpoint);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('responseMessage');
      expect(result).toHaveProperty('successful');
      expect(Array.isArray(result.data)).toBe(false);
    });

    it('should handle empty response message for list', async () => {
      const responseWithEmptyMessage = { data: [], responseMessage: '', successful: true };
      mockFetchWithAuth.mockResolvedValue(responseWithEmptyMessage);

      const result = await getRequestList(testData.endpoint);

      expect(result.responseMessage).toBe('');
    });

    it('should handle empty response message for single', async () => {
      const responseWithEmptyMessage = { data: null, responseMessage: '', successful: true };
      mockFetchWithAuth.mockResolvedValue(responseWithEmptyMessage);

      const result = await getRequestSingle(testData.endpoint);

      expect(result.responseMessage).toBe('');
    });
  });
}); 