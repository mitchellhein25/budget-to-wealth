import { fetchWithAuth, postRequest } from '../..';

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

describe('Post Request Method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchWithAuth with correct parameters', async () => {
    const mockResponse = {
      data: { id: 1, name: 'Created Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'New Item', value: 100 };
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await postRequest<{ id: number; name: string }>('test-endpoint', mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint',
      method: 'POST',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });

  it('handles errors from fetchWithAuth', async () => {
    const mockError = new Error('API Error');
    const mockBody = { name: 'Test Item' };
    
    mockFetchWithAuth.mockRejectedValue(mockError);
    
    await expect(postRequest('test-endpoint', mockBody)).rejects.toThrow('API Error');
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint',
      method: 'POST',
      body: mockBody,
    });
  });

  it('works with different endpoint values', async () => {
    const mockResponse = {
      data: { id: 999, name: 'Another Item' },
      responseMessage: 'Success',
      successful: true,
    };
    
    const mockBody = { name: 'Another Item', value: 500 };
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await postRequest<{ id: number; name: string }>('different-endpoint', mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'different-endpoint',
      method: 'POST',
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
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await postRequest<{ id: number; name: string }>('', mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: '',
      method: 'POST',
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
    
    mockFetchWithAuth.mockResolvedValue(mockResponse);
    
    const result = await postRequest<{ id: number; name: string }>('test-endpoint', mockBody);
    
    expect(mockFetchWithAuth).toHaveBeenCalledWith({
      endpoint: 'test-endpoint',
      method: 'POST',
      body: mockBody,
    });
    expect(result).toEqual(mockResponse);
  });
});
