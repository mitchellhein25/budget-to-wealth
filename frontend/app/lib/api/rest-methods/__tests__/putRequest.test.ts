import { fetchWithAuth, putRequest } from '@/app/lib/api';

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

describe('Put Request Method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchWithAuth with correct parameters', async () => {
    const mockResponse = {
      data: { id: 1, name: 'Updated Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'Updated Item', value: 200 };
    const mockId = '1';
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await putRequest<{ id: number; name: string }>('test-endpoint', mockId, mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint/1',
      method: 'PUT',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });

  it('handles errors from fetchWithAuth', async () => {
    const mockError = new Error('API Error');
    const mockBody = { name: 'Test Item' };
    const mockId = '1';
    
    mockFetchWithAuth.mockRejectedValue(mockError);
    
    await expect(putRequest('test-endpoint', mockId, mockBody)).rejects.toThrow('API Error');
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint/1',
      method: 'PUT',
      body: mockBody,
    });
  });

  it('works with different endpoint values', async () => {
    const mockResponse = {
      data: { id: 999, name: 'Another Updated Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'Another Updated Item', value: 500 };
    const mockId = '999';
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await putRequest<{ id: number; name: string }>('different-endpoint', mockId, mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'different-endpoint/999',
      method: 'PUT',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });

  it('works with empty endpoint', async () => {
    const mockResponse = {
      data: null,
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'Empty Endpoint Item' };
    const mockId = '1';
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await putRequest<{ id: number; name: string }>('', mockId, mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: '/1',
      method: 'PUT',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });

  it('works with empty id string', async () => {
    const mockResponse = {
      data: { id: 0, name: 'Zero ID Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'Zero ID Item', value: 0 };
    const mockId = '';
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await putRequest<{ id: number; name: string }>('test-endpoint', mockId, mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint/',
      method: 'PUT',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });

  it('works with empty body object', async () => {
    const mockResponse = {
      data: { id: 1, name: 'Empty Body Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = {};
    const mockId = '1';
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await putRequest<{ id: number; name: string }>('test-endpoint', mockId, mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint/1',
      method: 'PUT',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });
});
