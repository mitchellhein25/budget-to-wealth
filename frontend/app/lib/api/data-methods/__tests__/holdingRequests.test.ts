import { getAllHoldings } from '../holdingRequests';
import { getRequestList, GetRequestResultList } from '../../rest-methods';
import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components/Holding';

jest.mock('../../rest-methods', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('../endpoints', () => ({
  HOLDINGS_ENDPOINT: '/api/v1/holdings',
}));

describe('holdingRequests', () => {
  const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHoldings', () => {
    it('fetches all holdings successfully', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [
          { id: 1, name: 'Stock A', type: 'Stock', value: 1000 },
          { id: 2, name: 'Bond B', type: 'Bond', value: 2000 },
          { id: 3, name: 'ETF C', type: 'ETF', value: 1500 },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(mockGetRequestList).toHaveBeenCalledWith('/api/v1/holdings');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed request', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: false,
        data: null,
        responseMessage: 'Failed to fetch holdings',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });

    it('handles request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getAllHoldings()).rejects.toThrow('Network error');
    });

    it('handles empty holdings list', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });

    it('handles single holding', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [
          { id: 1, name: 'Single Stock', type: 'Stock', value: 1000 },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });

    it('handles holdings with different types', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [
          { id: 1, name: 'Stock A', type: 'Stock', value: 1000 },
          { id: 2, name: 'Bond B', type: 'Bond', value: 2000 },
          { id: 3, name: 'Real Estate', type: 'RealEstate', value: 50000 },
          { id: 4, name: 'Cash', type: 'Cash', value: 5000 },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });

    it('handles holdings with null values', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [
          { id: 1, name: 'Stock A', type: 'Stock', value: null },
          { id: 2, name: 'Bond B', type: 'Bond', value: 2000 },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });

    it('handles holdings with undefined values', async () => {
      const mockResponse: GetRequestResultList<Holding> = {
        successful: true,
        data: [
          { id: 1, name: 'Stock A', type: 'Stock', value: undefined },
          { id: 2, name: 'Bond B', type: 'Bond', value: 2000 },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getAllHoldings();

      expect(result).toEqual(mockResponse);
    });
  });
}); 