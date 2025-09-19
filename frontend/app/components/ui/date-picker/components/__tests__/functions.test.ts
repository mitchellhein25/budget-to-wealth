import {
  handleFromChange,
  handleToChange,
  handleMonthChange,
  handleYearChange,
  handleSetRange,
  hasChanges,
  minYearOption,
  maxYearOption
} from '@/app/components/ui/date-picker/components/functions';
import { DateRange } from '@/app/components';

import { 
  convertDateToISOString, 
  convertToDate, 
  datesAreFullMonthRange, 
  getFullMonthRange 
} from '@/app/lib/utils';

jest.mock('@/app/lib/utils', () => ({
  convertDateToISOString: jest.fn((date) => date?.toISOString().slice(0, 10) ?? ''),
  convertToDate: jest.fn((date: string, noMonthAdjustment?: boolean) => {
    if (!date) return new Date();
    const [year, month, day] = date.split('-').map(Number);
    const adjustedMonth = noMonthAdjustment ? month : month - 1;
    return new Date(Date.UTC(year, adjustedMonth, day, 12));
  }),
  datesAreFullMonthRange: jest.fn((from: string, to: string) => {
    if (!from || !to) return false;
    const fromParts = from.split('-');
    const toParts = to.split('-');
    
    if (fromParts.length !== 3 || toParts.length !== 3) return false;
    
    const fromYear = parseInt(fromParts[0], 10);
    const fromMonth = parseInt(fromParts[1], 10);
    const fromDate = parseInt(fromParts[2], 10);
    const toYear = parseInt(toParts[0], 10);
    const toMonth = parseInt(toParts[1], 10);
    const toDate = parseInt(toParts[2], 10);
    
    if (fromYear === toYear && fromMonth === toMonth) {
      const lastDayOfMonth = new Date(fromYear, fromMonth, 0).getDate();
      return fromDate === 1 && toDate === lastDayOfMonth;
    }
    return false;
  }),
  getFullMonthRange: jest.fn((date: Date) => ({
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  })),
}));

const mockDatesAreFullMonthRange = datesAreFullMonthRange as jest.MockedFunction<typeof datesAreFullMonthRange>;
const mockConvertToDate = convertToDate as jest.MockedFunction<typeof convertToDate>;
const mockGetFullMonthRange = getFullMonthRange as jest.MockedFunction<typeof getFullMonthRange>;
const mockConvertDateToISOString = convertDateToISOString as jest.MockedFunction<typeof convertDateToISOString>;

describe('DatePicker Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Year Options', () => {
    it('sets correct min and max year options', () => {
      const currentYear = new Date().getFullYear();
      expect(minYearOption).toBe(currentYear - 20);
      expect(maxYearOption).toBe(currentYear + 20);
    });
  });

  describe('handleFromChange', () => {
    const mockSetFromInputValue = jest.fn();
    const mockSetSelectedMonth = jest.fn();
    const mockSetSelectedYear = jest.fn();
    const mockEvent = { target: { value: '2024-01-15' } } as React.ChangeEvent<HTMLInputElement>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls setter with new value', () => {
      handleFromChange(mockEvent, mockSetFromInputValue, '2024-01-31', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetFromInputValue).toHaveBeenCalledWith('2024-01-15');
    });

    it('clears month and year when not a full month range', () => {
      mockDatesAreFullMonthRange.mockReturnValue(false);

      handleFromChange(mockEvent, mockSetFromInputValue, '2024-01-20', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('');
    });

    it('sets month and year when dates form a full month range', () => {
      
      mockDatesAreFullMonthRange.mockReturnValue(true);
      mockConvertToDate.mockReturnValue(new Date(Date.UTC(2024, 0, 1, 12))); // January 1, 2024

      handleFromChange(mockEvent, mockSetFromInputValue, '2024-01-31', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('0'); // getUTCMonth() returns 0 for January
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2024');
    });
  });

  describe('handleToChange', () => {
    const mockSetToInputValue = jest.fn();
    const mockSetSelectedMonth = jest.fn();
    const mockSetSelectedYear = jest.fn();
    const mockEvent = { target: { value: '2024-01-31' } } as React.ChangeEvent<HTMLInputElement>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls setter with new value', () => {
      handleToChange(mockEvent, mockSetToInputValue, '2024-01-01', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetToInputValue).toHaveBeenCalledWith('2024-01-31');
    });

    it('clears month and year when not a full month range', () => {
      mockDatesAreFullMonthRange.mockReturnValue(false);

      handleToChange(mockEvent, mockSetToInputValue, '2024-01-15', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('');
    });

    it('sets month and year when dates form a full month range', () => {
      
      mockDatesAreFullMonthRange.mockReturnValue(true);
      mockConvertToDate.mockReturnValue(new Date(Date.UTC(2024, 0, 1, 12))); // January 1, 2024

      handleToChange(mockEvent, mockSetToInputValue, '2024-01-01', mockSetSelectedMonth, mockSetSelectedYear);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('0');
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2024');
    });
  });

  describe('handleMonthChange', () => {
    const mockSetSelectedMonth = jest.fn();
    const mockSetFromInputValue = jest.fn();
    const mockSetToInputValue = jest.fn();
    const mockEvent = { target: { value: '3' } } as React.ChangeEvent<HTMLSelectElement>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets selected month value', () => {
      handleMonthChange(mockEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('3');
    });

    it('updates date range when both month and year are provided', () => {
      
      mockGetFullMonthRange.mockReturnValue({
        from: new Date(2024, 2, 1), // March 1, 2024
        to: new Date(2024, 2, 31)   // March 31, 2024
      });
      mockConvertDateToISOString.mockReturnValueOnce('2024-03-01').mockReturnValueOnce('2024-03-31');

      handleMonthChange(mockEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetFromInputValue).toHaveBeenCalledWith('2024-03-01');
      expect(mockSetToInputValue).toHaveBeenCalledWith('2024-03-31');
    });

    it('does not update date range when year is empty', () => {
      handleMonthChange(mockEvent, mockSetSelectedMonth, '', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('3');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });

    it('handles empty month selection', () => {
      const emptyMonthEvent = { target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>;
      
      handleMonthChange(emptyMonthEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('');
    });
  });

  describe('handleYearChange', () => {
    const mockSetSelectedYear = jest.fn();
    const mockSetFromInputValue = jest.fn();
    const mockSetToInputValue = jest.fn();
    const mockEvent = { target: { value: '2024' } } as React.ChangeEvent<HTMLInputElement>;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets selected year value', () => {
      handleYearChange(mockEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2024');
    });

    it('updates date range when year is valid and within range', () => {
      
      mockGetFullMonthRange.mockReturnValue({
        from: new Date(2024, 2, 1),
        to: new Date(2024, 2, 31)
      });
      mockConvertDateToISOString.mockReturnValueOnce('2024-03-01').mockReturnValueOnce('2024-03-31');

      handleYearChange(mockEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetFromInputValue).toHaveBeenCalledWith('2024-03-01');
      expect(mockSetToInputValue).toHaveBeenCalledWith('2024-03-31');
    });

    it('does not update date range when year is below minimum', () => {
      const invalidYearEvent = { target: { value: '2000' } } as React.ChangeEvent<HTMLInputElement>;
      
      handleYearChange(invalidYearEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2000');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });

    it('does not update date range when year is above maximum', () => {
      const invalidYearEvent = { target: { value: '2050' } } as React.ChangeEvent<HTMLInputElement>;
      
      handleYearChange(invalidYearEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2050');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });

    it('does not update date range when month is empty', () => {
      handleYearChange(mockEvent, mockSetSelectedYear, '', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('2024');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });

    it('handles invalid year input', () => {
      const invalidYearEvent = { target: { value: 'abc' } } as React.ChangeEvent<HTMLInputElement>;
      
      handleYearChange(invalidYearEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('abc');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });

    it('handles empty year input', () => {
      const emptyYearEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      
      handleYearChange(emptyYearEvent, mockSetSelectedYear, '3', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockSetSelectedYear).toHaveBeenCalledWith('');
      expect(mockSetFromInputValue).not.toHaveBeenCalled();
      expect(mockSetToInputValue).not.toHaveBeenCalled();
    });
  });

  describe('handleSetRange', () => {
    const mockSetDateRange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('sets date range with valid dates', () => {
      handleSetRange('2024-01-01', '2024-01-31', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31')
      });
    });

    it('sets undefined for invalid from date', () => {
      handleSetRange('invalid-date', '2024-01-31', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: undefined,
        to: new Date('2024-01-31')
      });
    });

    it('sets undefined for invalid to date', () => {
      handleSetRange('2024-01-01', 'invalid-date', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: undefined
      });
    });

    it('sets undefined for both dates when both are invalid', () => {
      handleSetRange('invalid-from', 'invalid-to', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined
      });
    });

    it('handles empty date strings', () => {
      handleSetRange('', '', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined
      });
    });

    it('handles mixed empty and valid dates', () => {
      handleSetRange('2024-01-01', '', mockSetDateRange);
      
      expect(mockSetDateRange).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: undefined
      });
    });
  });

  describe('hasChanges', () => {
    const baseDateRange: DateRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31')
    };

    it('returns false when no changes in date range mode', () => {
      const result = hasChanges('2024-01-01', '2024-01-31', baseDateRange, true);
      expect(result).toBe(false);
    });

    it('returns true when from date changes in date range mode', () => {
      const result = hasChanges('2024-01-15', '2024-01-31', baseDateRange, true);
      expect(result).toBe(true);
    });

    it('returns true when to date changes in date range mode', () => {
      const result = hasChanges('2024-01-01', '2024-01-15', baseDateRange, true);
      expect(result).toBe(true);
    });

    it('returns true when both dates change in date range mode', () => {
      const result = hasChanges('2024-02-01', '2024-02-28', baseDateRange, true);
      expect(result).toBe(true);
    });

    it('returns false when no changes in month/year mode', () => {
      const result = hasChanges('2024-01-01', '2024-01-31', baseDateRange, false);
      expect(result).toBe(false);
    });

    it('returns true when dates change in month/year mode', () => {
      const result = hasChanges('2024-02-01', '2024-02-29', baseDateRange, false);
      expect(result).toBe(true);
    });

    it('handles undefined dates in dateRange', () => {
      const emptyDateRange: DateRange = { from: undefined, to: undefined };
      
      const result = hasChanges('', '', emptyDateRange, true);
      expect(result).toBe(false);
    });

    it('returns true when input values differ from undefined dateRange', () => {
      const emptyDateRange: DateRange = { from: undefined, to: undefined };
      
      const result = hasChanges('2024-01-01', '', emptyDateRange, true);
      expect(result).toBe(true);
    });

    it('handles mixed undefined and defined dates', () => {
      const partialDateRange: DateRange = { from: new Date('2024-01-01'), to: undefined };
      
      const result1 = hasChanges('2024-01-01', '', partialDateRange, true);
      expect(result1).toBe(false);
      
      const result2 = hasChanges('2024-01-15', '', partialDateRange, true);
      expect(result2).toBe(true);
    });

    it('behaves identically for both showSpecificDateRange modes', () => {
      // Both branches of the if statement have identical logic
      const result1 = hasChanges('2024-01-15', '2024-01-31', baseDateRange, true);
      const result2 = hasChanges('2024-01-15', '2024-01-31', baseDateRange, false);
      
      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('handles year boundaries correctly', () => {
      const currentYear = new Date().getFullYear();
      
      expect(minYearOption).toBe(currentYear - 20);
      expect(maxYearOption).toBe(currentYear + 20);
      
      // Test boundary year validation in handleYearChange
      const mockSetSelectedYear = jest.fn();
      const mockSetFromInputValue = jest.fn();
      const mockSetToInputValue = jest.fn();

      // Test minimum boundary
      const minYearEvent = { target: { value: minYearOption.toString() } } as React.ChangeEvent<HTMLInputElement>;
      handleYearChange(minYearEvent, mockSetSelectedYear, '1', mockSetFromInputValue, mockSetToInputValue);
      expect(mockSetFromInputValue).toHaveBeenCalled();

      jest.clearAllMocks();

      // Test maximum boundary
      const maxYearEvent = { target: { value: maxYearOption.toString() } } as React.ChangeEvent<HTMLInputElement>;
      handleYearChange(maxYearEvent, mockSetSelectedYear, '1', mockSetFromInputValue, mockSetToInputValue);
      expect(mockSetFromInputValue).toHaveBeenCalled();
    });

    it('handles month boundary values', () => {
      const mockSetSelectedMonth = jest.fn();
      const mockSetFromInputValue = jest.fn();
      const mockSetToInputValue = jest.fn();

      // Test first month
      const firstMonthEvent = { target: { value: '1' } } as React.ChangeEvent<HTMLSelectElement>;
      handleMonthChange(firstMonthEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('1');

      jest.clearAllMocks();

      // Test last month
      const lastMonthEvent = { target: { value: '12' } } as React.ChangeEvent<HTMLSelectElement>;
      handleMonthChange(lastMonthEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      expect(mockSetSelectedMonth).toHaveBeenCalledWith('12');
    });

    it('handles leap year February correctly', () => {
      
      mockGetFullMonthRange.mockReturnValue({
        from: new Date(2024, 1, 1), // Feb 1, 2024 (leap year)
        to: new Date(2024, 1, 29)   // Feb 29, 2024
      });
      mockConvertDateToISOString.mockReturnValueOnce('2024-02-01').mockReturnValueOnce('2024-02-29');

      const mockSetSelectedMonth = jest.fn();
      const mockSetFromInputValue = jest.fn();
      const mockSetToInputValue = jest.fn();
      const februaryEvent = { target: { value: '2' } } as React.ChangeEvent<HTMLSelectElement>;

      handleMonthChange(februaryEvent, mockSetSelectedMonth, '2024', mockSetFromInputValue, mockSetToInputValue);
      
      expect(mockGetFullMonthRange).toHaveBeenCalledWith(new Date(2024, 1, 1, 12));
    });

    it('handles date validation edge cases', () => {
      const mockSetDateRange = jest.fn();

      // Test various invalid date formats
      const invalidDates = ['2024-13-01', '2024-01-32', '2024-02-30', 'not-a-date', '2024/01/01'];
      
      invalidDates.forEach(invalidDate => {
        jest.clearAllMocks();
        handleSetRange(invalidDate, '2024-01-31', mockSetDateRange);
        
        expect(mockSetDateRange).toHaveBeenCalledWith({
          from: undefined,
          to: new Date('2024-01-31')
        });
      });
    });
  });
});
