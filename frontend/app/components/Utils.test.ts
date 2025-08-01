import { convertCentsToDollars, formatDate, messageTypeIsError, messageTypeIsInfo } from './Utils';

describe('Utils', () => {
  describe('convertCentsToDollars', () => {
    it('formats cents to dollars correctly', () => {
      expect(convertCentsToDollars(1000)).toBe('$10.00');
      expect(convertCentsToDollars(1500)).toBe('$15.00');
      expect(convertCentsToDollars(0)).toBe('$0.00');
    });

    it('handles negative values', () => {
      expect(convertCentsToDollars(-1000)).toBe('-$10.00');
      expect(convertCentsToDollars(-1500)).toBe('-$15.00');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('January 15, 2024');
    });
  });

  describe('messageTypeIsError', () => {
    it('returns true for error messages', () => {
      expect(messageTypeIsError({ type: 'ERROR', text: 'Error message' })).toBe(true);
    });

    it('returns false for non-error messages', () => {
      expect(messageTypeIsError({ type: 'INFO', text: 'Info message' })).toBe(false);
      expect(messageTypeIsError({ type: null, text: 'No type message' })).toBe(false);
    });
  });

  describe('messageTypeIsInfo', () => {
    it('returns true for info messages', () => {
      expect(messageTypeIsInfo({ type: 'INFO', text: 'Info message' })).toBe(true);
    });

    it('returns false for non-info messages', () => {
      expect(messageTypeIsInfo({ type: 'ERROR', text: 'Error message' })).toBe(false);
      expect(messageTypeIsInfo({ type: null, text: 'No type message' })).toBe(false);
    });
  });
}); 