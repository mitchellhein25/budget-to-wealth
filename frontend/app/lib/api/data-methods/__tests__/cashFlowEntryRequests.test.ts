import { getCashFlowEntriesByDateRangeAndType, deleteCashFlowEntry } from '../cashFlowEntryRequests';
import { getRequestList, deleteRequest, GetRequestResultList } from '../../rest-methods';
import { DateRange } from '@/app/components/DatePicker';

jest.mock('../../rest-methods', () => ({
  getRequestList: jest.fn(),
  deleteRequest: jest.fn(),
}));

jest.mock('../endpoints', () => ({
  CASH_FLOW_ENTRIES_ENDPOINT: '/api/v1/cash-flow-entries',
}));

jest.mock('../queryHelpers', () => ({
  getQueryStringForDateRange: jest.fn((dateRange: DateRange) => {
    const startDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : '';
    const endDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : '';
    return `startDate=${startDate}&endDate=${endDate}`;
  }),
}));

describe('cashFlowEntryRequests', () => {
  const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
  const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCashFlowEntriesByDateRangeAndType', () => {
    const mockDateRange: DateRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    };

    it('fetches cash flow entries for income type', async () => {
      const mockResponse: GetRequestResultList<unknown> = {
        successful: true,
        data: [
          { id: 1, name: 'Entry 1', entryType: 'Income' },
          { id: 2, name: 'Entry 2', entryType: 'Income' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income');

      expect(mockGetRequestList).toHaveBeenCalledWith(
        '/api/v1/cash-flow-entries?entryType=Income&startDate=2024-01-01&endDate=2024-01-31'
      );
      expect(result).toEqual(mockResponse);
    });

    it('fetches cash flow entries for expense type', async () => {
      const mockResponse: GetRequestResultList<unknown> = {
        successful: true,
        data: [
          { id: 1, name: 'Entry 1', entryType: 'Expense' },
          { id: 2, name: 'Entry 2', entryType: 'Expense' },
        ],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Expense');

      expect(mockGetRequestList).toHaveBeenCalledWith(
        '/api/v1/cash-flow-entries?entryType=Expense&startDate=2024-01-01&endDate=2024-01-31'
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles failed request', async () => {
      const mockResponse: GetRequestResultList<unknown> = {
        successful: false,
        data: null,
        responseMessage: 'Failed to fetch entries',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income');

      expect(result).toEqual(mockResponse);
    });

    it('handles request error', async () => {
      const mockError = new Error('Network error');
      mockGetRequestList.mockRejectedValue(mockError);

      await expect(getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income')).rejects.toThrow('Network error');
    });

    it('handles different date ranges', async () => {
      const differentDateRange: DateRange = {
        from: new Date('2024-02-01'),
        to: new Date('2024-02-29'),
      };

      const mockResponse: GetRequestResultList<unknown> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      await getCashFlowEntriesByDateRangeAndType(differentDateRange, 'Income');

      expect(mockGetRequestList).toHaveBeenCalledWith(
        '/api/v1/cash-flow-entries?entryType=Income&startDate=2024-02-01&endDate=2024-02-29'
      );
    });

    it('handles empty response data', async () => {
      const mockResponse: GetRequestResultList<unknown> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income');

      expect(result).toEqual(mockResponse);
    });

    it('handles undefined date range', async () => {
      const undefinedDateRange: DateRange = {
        from: undefined,
        to: undefined,
      };

      const mockResponse: GetRequestResultList<unknown> = {
        successful: true,
        data: [],
        responseMessage: 'Success',
      };

      mockGetRequestList.mockResolvedValue(mockResponse);

      await getCashFlowEntriesByDateRangeAndType(undefinedDateRange, 'Income');

      expect(mockGetRequestList).toHaveBeenCalledWith(
        '/api/v1/cash-flow-entries?entryType=Income&startDate=&endDate='
      );
    });
  });

  describe('deleteCashFlowEntry', () => {
    it('deletes cash flow entry successfully', async () => {
      const mockResponse = {
        successful: true,
        data: null,
        responseMessage: 'Entry deleted successfully',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteCashFlowEntry(1);

      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/v1/cash-flow-entries', 1);
      expect(result).toEqual(mockResponse);
    });

    it('handles delete failure', async () => {
      const mockResponse = {
        successful: false,
        data: null,
        responseMessage: 'Failed to delete entry',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteCashFlowEntry(1);

      expect(result).toEqual(mockResponse);
    });

    it('handles delete error', async () => {
      const mockError = new Error('Delete failed');
      mockDeleteRequest.mockRejectedValue(mockError);

      await expect(deleteCashFlowEntry(1)).rejects.toThrow('Delete failed');
    });

    it('handles different entry IDs', async () => {
      const mockResponse = {
        successful: true,
        data: null,
        responseMessage: 'Entry deleted successfully',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      await deleteCashFlowEntry(123);

      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/v1/cash-flow-entries', 123);
    });

    it('handles zero ID', async () => {
      const mockResponse = {
        successful: false,
        data: null,
        responseMessage: 'Invalid ID',
      };

      mockDeleteRequest.mockResolvedValue(mockResponse);

      const result = await deleteCashFlowEntry(0);

      expect(mockDeleteRequest).toHaveBeenCalledWith('/api/v1/cash-flow-entries', 0);
      expect(result).toEqual(mockResponse);
    });
  });
}); 