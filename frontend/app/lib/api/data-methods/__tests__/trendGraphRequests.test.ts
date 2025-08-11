import { getCashFlowTrendGraphForDateRange, getNetWorthTrendGraphForDateRange } from '../trendGraphRequests';
import { getRequestSingle } from '../../rest-methods';
import { getQueryStringForDateRange } from '../queryHelpers';
import { CashFlowTrendGraphData } from '@/app/dashboards/cashflow/components/CashFlowTrendGraphData';
import { NetWorthTrendGraphData } from '@/app/dashboards/net-worth/components/NetWorthTrendGraphData';

jest.mock('../../rest-methods');
jest.mock('../queryHelpers');

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
        labels: ['Jan 1', 'Jan 2'],
        datasets: [{ label: 'Income', data: [1000, 1500] }]
      };

      mockGetRequestSingle.mockResolvedValue(mockData);

      const result = await getCashFlowTrendGraphForDateRange(mockDateRange);

      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        `CashFlowTrendGraph?startDate=2024-01-01&endDate=2024-01-31`
      );
      expect(result).toEqual(mockData);
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
        labels: ['Jan 1', 'Jan 2'],
        datasets: [{ label: 'Net Worth', data: [50000, 52000] }]
      };

      mockGetRequestSingle.mockResolvedValue(mockData);

      const result = await getNetWorthTrendGraphForDateRange(mockDateRange);

      expect(mockGetQueryStringForDateRange).toHaveBeenCalledWith(mockDateRange);
      expect(mockGetRequestSingle).toHaveBeenCalledWith(
        `NetWorthTrendGraph?startDate=2024-01-01&endDate=2024-01-31`
      );
      expect(result).toEqual(mockData);
    });

    it('handles errors from getRequestSingle', async () => {
      const error = new Error('API Error');
      mockGetRequestSingle.mockRejectedValue(error);

      await expect(getNetWorthTrendGraphForDateRange(mockDateRange)).rejects.toThrow('API Error');
    });
  });
});
