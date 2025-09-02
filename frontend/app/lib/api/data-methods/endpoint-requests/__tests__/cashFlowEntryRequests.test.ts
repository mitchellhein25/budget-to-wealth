import { DateRange } from '@/app/components';
import { CashFlowEntry } from '@/app/cashflow/components';
import { getRequestList, getRequestSingle, deleteRequest, getCashFlowEntriesByDateRangeAndType, deleteCashFlowEntry, getCashFlowEntriesDateRange, getQueryStringForDateRange, DateRangeResponse, CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT, CASH_FLOW_ENTRIES_ENDPOINT, FetchResult } from '@/app/lib/api';

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestList: jest.fn(),
  getRequestSingle: jest.fn()
}));

jest.mock('@/app/lib/api/rest-methods/deleteRequest', () => ({
  deleteRequest: jest.fn(),
}));


jest.mock('@/app/lib/api/queryHelpers', () => ({
  getQueryStringForDateRange: jest.fn(),
}));

jest.mock('@/app/lib/api/endpoints', () => ({
  CASH_FLOW_ENTRIES_ENDPOINT: 'CashFlowEntries',
  CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT: 'CashFlowEntries/AvailableDateRange',
}));

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

const mockGetRequestList = getRequestList as jest.MockedFunction<typeof getRequestList>;
const mockGetRequestSingle = getRequestSingle as jest.MockedFunction<typeof getRequestSingle>;
const mockDeleteRequest = deleteRequest as jest.MockedFunction<typeof deleteRequest>;
const mockGetQueryStringForDateRange = getQueryStringForDateRange as jest.MockedFunction<typeof getQueryStringForDateRange>;

describe('Cash Flow Entry Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCashFlowEntriesByDateRangeAndType', () => {
    it('calls getRequestList with correct endpoint and query parameters for income', async () => {
      const mockDateRange: DateRange = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
      const mockQueryString = 'startDate=2024-01-01&endDate=2024-01-31';
      const mockEntries: CashFlowEntry[] = [
        { id: 1, amount: 1000, date: '2024-01-15', entryType: 'Income', categoryId: '1' },
        { id: 2, amount: 1500, date: '2024-01-20', entryType: 'Income', categoryId: '2' },
      ];
      
      mockGetQueryStringForDateRange.mockReturnValue(mockQueryString);
      mockGetRequestList.mockResolvedValue(createMockFetchResult(mockEntries));
      
      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income');
      
      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestList).toHaveBeenCalledWith(`${CASH_FLOW_ENTRIES_ENDPOINT}?entryType=Income&${mockQueryString}`);
      expect(result.data).toEqual(mockEntries);
    });

    it('calls getRequestList with correct endpoint and query parameters for expenses', async () => {
      const mockDateRange: DateRange = { from: new Date('2024-02-01'), to: new Date('2024-02-28') };
      const mockQueryString = 'startDate=2024-02-01&endDate=2024-02-28';
      const mockEntries: CashFlowEntry[] = [
        { id: 3, amount: 500, date: '2024-02-10', entryType: 'Expense', categoryId: '3' },
        { id: 4, amount: 750, date: '2024-02-15', entryType: 'Expense', categoryId: '4' },
      ];
      
      mockGetQueryStringForDateRange.mockReturnValue(mockQueryString);
      mockGetRequestList.mockResolvedValue(createMockFetchResult(mockEntries));
      
      const result = await getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Expense');
      
      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestList).toHaveBeenCalledWith(`${CASH_FLOW_ENTRIES_ENDPOINT}?entryType=Expense&${mockQueryString}`);
      expect(result.data).toEqual(mockEntries);
    });

    it('handles errors from getRequestList', async () => {
      const mockDateRange: DateRange = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
      const mockError = new Error('API Error');
      
      mockGetQueryStringForDateRange.mockReturnValue('startDate=2024-01-01&endDate=2024-01-31');
      mockGetRequestList.mockRejectedValue(mockError);
      
      await expect(getCashFlowEntriesByDateRangeAndType(mockDateRange, 'Income')).rejects.toThrow('API Error');
    });
  });

  describe('deleteCashFlowEntry', () => {
    it('calls deleteRequest with correct endpoint and id', async () => {
      const mockDeletedEntry: CashFlowEntry = { id: 1, amount: 1000, date: '2024-01-15', entryType: 'Income', categoryId: '1' };
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedEntry));
      
      const result = await deleteCashFlowEntry(1);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(CASH_FLOW_ENTRIES_ENDPOINT, 1);
      expect(result.data).toEqual(mockDeletedEntry);
    });

    it('handles errors from deleteRequest', async () => {
      const mockError = new Error('Delete Error');
      mockDeleteRequest.mockRejectedValue(mockError);
      
      await expect(deleteCashFlowEntry(1)).rejects.toThrow('Delete Error');
    });

    it('works with different id values', async () => {
      const mockDeletedEntry: CashFlowEntry = { id: 999, amount: 5000, date: '2024-01-01', entryType: 'Expense', categoryId: '999' };
      mockDeleteRequest.mockResolvedValue(createMockFetchResult(mockDeletedEntry));
      
      const result = await deleteCashFlowEntry(999);
      
      expect(mockDeleteRequest).toHaveBeenCalledWith(CASH_FLOW_ENTRIES_ENDPOINT, 999);
      expect(result.data).toEqual(mockDeletedEntry);
    });
  });

  describe('getCashFlowEntriesDateRange', () => {
    it('calls getRequestSingle with correct endpoint', async () => {
      const mockDateRange: DateRangeResponse = { startDate: '2024-01-01', endDate: '2024-12-31' };
      mockGetRequestSingle.mockResolvedValue(createMockFetchResult(mockDateRange));
      
      const result = await getCashFlowEntriesDateRange();
      
      expect(mockGetRequestSingle).toHaveBeenCalledWith(CASH_FLOW_ENTRIES_AVAILABLE_DATE_RANGE_ENDPOINT);
      expect(result.data).toEqual(mockDateRange);
    });

    it('handles errors from getRequestSingle', async () => {
      const mockError = new Error('API Error');
      mockGetRequestSingle.mockRejectedValue(mockError);
      
      await expect(getCashFlowEntriesDateRange()).rejects.toThrow('API Error');
    });
  });
});
