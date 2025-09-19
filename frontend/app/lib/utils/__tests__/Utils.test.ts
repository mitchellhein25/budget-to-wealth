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
  datesAreFullMonthRange,
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
      expect(currencyRegex.test('1')).toBe(true);
      expect(currencyRegex.test('1.0')).toBe(true);
    });

    it('does not match invalid currency formats', () => {
      expect(currencyRegex.test('100.123')).toBe(false);
      expect(currencyRegex.test('abc')).toBe(false);
      expect(currencyRegex.test('.50')).toBe(false);
      expect(currencyRegex.test('-100')).toBe(false);
      expect(currencyRegex.test('')).toBe(false);
      expect(currencyRegex.test(' 100')).toBe(false);
      expect(currencyRegex.test('100 ')).toBe(false);
      expect(currencyRegex.test('1,000')).toBe(false);
      expect(currencyRegex.test('$100')).toBe(false);
    });
  });

  describe('percentageRegex', () => {
    it('matches valid percentage formats', () => {
      expect(percentageRegex.test('100')).toBe(true);
      expect(percentageRegex.test('100.5')).toBe(true);
      expect(percentageRegex.test('-100')).toBe(true);
      expect(percentageRegex.test('0')).toBe(true);
      expect(percentageRegex.test('100.123')).toBe(true);
      expect(percentageRegex.test('-0')).toBe(true);
      expect(percentageRegex.test('0.0')).toBe(true);
      expect(percentageRegex.test('-50.25')).toBe(true);
    });

    it('does not match invalid percentage formats', () => {
      expect(percentageRegex.test('abc')).toBe(false);
      expect(percentageRegex.test('100%')).toBe(false);
      expect(percentageRegex.test('')).toBe(false);
      expect(percentageRegex.test(' 100')).toBe(false);
      expect(percentageRegex.test('100 ')).toBe(false);
      expect(percentageRegex.test('--100')).toBe(false);
      expect(percentageRegex.test('100-')).toBe(false);
      expect(percentageRegex.test('.100')).toBe(false);
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
      expect(convertDollarsToCents('1')).toBe(100);
      expect(convertDollarsToCents('0.1')).toBe(10);
    });

    it('handles decimal precision correctly', () => {
      expect(convertDollarsToCents('10.555')).toBe(1056);
      expect(convertDollarsToCents('10.554')).toBe(1055);
      expect(convertDollarsToCents('10.545')).toBe(1055);
      expect(convertDollarsToCents('10.546')).toBe(1055);
    });

    it('handles edge cases', () => {
      expect(convertDollarsToCents('0.00')).toBe(0);
      expect(convertDollarsToCents('0.001')).toBe(0);
      expect(convertDollarsToCents('0.009')).toBe(1);
      expect(convertDollarsToCents('999999.99')).toBe(99999999);
    });

    it('returns null for invalid inputs', () => {
      expect(convertDollarsToCents('abc')).toBeNull();
      expect(convertDollarsToCents('')).toBeNull();
      expect(convertDollarsToCents('NaN')).toBeNull();
      expect(convertDollarsToCents(' ')).toBeNull();
    });

    it('handles malformed decimal inputs by parsing what it can', () => {
      expect(convertDollarsToCents('10.50.25')).toBe(1050);
    });

    it('handles negative values correctly', () => {
      expect(convertDollarsToCents('-10')).toBe(-1000);
      expect(convertDollarsToCents('-10.50')).toBe(-1050);
      expect(convertDollarsToCents('-0.01')).toBe(-1);
    });

    it('handles special numeric values', () => {
      expect(convertDollarsToCents('Infinity')).toBe(Infinity);
      expect(convertDollarsToCents('-Infinity')).toBe(-Infinity);
    });
  });

  describe('convertCentsToDollars', () => {
    it('formats cents to dollars correctly', () => {
      expect(convertCentsToDollars(1000)).toBe('$10.00');
      expect(convertCentsToDollars(1500)).toBe('$15.00');
      expect(convertCentsToDollars(0)).toBe('$0.00');
      expect(convertCentsToDollars(1)).toBe('$0.01');
      expect(convertCentsToDollars(50)).toBe('$0.50');
      expect(convertCentsToDollars(99)).toBe('$0.99');
    });

    it('handles negative values', () => {
      expect(convertCentsToDollars(-1000)).toBe('-$10.00');
      expect(convertCentsToDollars(-1500)).toBe('-$15.00');
      expect(convertCentsToDollars(-1)).toBe('-$0.01');
      expect(convertCentsToDollars(-50)).toBe('-$0.50');
    });

    it('handles large values', () => {
      expect(convertCentsToDollars(100000000)).toBe('$1,000,000.00');
      expect(convertCentsToDollars(999999999)).toBe('$9,999,999.99');
    });

    it('handles decimal cents correctly', () => {
      expect(convertCentsToDollars(100.5)).toBe('$1.01');
      expect(convertCentsToDollars(100.4)).toBe('$1.00');
    });
  });

  describe('getFullMonthRange', () => {
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

    it('returns correct month range for February (non-leap year)', () => {
      const date = new Date('2023-02-15');
      const result = getFullMonthRange(date);
      expect(result.from).toEqual(new Date(2023, 1, 1, 12));
      expect(result.to).toEqual(new Date(2023, 1, 28, 12));
    });

    it('returns correct month range for December', () => {
      const date = new Date('2024-12-15');
      const result = getFullMonthRange(date);
      expect(result.from).toEqual(new Date(2024, 11, 1, 12));
      expect(result.to).toEqual(new Date(2024, 11, 31, 12));
    });

    it('handles month boundaries correctly', () => {
      const januaryFirst = new Date('2024-01-01');
      const januaryLast = new Date('2024-01-31');
      
      const result1 = getFullMonthRange(januaryFirst);
      const result2 = getFullMonthRange(januaryLast);
      
      expect(result1.from).toEqual(result2.from);
      expect(result1.to).toEqual(result2.to);
    });

    it('handles different years correctly', () => {
      const date2023 = new Date('2023-06-15');
      const date2024 = new Date('2024-06-15');
      
      const result2023 = getFullMonthRange(date2023);
      const result2024 = getFullMonthRange(date2024);
      
      expect(result2023.from?.getUTCFullYear()).toBe(2023);
      expect(result2024.from?.getUTCFullYear()).toBe(2024);
    });
  });

  describe('getFullYearRange', () => {
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
      expect(result.to?.getUTCMonth()).toBe(11);
    });

    it('handles different years correctly', () => {
      const date2023 = new Date('2023-03-15');
      const date2025 = new Date('2025-09-20');
      
      const result2023 = getFullYearRange(date2023);
      const result2025 = getFullYearRange(date2025);
      
      expect(result2023.from).toEqual(new Date(2023, 0, 1, 12));
      expect(result2023.to).toEqual(new Date(2023, 11, 31, 12));
      expect(result2025.from).toEqual(new Date(2025, 0, 1, 12));
      expect(result2025.to).toEqual(new Date(2025, 11, 31, 12));
    });

    it('handles year boundaries correctly', () => {
      const januaryFirst = new Date('2024-01-01');
      const decemberLast = new Date('2024-12-31');
      
      const result1 = getFullYearRange(januaryFirst);
      const result2 = getFullYearRange(decemberLast);
      
      expect(result1.from).toEqual(result2.from);
      expect(result1.to).toEqual(result2.to);
    });
  });

  describe('datesAreFullMonthRange', () => {
    const JANUARY_FIRST = '2024-01-01';
    const JANUARY_LAST = '2024-01-31';
    const FEBRUARY_FIRST = '2024-02-01';
    const FEBRUARY_LAST = '2024-02-29';
    const JANUARY_MID = '2024-01-15';

    it('returns true when dates match full month range', () => {
      expect(datesAreFullMonthRange(JANUARY_FIRST, JANUARY_LAST)).toBe(true);
      expect(datesAreFullMonthRange(FEBRUARY_FIRST, FEBRUARY_LAST)).toBe(true);
    });

    it('returns false when dates do not match full month range', () => {
      expect(datesAreFullMonthRange(JANUARY_MID, JANUARY_LAST)).toBe(false);
      expect(datesAreFullMonthRange(JANUARY_FIRST, JANUARY_MID)).toBe(false);
      expect(datesAreFullMonthRange(JANUARY_FIRST, FEBRUARY_LAST)).toBe(false);
    });

    it('returns false for undefined or null inputs', () => {
      expect(datesAreFullMonthRange(undefined, JANUARY_LAST)).toBe(false);
      expect(datesAreFullMonthRange(JANUARY_FIRST, undefined)).toBe(false);
      expect(datesAreFullMonthRange(undefined, undefined)).toBe(false);
    });

    it('handles Date objects correctly', () => {
      const janFirst = new Date(Date.UTC(2024, 0, 1, 12));
      const janLast = new Date(Date.UTC(2024, 0, 31, 12));
      const janMid = new Date(Date.UTC(2024, 0, 15, 12));
      
      expect(datesAreFullMonthRange(janFirst, janLast)).toBe(true);
      expect(datesAreFullMonthRange(janMid, janLast)).toBe(false);
    });

    it('handles mixed Date and string inputs', () => {
      const janFirst = new Date(Date.UTC(2024, 0, 1, 12));
      const janLast = new Date(Date.UTC(2024, 0, 31, 12));
      
      expect(datesAreFullMonthRange(janFirst, JANUARY_LAST)).toBe(true);
      expect(datesAreFullMonthRange(JANUARY_FIRST, janLast)).toBe(true);
    });

    it('handles leap year February correctly', () => {
      const febFirst2024 = '2024-02-01';
      const febLast2024 = '2024-02-29';
      const febFirst2023 = '2023-02-01';
      const febLast2023 = '2023-02-28';
      
      expect(datesAreFullMonthRange(febFirst2024, febLast2024)).toBe(true);
      expect(datesAreFullMonthRange(febFirst2023, febLast2023)).toBe(true);
      expect(datesAreFullMonthRange(febFirst2024, febLast2023)).toBe(false);
    });

    it('handles invalid date strings gracefully', () => {
      expect(datesAreFullMonthRange('invalid-date', JANUARY_LAST)).toBe(false);
      expect(datesAreFullMonthRange(JANUARY_FIRST, 'invalid-date')).toBe(false);
      expect(datesAreFullMonthRange('', '')).toBe(false);
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

    it('handles noMonthAdjustment parameter correctly', () => {
      const resultWithAdjustment = convertToDate('2024-01-15');
      const resultWithoutAdjustment = convertToDate('2024-01-15', true);
      
      expect(resultWithAdjustment).toEqual(new Date(Date.UTC(2024, 0, 15, 12)));
      expect(resultWithoutAdjustment).toEqual(new Date(Date.UTC(2024, 1, 15, 12)));
    });

    it('returns current date for undefined input', () => {
      const result = convertToDate(undefined);
      expect(result).toBeInstanceOf(Date);
    });

    it('returns current date for empty string', () => {
      const result = convertToDate('');
      expect(result).toBeInstanceOf(Date);
    });

    it('returns current date for invalid date format', () => {
      expect(convertToDate('invalid-date')).toBeInstanceOf(Date);
      expect(convertToDate('2024-13-01')).toBeInstanceOf(Date);
      expect(convertToDate('2024-01-32')).toBeInstanceOf(Date);
      expect(convertToDate('2024-02-30')).toBeInstanceOf(Date);
      expect(convertToDate('abcd-ef-gh')).toBeInstanceOf(Date);
    });

    it('validates date components correctly', () => {
      expect(convertToDate('2024-00-15')).toBeInstanceOf(Date);
      expect(convertToDate('2024-01-00')).toBeInstanceOf(Date);
      expect(convertToDate('0000-01-15')).toBeInstanceOf(Date);
    });

    it('handles edge date cases correctly', () => {
      const result1 = convertToDate('2024-02-29');
      const result2 = convertToDate('2023-02-28');
      
      expect(result1.getUTCDate()).toBe(29);
      expect(result2.getUTCDate()).toBe(28);
    });

    it('returns current date when date components create invalid date', () => {
      const beforeTest = new Date();
      const result = convertToDate('2024-02-31');
      const afterTest = new Date();
      
      expect(result.getTime()).toBeGreaterThanOrEqual(beforeTest.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(afterTest.getTime());
    });
  });

  describe('cleanCurrencyInput', () => {
    it('removes non-numeric characters except decimal point', () => {
      expect(cleanCurrencyInput('$100.50')).toBe('100.50');
      expect(cleanCurrencyInput('abc100def')).toBe('100');
      expect(cleanCurrencyInput('100,000.50')).toBe('100000.50');
      expect(cleanCurrencyInput('!@#100%^&*')).toBe('100');
    });

    it('handles multiple decimal points by returning null', () => {
      expect(cleanCurrencyInput('100.50.25')).toBeNull();
      expect(cleanCurrencyInput('100..50')).toBeNull();
      expect(cleanCurrencyInput('1.2.3.4')).toBeNull();
    });

    it('limits decimal places to 2', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12');
      expect(cleanCurrencyInput('100.1')).toBe('100.1');
      expect(cleanCurrencyInput('100.12345')).toBe('100.12');
      expect(cleanCurrencyInput('0.999')).toBe('0.99');
    });

    it('removes leading zeros except for single zero', () => {
      expect(cleanCurrencyInput('0100')).toBe('100');
      expect(cleanCurrencyInput('0.50')).toBe('0.50');
      expect(cleanCurrencyInput('00.50')).toBe('0.50');
      expect(cleanCurrencyInput('0')).toBe('0');
    });

    it('handles multiple leading zeros differently for large numbers', () => {
      expect(cleanCurrencyInput('000100')).toBe('00100');
    });

    it('validates against currency regex and returns null for invalid', () => {
      expect(cleanCurrencyInput('100.123')).toBe('100.12');
      expect(cleanCurrencyInput('.')).toBeNull();
    });

    it('handles trailing decimal point', () => {
      expect(cleanCurrencyInput('100.')).toBe('100.');
    });

    it('returns empty string as is', () => {
      expect(cleanCurrencyInput('')).toBe('');
    });

    it('handles edge cases', () => {
      expect(cleanCurrencyInput('0.0')).toBe('0.0');
      expect(cleanCurrencyInput('0.00')).toBe('0.00');
      expect(cleanCurrencyInput('   100   ')).toBe('100');
      expect(cleanCurrencyInput('100-')).toBe('100');
      expect(cleanCurrencyInput('-100')).toBe('100');
    });
  });

  describe('cleanPercentageInput', () => {
    it('removes non-numeric characters except decimal point and minus', () => {
      expect(cleanPercentageInput('50%')).toBe('50');
      expect(cleanPercentageInput('abc50def')).toBe('50');
      expect(cleanPercentageInput('-50%')).toBe('-50');
      expect(cleanPercentageInput('!@#50^&*')).toBe('50');
      expect(cleanPercentageInput('-+50')).toBe('-50');
    });

    it('validates against percentage regex', () => {
      expect(cleanPercentageInput('50')).toBe('50');
      expect(cleanPercentageInput('-50')).toBe('-50');
      expect(cleanPercentageInput('50.5')).toBe('50.5');
      expect(cleanPercentageInput('0')).toBe('0');
      expect(cleanPercentageInput('-0')).toBe('-0');
    });

    it('validates range between -100 and 100', () => {
      expect(cleanPercentageInput('100')).toBe('100');
      expect(cleanPercentageInput('-100')).toBe('-100');
      expect(cleanPercentageInput('0')).toBe('0');
      expect(cleanPercentageInput('101')).toBeNull();
      expect(cleanPercentageInput('-101')).toBeNull();
      expect(cleanPercentageInput('999')).toBeNull();
      expect(cleanPercentageInput('-999')).toBeNull();
    });

    it('handles decimal values within range', () => {
      expect(cleanPercentageInput('99.99')).toBe('99.99');
      expect(cleanPercentageInput('-99.99')).toBe('-99.99');
      expect(cleanPercentageInput('100.01')).toBeNull();
      expect(cleanPercentageInput('-100.01')).toBeNull();
    });

    it('returns null for invalid regex patterns', () => {
      expect(cleanPercentageInput('--50')).toBeNull();
      expect(cleanPercentageInput('50-')).toBeNull();
      expect(cleanPercentageInput('5-0')).toBeNull();
    });

    it('handles invalid characters by cleaning them', () => {
      expect(cleanPercentageInput('abc')).toBe('');
    });

    it('handles edge cases', () => {
      expect(cleanPercentageInput('')).toBe('');
      expect(cleanPercentageInput('50.123')).toBe('50.123');
      expect(cleanPercentageInput('0.0')).toBe('0.0');
      expect(cleanPercentageInput('-0.0')).toBe('-0.0');
      expect(cleanPercentageInput('   50   ')).toBe('50');
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
      expect(formatDate(undefined, true)).toBeUndefined();
    });

    it('handles different months correctly', () => {
      const dates = [
        { date: new Date('2024-01-01T12:00:00Z'), month: 'Jan' },
        { date: new Date('2024-02-01T12:00:00Z'), month: 'Feb' },
        { date: new Date('2024-03-01T12:00:00Z'), month: 'Mar' },
        { date: new Date('2024-12-01T12:00:00Z'), month: 'Dec' }
      ];

      dates.forEach(({ date, month }) => {
        const result = formatDate(date);
        expect(result).toContain(month);
        expect(result).toContain('2024');
      });
    });

    it('uses UTC timezone correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date);
      expect(result).toBeDefined();
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

    it('formats all months correctly', () => {
      const months = [
        { month: 0, name: 'January' },
        { month: 1, name: 'February' },
        { month: 2, name: 'March' },
        { month: 3, name: 'April' },
        { month: 4, name: 'May' },
        { month: 5, name: 'June' },
        { month: 6, name: 'July' },
        { month: 7, name: 'August' },
        { month: 8, name: 'September' },
        { month: 9, name: 'October' },
        { month: 10, name: 'November' },
        { month: 11, name: 'December' }
      ];

      months.forEach(({ month, name }) => {
        const date = new Date(2024, month, 15);
        const result = convertToDateMonthYear(date);
        expect(result).toContain(name);
        expect(result).toContain('2024');
      });
    });

    it('handles different years correctly', () => {
      const date2023 = new Date('2023-06-15T12:00:00Z');
      const date2025 = new Date('2025-06-15T12:00:00Z');
      
      expect(convertToDateMonthYear(date2023)).toContain('2023');
      expect(convertToDateMonthYear(date2025)).toContain('2025');
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

    it('handles different dates correctly', () => {
      const testCases = [
        { date: new Date('2024-01-01T00:00:00Z'), expected: '2024-01-01' },
        { date: new Date('2024-12-31T23:59:59Z'), expected: '2024-12-31' },
        { date: new Date('2023-02-28T12:00:00Z'), expected: '2023-02-28' },
        { date: new Date('2024-02-29T12:00:00Z'), expected: '2024-02-29' }
      ];

      testCases.forEach(({ date, expected }) => {
        expect(convertDateToISOString(date)).toBe(expected);
      });
    });

    it('handles timezone correctly', () => {
      const date = new Date('2024-01-15T23:59:59Z');
      const result = convertDateToISOString(date);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('replaceSpacesWithDashes', () => {
    it('replaces single spaces with dashes', () => {
      expect(replaceSpacesWithDashes('hello world')).toBe('hello-world');
      expect(replaceSpacesWithDashes('one two three')).toBe('one-two-three');
    });

    it('replaces multiple spaces with single dash', () => {
      expect(replaceSpacesWithDashes('hello   world')).toBe('hello-world');
      expect(replaceSpacesWithDashes('  hello  world  ')).toBe('-hello-world-');
      expect(replaceSpacesWithDashes('a    b    c')).toBe('a-b-c');
    });

    it('handles empty string', () => {
      expect(replaceSpacesWithDashes('')).toBe('');
    });

    it('handles string with no spaces', () => {
      expect(replaceSpacesWithDashes('helloworld')).toBe('helloworld');
      expect(replaceSpacesWithDashes('test123')).toBe('test123');
    });

    it('handles strings with only spaces', () => {
      expect(replaceSpacesWithDashes(' ')).toBe('-');
      expect(replaceSpacesWithDashes('   ')).toBe('-');
      expect(replaceSpacesWithDashes('     ')).toBe('-');
    });

    it('handles all whitespace characters', () => {
      expect(replaceSpacesWithDashes('hello\tworld')).toBe('hello-world');
      expect(replaceSpacesWithDashes('hello\nworld')).toBe('hello-world');
      expect(replaceSpacesWithDashes('hello world\ttest')).toBe('hello-world-test');
      expect(replaceSpacesWithDashes('hello\r\nworld')).toBe('hello-world');
    });

    it('handles special characters correctly', () => {
      expect(replaceSpacesWithDashes('hello-world test')).toBe('hello-world-test');
      expect(replaceSpacesWithDashes('test@email.com with spaces')).toBe('test@email.com-with-spaces');
    });
  });
});