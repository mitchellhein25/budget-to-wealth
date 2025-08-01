import { getHoldingSnapshotsByDateRange, deleteHoldingSnapshot } from '../holdingSnapshotRequests';
import { getRequestList, GetRequestResultList } from '../../rest-methods/getRequest';
import { deleteRequest } from '../../rest-methods/deleteRequest';
import { DateRange } from '@/app/components/DatePicker';

jest.mock('../../rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
}));

jest.mock('../../rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

jest.mock('../queryHelpers', () => ({
  getQueryStringForDateRange: jest.fn((dateRange: DateRange) => {
    const startDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : '';
    const endDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : '';
    return `startDate=${startDate}&endDate=${endDate}`;
  }),
}));

describe('holdingSnapshotRequests', () => {
  const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
  const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHoldingSnapshotsByDateRange', () => {
    const mockDateRange: DateRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    };

    it('fetches holding snapshots by date range successfully', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: 1000,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(mockGetRequestList).toHaveBeenCalledWith('HoldingSnapshots?startDate=2024-01-01&endDate=2024-01-31');
      expect(result).toEqual(mockResponse);
    });

    it('handles failed request', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: false,
        data: null,
        responseMessage: 'Failed to fetch holding snapshots',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getHoldingSnapshotsByDateRange(mockDateRange)).rejects.toThrow('Network error');
    });

    it('handles empty snapshots list', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles single snapshot', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: 1000,
            holding: { id: 1, name: 'Single Stock', type: 'Stock' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with null values', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: null,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with undefined values', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: undefined,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with zero values', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: 0,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with negative values', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: -500,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with different dates', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: 1000,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 2, 
            holdingId: 1, 
            date: '2024-01-02', 
            value: 1100,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
          { 
            id: 3, 
            holdingId: 1, 
            date: '2024-01-03', 
            value: 1050,
            holding: { id: 1, name: 'Stock A', type: 'Stock' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles snapshots with missing holding data', async () => {
      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [
          { 
            id: 1, 
            holdingId: 1, 
            date: '2024-01-01', 
            value: 1000,
            holding: null
          },
          { 
            id: 2, 
            holdingId: 2, 
            date: '2024-01-01', 
            value: 2000,
            holding: { id: 2, name: 'Bond B', type: 'Bond' }
          },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getHoldingSnapshotsByDateRange(mockDateRange);

      expect(result).toEqual(mockResponse);
    });

    it('handles undefined date range', async () => {
      const undefinedDateRange: DateRange = {
        from: undefined,
        to: undefined,
      };

      const mockResponse: GetRequestResultList<any> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      await getHoldingSnapshotsByDateRange(undefinedDateRange);

      expect(mockGetRequestList).toHaveBeenCalledWith('HoldingSnapshots?startDate=&endDate=');
    });
  });

  describe('deleteHoldingSnapshot', () => {
    it('deletes holding snapshot successfully', async () => {
      const mockResponse = {
        successful: true,
        data: null,
        responseMessage: 'Snapshot deleted successfully',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteHoldingSnapshot(1);

      expect(mockDeleteRequest).toHaveBeenCalledWith('HoldingSnapshots', 1);
      expect(result).toEqual(mockResponse);
    });

    it('handles delete failure', async () => {
      const mockResponse = {
        successful: false,
        data: null,
        responseMessage: 'Failed to delete snapshot',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteHoldingSnapshot(1);

      expect(result).toEqual(mockResponse);
    });

    it('handles delete error', async () => {
      const mockError = new Error('Delete failed');
      mockDeleteRequest.mockRejectedValue(mockError);

      await expect(deleteHoldingSnapshot(1)).rejects.toThrow('Delete failed');
    });

    it('handles different snapshot IDs', async () => {
      const mockResponse = {
        successful: true,
        data: null,
        responseMessage: 'Snapshot deleted successfully',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      await deleteHoldingSnapshot(123);

      expect(mockDeleteRequest).toHaveBeenCalledWith('HoldingSnapshots', 123);
    });

    it('handles zero ID', async () => {
      const mockResponse = {
        successful: false,
        data: null,
        responseMessage: 'Invalid ID',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteHoldingSnapshot(0);

      expect(mockDeleteRequest).toHaveBeenCalledWith('HoldingSnapshots', 0);
      expect(result).toEqual(mockResponse);
    });
  });
}); 