import { getAllHoldingCategories, deleteHoldingCategory } from './holdingCategoriesRequests';
import { getRequestList, deleteRequest } from '../rest-methods';
import { HOLDING_CATEGORIES_ENDPOINT } from './';

jest.mock('../rest-methods', () => ({
  getRequestList: jest.fn(),
  deleteRequest: jest.fn(),
}));

jest.mock('./', () => ({
  HOLDING_CATEGORIES_ENDPOINT: 'HoldingCategories',
}));

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
      
      mockGetRequestList.mockResolvedValue(mockCategories);
      
      const result = await getAllHoldingCategories();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT);
      expect(result).toEqual(mockCategories);
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
      mockDeleteRequest.mockResolvedValue(mockDeletedCategory);
      
      const result = await deleteHoldingCategory(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 1);
      expect(result).toEqual(mockDeletedCategory);
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteHoldingCategory(1)).rejects.toThrow('Delete Error');
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 1);
    });

    it('works with different id values', async () => {
      const mockDeletedCategory = { id: 999, name: 'Another Category' };
      mockDeleteRequest.mockResolvedValue(mockDeletedCategory);
      
      const result = await deleteHoldingCategory(999);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_CATEGORIES_ENDPOINT, 999);
      expect(result).toEqual(mockDeletedCategory);
    });
  });
});
