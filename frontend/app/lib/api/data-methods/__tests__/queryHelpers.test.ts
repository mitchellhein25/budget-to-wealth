import { getQueryStringForDateRange } from '@/app/lib/api';
import { convertDateToISOString } from '@/app/lib/utils';

jest.mock('@/app/lib/utils', () => ({
  convertDateToISOString: jest.fn((date) => date.toISOString().split('T')[0]),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-')),
}));

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    EVERY_2_WEEKS: 'EVERY_2_WEEKS',
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    YEARLY: 'YEARLY'
  }
}));

const mockConvertDateToISOString = convertDateToISOString as jest.MockedFunction<typeof convertDateToISOString>;

describe('queryHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQueryStringForDateRange', () => {
    it('returns correct query string for valid date range', () => {
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

    it('handles same date for from and to', () => {
      const mockDateRange = {
        from: new Date('2024-01-01'),
        to: new Date('2024-01-01')
      };

      mockConvertDateToISOString
        .mockReturnValue('2024-01-01');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=2024-01-01&endDate=2024-01-01');
    });

    it('handles leap year dates', () => {
      const mockDateRange = {
        from: new Date('2024-02-29'),
        to: new Date('2024-03-01')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('2024-02-29')
        .mockReturnValueOnce('2024-03-01');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=2024-02-29&endDate=2024-03-01');
    });

    it('handles year boundary dates', () => {
      const mockDateRange = {
        from: new Date('2023-12-31'),
        to: new Date('2024-01-01')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('2023-12-31')
        .mockReturnValueOnce('2024-01-01');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=2023-12-31&endDate=2024-01-01');
    });

    it('handles future dates', () => {
      const mockDateRange = {
        from: new Date('2030-01-01'),
        to: new Date('2030-12-31')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('2030-01-01')
        .mockReturnValueOnce('2030-12-31');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=2030-01-01&endDate=2030-12-31');
    });

    it('handles past dates', () => {
      const mockDateRange = {
        from: new Date('1990-01-01'),
        to: new Date('1990-12-31')
      };

      mockConvertDateToISOString
        .mockReturnValueOnce('1990-01-01')
        .mockReturnValueOnce('1990-12-31');

      const result = getQueryStringForDateRange(mockDateRange);

      expect(result).toBe('startDate=1990-01-01&endDate=1990-12-31');
    });
  });
});
