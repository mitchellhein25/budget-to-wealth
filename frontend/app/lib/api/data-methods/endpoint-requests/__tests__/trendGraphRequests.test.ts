import { FetchResult, getCashFlowTrendGraphForDateRange, getNetWorthTrendGraphForDateRange,getQueryStringForDateRange, getRequestSingle } from '@/app/lib/api';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/components';
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/components';

jest.mock('@/app/lib/api/rest-methods/getRequest', () => ({
  getRequestSingle: jest.fn(),
}));

jest.mock('@/app/lib/api/data-methods/queryHelpers', () => ({
  getQueryStringForDateRange: jest.fn(),
}));

const createMockFetchResult = <T>(data: T): FetchResult<T> => ({
  data,
  responseMessage: 'Success',
  successful: true,
});

const mockGetRequestSingle = getRequestSingle as jest.MockedFunction<typeof getRequestSingle>;
const mockGetQueryStringForDateRange = getQueryStringForDateRange as jest.MockedFunction<typeof getQueryStringForDateRange>;

describe('trendGraphRequests', () => {
  let mockDateRange: { from: Date; to: Date };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDateRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31')
    };
    mockGetQueryStringForDateRange.mockReturnValue('startDate=2024-01-01&endDate=2024-01-31');
  });

  describe('getCashFlowTrendGraphForDateRange', () => {
    it('calls getRequestSingle with correct endpoint and query string', async () => {
        const mockData: CashFlowTrendGraphData = {
        entries: [
          { date: '2024-01-01', incomeInCents: 1000, expensesInCents: 500, netCashFlowInCents: 500 },
          { date: '2024-01-02', incomeInCents: 1500, expensesInCents: 750, netCashFlowInCents: 750 },
        ]
      };

      mockGetRequestSingle.mockResolvedValue(createMockFetchResult(mockData));

      const result = await getCashFlowTrendGraphForDateRange(mockDateRange);

      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        `CashFlowTrendGraph?startDate=2024-01-01&endDate=2024-01-31`
      );
      expect(result).toEqual(createMockFetchResult(mockData));
    });

    it('handles errors from getRequestSingle', async () => {
      const error = new Error('API Error');
      mockGetRequestSingle.mockRejectedValue(error);

      await expect(getCashFlowTrendGraphForDateRange(mockDateRange)).rejects.toThrow('API Error');
    });
  });

  describe('getNetWorthTrendGraphForDateRange', () => {
    it('calls getRequestSingle with correct endpoint and query string', async () => {
      const mockData: NetWorthTrendGraphData = {
        entries: [
          { date: '2024-01-01', assetValueInCents: 50000, debtValueInCents: 10000, netWorthInCents: 40000 },
          { date: '2024-01-02', assetValueInCents: 52000, debtValueInCents: 10400, netWorthInCents: 41600 },
        ]
      };

      mockGetRequestSingle.mockResolvedValue(createMockFetchResult(mockData));

      const result = await getNetWorthTrendGraphForDateRange(mockDateRange);

      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        `NetWorthTrendGraph?startDate=2024-01-01&endDate=2024-01-31`
      );
      expect(result.data).toEqual(mockData);
    });

    it('handles errors from getRequestSingle', async () => {
      const error = new Error('API Error');
      mockGetRequestSingle.mockRejectedValue(error);

      await expect(getNetWorthTrendGraphForDateRange(mockDateRange)).rejects.toThrow('API Error');
    });
  });
});
