import { Holding } from '@/app/net-worth/holding-snapshots/holdings/components/Holding';
import { getRequestList, deleteRequest, getAllHoldings, deleteHolding, HOLDINGS_ENDPOINT, FetchResult } from '../..';

jest.mock('../../rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('../../rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

jest.mock('../endpoints', () => ({
  HOLDINGS_ENDPOINT: 'Holdings',
}));

const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

const createMockHolding = (id: number, name: string): Holding => ({
  id,
  name,
  holdingCategoryId: '1',
  institution: 'Institution',
  type: 'Asset',
  holdingCategory: { name: 'Category' },
  date: '2024-01-01',
});

describe('Holding Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHoldings', () => {
    it('calls getRequestList with correct endpoint', async () => {
      const mockHoldings = [
        createMockHolding(1, 'Holding 1'),
        createMockHolding(2, 'Holding 2'),
      ];
      
      mockGetRequestList.mockResolvedValue(createMockFetchResult(mockHoldings));
      
      const result = await getAllHoldings();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
      expect(result).toEqual(createMockFetchResult(mockHoldings));
    });

    it('handles errors from getRequestList', async () => {
      const mockError = new Error('API Error');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getAllHoldings()).rejects.toThrow('API Error');
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
    });

    it('returns empty array when no holdings exist', async () => {
      mockGetRequestList.mockResolvedValue(createMockFetchResult([]));
      
      const result = await getAllHoldings();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
      expect(result).toEqual(createMockFetchResult([]));
    });
  });

  describe('deleteHolding', () => {
    it('calls deleteRequest with correct endpoint and id', async () => {
      const mockDeletedHolding = createMockHolding(1, 'Deleted Holding');
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedHolding));
      
      const result = await deleteHolding(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 1);
      expect(result).toEqual(createMockFetchResult(mockDeletedHolding));
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteHolding(1)).rejects.toThrow('Delete Error');
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 1);
    });

    it('works with different id values', async () => {
      const mockDeletedHolding = createMockHolding(999, 'Another Holding');
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedHolding));
      
      const result = await deleteHolding(999);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 999);
      expect(result).toEqual(createMockFetchResult(mockDeletedHolding));
    });

    it('works with zero id', async () => {
      const mockDeletedHolding = createMockHolding(0, 'Zero Holding');
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedHolding));
      
      const result = await deleteHolding(0);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 0);
      expect(result).toEqual(createMockFetchResult(mockDeletedHolding));
    });
  });
});
