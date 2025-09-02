import { getQueryStringForDateRange } from '@/app/lib/api';
import { convertDateToISOString } from '@/app/components';

jest.mock('@/app/components');

const mockConvertDateToISOString = convertDateToISOString as jest.MockedFunction<typeof convertDateToISOString>;

describe('queryHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQueryStringForDateRange', () => {
    it('returns correct query string for date range', () => {
      const mockDateRange = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('2024-01-01')
        .mockReturnValueOnce('2024-01-31');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(mockConvertDateToISOString).toHaveBeenCalledWith(mockDateRange.from);
      expect(mockConvertDateToISOString).toHaveBeenCalledWith(mockDateRange.to);
      expect(result).toBe('startDate=2024-01-01&endDate=2024-01-31');
    });

    it('handles different date formats correctly', () => {
      const mockDateRange = {
        from: new Date('2023-12-15'),
        to: new Date('2024-02-20')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('2023-12-15')
        .mockReturnValueOnce('2024-02-20');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=2023-12-15&endDate=2024-02-20');
    });
  });
});
