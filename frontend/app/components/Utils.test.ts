import {
  numberRegex,
  MESSAGE_TYPE_ERROR,
  MESSAGE_TYPE_INFO,
  messageTypeIsError,
  messageTypeIsInfo,
  convertDollarsToCents,
  convertCentsToDollars,
  getCurrentMonthRange,
  getCurrentYearRange,
  cleanCurrencyInput,
  formatDate,
  convertDateToISOString,
  replaceSpacesWithDashes,
} from './Utils';

describe('Utils', () => {
  describe('Message Type Functions', () => {
    it('correctly identifies error messages', () => {
      expect(messageTypeIsError({ type: 'ERROR', text: 'Error message' })).toBe(true);
      expect(messageTypeIsError({ type: 'INFO', text: 'Info message' })).toBe(false);
      expect(messageTypeIsError({ type: null, text: 'No type' })).toBe(false);
    });

    it('correctly identifies info messages', () => {
      expect(messageTypeIsInfo({ type: 'INFO', text: 'Info message' })).toBe(true);
      expect(messageTypeIsInfo({ type: 'ERROR', text: 'Error message' })).toBe(false);
      expect(messageTypeIsInfo({ type: null, text: 'No type' })).toBe(false);
    });
  });

  describe('Currency Conversion Functions', () => {
    it('converts dollars to cents correctly', () => {
      expect(convertDollarsToCents('100.50')).toBe(10050);
      expect(convertDollarsToCents('0.99')).toBe(99);
      expect(convertDollarsToCents('0')).toBe(0);
      expect(convertDollarsToCents('1000')).toBe(100000);
    });

    it('returns null for invalid dollar amounts', () => {
      expect(convertDollarsToCents('invalid')).toBe(null);
      expect(convertDollarsToCents('')).toBe(null);
      expect(convertDollarsToCents('abc123')).toBe(null);
    });

    it('converts cents to dollars correctly', () => {
      expect(convertCentsToDollars(10050)).toBe('$100.50');
      expect(convertCentsToDollars(99)).toBe('$0.99');
      expect(convertCentsToDollars(0)).toBe('$0.00');
      expect(convertCentsToDollars(100000)).toBe('$1,000.00');
    });

    it('handles negative cents correctly', () => {
      expect(convertCentsToDollars(-10050)).toBe('-$100.50');
      expect(convertCentsToDollars(-99)).toBe('-$0.99');
    });
  });

  describe('Date Range Functions', () => {
    it('gets current month range correctly', () => {
      const testDate = new Date('2024-01-15');
      const result = getCurrentMonthRange(testDate);
      
      expect(result.from).toEqual(new Date(2024, 0, 1));
      expect(result.to).toEqual(new Date(2024, 0, 31));
    });

    it('gets current year range correctly', () => {
      const testDate = new Date('2024-06-15');
      const result = getCurrentYearRange(testDate);
      
      expect(result.from).toEqual(new Date(2024, 0, 1));
      expect(result.to).toEqual(new Date(2024, 11, 31));
    });
  });

  describe('Currency Input Cleaning', () => {
    it('cleans valid currency input', () => {
      expect(cleanCurrencyInput('100.50')).toBe('100.50');
      expect(cleanCurrencyInput('0.99')).toBe('0.99');
      expect(cleanCurrencyInput('1000')).toBe('1000');
      expect(cleanCurrencyInput('1,234.56')).toBe('1234.56');
    });

    it('handles invalid currency input', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12');
      expect(cleanCurrencyInput('100..50')).toBe(null);
      expect(cleanCurrencyInput('abc')).toBe('');
      expect(cleanCurrencyInput('100.50.75')).toBe(null);
    });

    it('removes leading zeros correctly', () => {
      expect(cleanCurrencyInput('00100.50')).toBe('0100.50');
      expect(cleanCurrencyInput('00.50')).toBe('0.50');
      expect(cleanCurrencyInput('0.50')).toBe('0.50');
    });

    it('limits decimal places to two', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12');
      expect(cleanCurrencyInput('100.1')).toBe('100.1');
      expect(cleanCurrencyInput('100.12')).toBe('100.12');
    });
  });

  describe('Date Formatting Functions', () => {
    it('formats date correctly', () => {
      const testDate = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(testDate)).toBe('January 15, 2024');
    });

    it('formats date without day when noDay is true', () => {
      const testDate = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(testDate, true)).toBe('January 2024');
    });

    it('returns undefined for undefined date', () => {
      expect(formatDate(undefined)).toBeUndefined();
    });

    it('converts date to ISO string correctly', () => {
      const testDate = new Date('2024-01-15');
      expect(convertDateToISOString(testDate)).toBe('2024-01-15');
    });

    it('returns empty string for undefined date', () => {
      expect(convertDateToISOString(undefined)).toBe('');
    });
  });

  describe('String Utility Functions', () => {
    it('replaces spaces with dashes correctly', () => {
      expect(replaceSpacesWithDashes('Cash Flow')).toBe('Cash-Flow');
      expect(replaceSpacesWithDashes('Net Worth')).toBe('Net-Worth');
      expect(replaceSpacesWithDashes('Monthly Budget')).toBe('Monthly-Budget');
      expect(replaceSpacesWithDashes('NoSpaces')).toBe('NoSpaces');
    });

    it('handles multiple spaces correctly', () => {
      expect(replaceSpacesWithDashes('Cash  Flow')).toBe('Cash-Flow');
      expect(replaceSpacesWithDashes('  Leading Spaces')).toBe('-Leading-Spaces');
      expect(replaceSpacesWithDashes('Trailing Spaces  ')).toBe('Trailing-Spaces-');
    });

    it('handles empty string', () => {
      expect(replaceSpacesWithDashes('')).toBe('');
    });
  });
}); 