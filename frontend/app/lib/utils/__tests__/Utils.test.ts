import {
  currencyRegex,
  percentageRegex,
  MessageType,
  messageTypeIsError,
  messageTypeIsInfo,
  convertDollarsToCents,
  convertCentsToDollars,
  getFullMonthRange,
  getFullYearRange,
  convertToDate,
  cleanCurrencyInput,
  cleanPercentageInput,
  formatDate,
  convertToDateMonthYear,
  convertDateToISOString,
  replaceSpacesWithDashes,
} from '@/app/lib/utils';

describe('Utils', () => {
  describe('currencyRegex', () => {
    it('matches valid currency formats', () => {
      expect(currencyRegex.test('100')).toBe(true);
      expect(currencyRegex.test('100.50')).toBe(true);
      expect(currencyRegex.test('100.5')).toBe(true);
      expect(currencyRegex.test('0')).toBe(true);
      expect(currencyRegex.test('0.00')).toBe(true);
    });

    it('does not match invalid currency formats', () => {
      expect(currencyRegex.test('100.123')).toBe(false);
      expect(currencyRegex.test('abc')).toBe(false);
      expect(currencyRegex.test('.50')).toBe(false);
    });
  });

  describe('percentageRegex', () => {
    it('matches valid percentage formats', () => {
      expect(percentageRegex.test('100')).toBe(true);
      expect(percentageRegex.test('100.5')).toBe(true);
      expect(percentageRegex.test('-100')).toBe(true);
      expect(percentageRegex.test('0')).toBe(true);
      expect(percentageRegex.test('100.123')).toBe(true);
    });

    it('does not match invalid percentage formats', () => {
      expect(percentageRegex.test('abc')).toBe(false);
      expect(percentageRegex.test('100%')).toBe(false);
    });
  });

  describe('MessageType', () => {
    it('has correct values', () => {
      expect(MessageType.ERROR).toBe('ERROR');
      expect(MessageType.INFO).toBe('INFO');
    });
  });

  describe('messageTypeIsError', () => {
    it('returns true for error messages', () => {
      expect(messageTypeIsError({ type: MessageType.ERROR, text: 'Error message' })).toBe(true);
    });

    it('returns false for non-error messages', () => {
      expect(messageTypeIsError({ type: MessageType.INFO, text: 'Info message' })).toBe(false);
      expect(messageTypeIsError({ type: null, text: 'No type message' })).toBe(false);
    });
  });

  describe('messageTypeIsInfo', () => {
    it('returns true for info messages', () => {
      expect(messageTypeIsInfo({ type: MessageType.INFO, text: 'Info message' })).toBe(true);
    });

    it('returns false for non-info messages', () => {
      expect(messageTypeIsInfo({ type: MessageType.ERROR, text: 'Error message' })).toBe(false);
      expect(messageTypeIsInfo({ type: null, text: 'No type message' })).toBe(false);
    });
  });

  describe('convertDollarsToCents', () => {
    it('converts valid dollar amounts to cents', () => {
      expect(convertDollarsToCents('10.50')).toBe(1050);
      expect(convertDollarsToCents('100')).toBe(10000);
      expect(convertDollarsToCents('0.01')).toBe(1);
      expect(convertDollarsToCents('0')).toBe(0);
    });

    it('handles decimal precision correctly', () => {
      expect(convertDollarsToCents('10.555')).toBe(1056); // rounds to nearest cent
      expect(convertDollarsToCents('10.554')).toBe(1055); // rounds down
    });

    it('returns null for invalid inputs', () => {
      expect(convertDollarsToCents('abc')).toBeNull();
      expect(convertDollarsToCents('')).toBeNull();
    });
  });

  describe('convertCentsToDollars', () => {
    it('formats cents to dollars correctly', () => {
      expect(convertCentsToDollars(1000)).toBe('$10.00');
      expect(convertCentsToDollars(1500)).toBe('$15.00');
      expect(convertCentsToDollars(0)).toBe('$0.00');
      expect(convertCentsToDollars(1)).toBe('$0.01');
    });

    it('handles negative values', () => {
      expect(convertCentsToDollars(-1000)).toBe('-$10.00');
      expect(convertCentsToDollars(-1500)).toBe('-$15.00');
    });
  });

  describe('getCurrentMonthRange', () => {
    it('returns correct month range for January', () => {
      const date = new Date('2024-01-15');
      const result = getFullMonthRange(date);
      expect(result.from).toEqual(new Date(2024, 0, 1, 12));
      expect(result.to).toEqual(new Date(2024, 0, 31, 12));
    });

    it('returns correct month range for February (leap year)', () => {
      const date = new Date('2024-02-15');
      const result = getFullMonthRange(date);
      expect(result.from).toEqual(new Date(2024, 1, 1, 12));
      expect(result.to).toEqual(new Date(2024, 1, 29, 12));
    });

    it('returns correct month range for December', () => {
      const date = new Date('2024-12-15');
      const result = getFullMonthRange(date);
      expect(result.from).toEqual(new Date(2024, 11, 1, 12));
      expect(result.to).toEqual(new Date(2024, 11, 31, 12));
    });
  });

  describe('getCurrentYearRange', () => {
    it('returns correct year range', () => {
      const date = new Date('2024-06-15');
      const result = getFullYearRange(date);
      expect(result.from).toEqual(new Date(2024, 0, 1, 12));
      expect(result.to).toEqual(new Date(2024, 11, 31, 12));
    });

    it('handles leap year correctly', () => {
      const date = new Date('2024-06-15');
      const result = getFullYearRange(date);
      expect(result.to?.getDate()).toBe(31);
    });
  });

  describe('convertToDate', () => {
    it('converts valid date string to Date', () => {
      const result = convertToDate('2024-01-15');
      expect(result).toEqual(new Date(Date.UTC(2024, 0, 15, 12)));
    });

    it('handles different months correctly', () => {
      const result = convertToDate('2024-12-25');
      expect(result).toEqual(new Date(Date.UTC(2024, 11, 25, 12)));
    });

    it('returns current date for undefined input', () => {
      const result = convertToDate(undefined);
      expect(result).toBeInstanceOf(Date);
    });

    it('returns current date for empty string', () => {
      const result = convertToDate('');
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('cleanCurrencyInput', () => {
    it('removes non-numeric characters except decimal point', () => {
      expect(cleanCurrencyInput('$100.50')).toBe('100.50');
      expect(cleanCurrencyInput('abc100def')).toBe('100');
      expect(cleanCurrencyInput('100,000.50')).toBe('100000.50');
    });

    it('handles multiple decimal points by returning null', () => {
      expect(cleanCurrencyInput('100.50.25')).toBeNull();
      expect(cleanCurrencyInput('100..50')).toBeNull();
    });

    it('limits decimal places to 2', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12');
      expect(cleanCurrencyInput('100.1')).toBe('100.1');
    });

    it('removes leading zeros except for single zero', () => {
      expect(cleanCurrencyInput('0100')).toBe('100');
      expect(cleanCurrencyInput('0.50')).toBe('0.50');
      expect(cleanCurrencyInput('00.50')).toBe('0.50');
    });

    it('validates against currency regex', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12'); // truncated but valid
    });

    it('returns empty string as is', () => {
      expect(cleanCurrencyInput('')).toBe('');
    });
  });

  describe('cleanPercentageInput', () => {
    it('removes non-numeric characters except decimal point and minus', () => {
      expect(cleanPercentageInput('50%')).toBe('50');
      expect(cleanPercentageInput('abc50def')).toBe('50');
      expect(cleanPercentageInput('-50%')).toBe('-50');
    });

    it('validates against percentage regex', () => {
      expect(cleanPercentageInput('50')).toBe('50');
      expect(cleanPercentageInput('-50')).toBe('-50');
      expect(cleanPercentageInput('50.5')).toBe('50.5');
    });

    it('validates range between -100 and 100', () => {
      expect(cleanPercentageInput('100')).toBe('100');
      expect(cleanPercentageInput('-100')).toBe('-100');
      expect(cleanPercentageInput('0')).toBe('0');
      expect(cleanPercentageInput('101')).toBeNull();
      expect(cleanPercentageInput('-101')).toBeNull();
    });

    it('handles edge cases', () => {
      expect(cleanPercentageInput('')).toBe('');
      expect(cleanPercentageInput('50.123')).toBe('50.123');
    });
  });

  describe('formatDate', () => {
    it('formats date with day by default', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('formats date without day when noDay is true', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date, true);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
      expect(result).not.toContain('15');
    });

    it('returns undefined for undefined date', () => {
      expect(formatDate(undefined)).toBeUndefined();
    });
  });

  describe('convertToDateMonthYear', () => {
    it('converts date to month year format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = convertToDateMonthYear(date);
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });

    it('handles different months', () => {
      const date = new Date('2024-12-15T12:00:00Z');
      const result = convertToDateMonthYear(date);
      expect(result).toContain('December');
      expect(result).toContain('2024');
    });
  });

  describe('convertDateToISOString', () => {
    it('converts date to ISO string format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = convertDateToISOString(date);
      expect(result).toBe('2024-01-15');
    });

    it('returns empty string for undefined date', () => {
      expect(convertDateToISOString(undefined)).toBe('');
    });
  });

  describe('replaceSpacesWithDashes', () => {
    it('replaces single spaces with dashes', () => {
      expect(replaceSpacesWithDashes('hello world')).toBe('hello-world');
    });

    it('replaces multiple spaces with single dash', () => {
      expect(replaceSpacesWithDashes('hello   world')).toBe('hello-world');
      expect(replaceSpacesWithDashes('  hello  world  ')).toBe('-hello-world-');
    });

    it('handles empty string', () => {
      expect(replaceSpacesWithDashes('')).toBe('');
    });

    it('handles string with no spaces', () => {
      expect(replaceSpacesWithDashes('helloworld')).toBe('helloworld');
    });
  });
});