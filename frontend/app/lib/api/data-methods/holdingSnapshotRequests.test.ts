import { 
  getHoldingSnapshotsByDateRange, 
  getLatestHoldingSnapshots, 
  deleteHoldingSnapshot, 
  getHoldingSnapshotsDateRange 
} from './holdingSnapshotRequests';
import { getRequestList, getRequestSingle } from '../rest-methods/getRequest';
import { deleteRequest } from '../rest-methods/deleteRequest';
import { getQueryStringForDateRange } from './queryHelpers';
import { DateRange } from '@/app/components/DatePicker';
import { HoldingSnapshot } from '@/app/net-worth/holding-snapshots/components/HoldingSnapshot';
import { DateRangeResponse, HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT, HOLDING_SNAPSHOTS_ENDPOINT } from './';

jest.mock('../rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
  getRequestSingle: jest.fn(),
}));

jest.mock('../rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));

jest.mock('./queryHelpers', () => ({
  getQueryStringForDateRange: jest.fn(),
}));

jest.mock('./', () => ({
  HOLDING_SNAPSHOTS_ENDPOINT: 'HoldingSnapshots',
  HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT: 'HoldingSnapshots/AvailableDateRange',
}));

const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
const mockGetRequestSingle = getRequestSingle as jest.MockedFunction<typeof getRequestSingle>;
const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;
const mockGetQueryStringForDateRange = getQueryStringForDateRange as jest.MockedFunction<typeof getQueryStringForDateRange>;

describe('Holding Snapshot Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHoldingSnapshotsByDateRange', () => {
    it('calls getRequestList with correct endpoint and query string', async () => {
      const mockDateRange: DateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const mockQueryString = 'startDate=2024-01-01&endDate=2024-01-31';
      const mockSnapshots: HoldingSnapshot[] = [
        { id: 1, date: '2024-01-15', totalValue: 10000 },
        { id: 2, date: '2024-01-20', totalValue: 11000 },
      ];
      
      mockGetQueryStringForDateRange.mockReturnValue(mockQueryString);
      mockGetRequestList.mockResolvedValue(mockSnapshots);
      
      const result = await getHoldingSnapshotsByDateRange(mockDateRange);
      
      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestList).toHaveBeenCalledWith(`${HOLDING_SNAPSHOTS_ENDPOINT}?${mockQueryString}`);
      expect(result).toEqual(mockSnapshots);
    });

    it('handles errors from getRequestList', async () => {
      const mockDateRange: DateRange = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const mockError = new Error('API Error');
      
      mockGetQueryStringForDateRange.mockReturnValue('startDate=2024-01-01&endDate=2024-01-31');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getHoldingSnapshotsByDateRange(mockDateRange)).rejects.toThrow('API Error');
    });
  });

  describe('getLatestHoldingSnapshots', () => {
    it('calls getRequestList with latestOnly query parameter', async () => {
      const mockSnapshots: HoldingSnapshot[] = [
        { id: 1, date: '2024-01-31', totalValue: 12000 },
      ];
      
      mockGetRequestList.mockResolvedValue(mockSnapshots);
      
      const result = await getLatestHoldingSnapshots();
      
      expect(mockGetRequestList).toHaveBeenCalledWith(`${HOLDING_SNAPSHOTS_ENDPOINT}?latestOnly=true`);
      expect(result).toEqual(mockSnapshots);
    });

    it('handles errors from getRequestList', async () => {
      const mockError = new Error('API Error');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getLatestHoldingSnapshots()).rejects.toThrow('API Error');
    });
  });

  describe('deleteHoldingSnapshot', () => {
    it('calls deleteRequest with correct endpoint and id', async () => {
      const mockDeletedSnapshot: HoldingSnapshot = { id: 1, date: '2024-01-15', totalValue: 10000 };
      mockDeleteRequest.mockResolvedValue(mockDeletedSnapshot);
      
      const result = await deleteHoldingSnapshot(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(HOLDING_SNAPSHOTS_ENDPOINT, 1);
      expect(result).toEqual(mockDeletedSnapshot);
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteHoldingSnapshot(1)).rejects.toThrow('Delete Error');
    });
  });

  describe('getHoldingSnapshotsDateRange', () => {
    it('calls getRequestSingle with correct endpoint', async () => {
      const mockDateRange: DateRangeResponse = { startDate: '2024-01-01', endDate: '2024-01-31' };
      mockGetRequestSingle.mockResolvedValue(mockDateRange);
      
      const result = await getHoldingSnapshotsDateRange();
      
      expect(mockGetRequestSingle).toHaveBeenCalledWith(HOLDING_SNAPSHOTS_AVAILABLE_DATE_RANGE_ENDPOINT);
      expect(result).toEqual(mockDateRange);
    });

    it('handles errors from getRequestSingle', async () => {
      const mockError = new Error('API Error');
      mockGetRequestSingle.mockRejectedValue(mockError);
      
      await expect(getHoldingSnapshotsDateRange()).rejects.toThrow('API Error');
    });
  });
});
