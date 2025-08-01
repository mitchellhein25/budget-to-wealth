import { getAllHoldingCategories } from '../holdingCategoriesRequests';
import { getRequestList, GetRequestResultList } from '../../rest-methods';

jest.mock('../../rest-methods', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('../endpoints', () => ({
  HOLDING_CATEGORIES_ENDPOINT: '/api/v1/holding-categories',
}));

describe('holdingCategoriesRequests', () => {
  const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHoldingCategories', () => {
    it('fetches all holding categories successfully', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Stocks', description: 'Stock investments' },
          { id: 2, name: 'Bonds', description: 'Bond investments' },
          { id: 3, name: 'Real Estate', description: 'Real estate investments' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(mockGetRequestList).toHaveBeenCalledWith('/api/v1/holding-categories');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed request', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: false,
        data: null,
        responseMessage: 'Failed to fetch holding categories',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getAllHoldingCategories()).rejects.toThrow('Network error');
    });

    it('handles empty categories list', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles single category', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Single Category', description: 'A single category' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles categories with null descriptions', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Category A', description: null },
          { id: 2, name: 'Category B', description: 'Has description' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles categories with undefined descriptions', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Category A', description: undefined },
          { id: 2, name: 'Category B', description: 'Has description' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles categories with empty descriptions', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Category A', description: '' },
          { id: 2, name: 'Category B', description: 'Has description' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles categories with special characters in names', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { id: 1, name: 'Category & Co.', description: 'Special characters' },
          { id: 2, name: 'Category-Name', description: 'Hyphenated name' },
          { id: 3, name: 'Category_Name', description: 'Underscore name' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });

    it('handles categories with long names and descriptions', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            name: 'Very Long Category Name That Exceeds Normal Length', 
            description: 'This is a very long description that contains a lot of text and might exceed normal length limits in some cases where the description field is quite lengthy and detailed' 
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldingCategories();

      expect(result).toEqual(mockResponse);
    });
  });
}); 