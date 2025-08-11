import { getAllHoldings, deleteHolding } from './holdingRequests';
import { getRequestList, deleteRequest } from '../rest-methods';
import { HOLDINGS_ENDPOINT } from './';

jest.mock('../rest-methods', () => ({
  getRequestList: jest.fn(),
  deleteRequest: jest.fn(),
}));

jest.mock('./', () => ({
  HOLDINGS_ENDPOINT: 'Holdings',
}));

const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;

describe('Holding Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHoldings', () => {
    it('calls getRequestList with correct endpoint', async () => {
      const mockHoldings = [
        { id: 1, name: 'Holding 1', value: 1000 },
        { id: 2, name: 'Holding 2', value: 2000 },
      ];
      
      mockGetRequestList.mockResolvedValue(mockHoldings);
      
      const result = await getAllHoldings();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
      expect(result).toEqual(mockHoldings);
    });

    it('handles errors from getRequestList', async () => {
      const mockError = new Error('API Error');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getAllHoldings()).rejects.toThrow('API Error');
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
    });

    it('returns empty array when no holdings exist', async () => {
      mockGetRequestList.mockResolvedValue([]);
      
      const result = await getAllHoldings();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(HOLDINGS_ENDPOINT);
      expect(result).toEqual([]);
    });
  });

  describe('deleteHolding', () => {
    it('calls deleteRequest with correct endpoint and id', async () => {
      const mockDeletedHolding = { id: 1, name: 'Deleted Holding', value: 1000 };
      mockDeleteRequest.mockResolvedValue(mockDeletedHolding);
      
      const result = await deleteHolding(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 1);
      expect(result).toEqual(mockDeletedHolding);
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteHolding(1)).rejects.toThrow('Delete Error');
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 1);
    });

    it('works with different id values', async () => {
      const mockDeletedHolding = { id: 999, name: 'Another Holding', value: 5000 };
      mockDeleteRequest.mockResolvedValue(mockDeletedHolding);
      
      const result = await deleteHolding(999);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 999);
      expect(result).toEqual(mockDeletedHolding);
    });

    it('works with zero id', async () => {
      const mockDeletedHolding = { id: 0, name: 'Zero Holding', value: 0 };
      mockDeleteRequest.mockResolvedValue(mockDeletedHolding);
      
      const result = await deleteHolding(0);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDINGS_ENDPOINT, 0);
      expect(result).toEqual(mockDeletedHolding);
    });
  });
});
