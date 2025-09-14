import { getRequestList, deleteRequest, getAllHoldingCategories, deleteHoldingCategory, FetchResult, HOLDING_CATEGORIES_ENDPOINT } from '@/app/lib/api';

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('@/app/lib/api/rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  RecurrenceFrequency: {  }
}));

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;

describe('Holding Categories Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHoldingCategories', () => {
    it('calls getRequestList with correct endpoint', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      
      mockGetRequestList.mockResolvedValue(createMockFetchResult(mockCategories));
      
      const result = await getAllHoldingCategories();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT);
      expect(result.data).toEqual(mockCategories);
    });

    it('handles errors from getRequestList', async () => {
      const mockError = new Error('API Error');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getAllHoldingCategories()).rejects.toThrow('API Error');
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT);
    });
  });

  describe('deleteHoldingCategory', () => {
    it('calls deleteRequest with correct endpoint and id', async () => {
      const mockDeletedCategory = { id: 1, name: 'Deleted Category' };
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedCategory));
      
      const result = await deleteHoldingCategory(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 1);
      expect(result).toEqual(createMockFetchResult(mockDeletedCategory));
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteHoldingCategory(1)).rejects.toThrow('Delete Error');
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 1);
    });

    it('works with different id values', async () => {
      const mockDeletedCategory = { id: 999, name: 'Another Category' };
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedCategory));
      
      const result = await deleteHoldingCategory(999);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 999);
      expect(result.data).toEqual(mockDeletedCategory);
    });
  });
});
