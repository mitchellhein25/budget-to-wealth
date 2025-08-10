import { getCompletedMonthsDefaultRange, sumNumberList, avgNumberList, minNumberList, maxNumberList, medianNumberList } from '../Utils';

describe('getCompletedMonthsDefaultRange', () => {
  it('returns correct range for January', () => {
    const today = new Date(2024, 0, 15);
    const result = getCompletedMonthsDefaultRange(today);
    
    expect(result.from).toEqual(new Date(2023, 0, 1));
    expect(result.to).toEqual(new Date(2023, 11, 31));
  });

  it('returns correct range for December', () => {
    const today = new Date(2024, 11, 15);
    const result = getCompletedMonthsDefaultRange(today);
    
    expect(result.from).toEqual(new Date(2024, 0, 1));
    expect(result.to).toEqual(new Date(2024, 10, 30));
  });

  it('returns correct range for February in leap year', () => {
    const today = new Date(2024, 1, 15);
    const result = getCompletedMonthsDefaultRange(today);
    
    expect(result.from).toEqual(new Date(2024, 0, 1));
    expect(result.to).toEqual(new Date(2024, 0, 31));
  });

  it('returns correct range for February in non-leap year', () => {
    const today = new Date(2023, 1, 15);
    const result = getCompletedMonthsDefaultRange(today);
    
    expect(result.from).toEqual(new Date(2023, 0, 1));
    expect(result.to).toEqual(new Date(2023, 0, 31));
  });
});

describe('sumNumberList', () => {
  it('returns 0 for empty array', () => {
    expect(sumNumberList([])).toBe(0);
  });

  it('returns correct sum for single element', () => {
    expect(sumNumberList([5])).toBe(5);
  });

  it('returns correct sum for multiple elements', () => {
    expect(sumNumberList([1, 2, 3, 4, 5])).toBe(15);
  });

  it('handles negative numbers', () => {
    expect(sumNumberList([-1, -2, 3, -4, 5])).toBe(1);
  });

  it('handles decimal numbers', () => {
    expect(sumNumberList([1.5, 2.5, 3.5])).toBe(7.5);
  });
});

describe('avgNumberList', () => {
  it('returns 0 for empty array', () => {
    expect(avgNumberList([])).toBe(0);
  });

  it('returns correct average for single element', () => {
    expect(avgNumberList([5])).toBe(5);
  });

  it('returns correct average for multiple elements', () => {
    expect(avgNumberList([1, 2, 3, 4, 5])).toBe(3);
  });

  it('rounds average correctly', () => {
    expect(avgNumberList([1, 2, 3, 4])).toBe(3);
    expect(avgNumberList([1, 2, 3, 4, 5])).toBe(3);
  });

  it('handles negative numbers', () => {
    expect(avgNumberList([-1, -2, 3, -4, 5])).toBe(0);
  });
});

describe('minNumberList', () => {
  it('returns 0 for empty array', () => {
    expect(minNumberList([])).toBe(0);
  });

  it('returns correct min for single element', () => {
    expect(minNumberList([5])).toBe(5);
  });

  it('returns correct min for multiple elements', () => {
    expect(minNumberList([1, 2, 3, 4, 5])).toBe(1);
  });

  it('handles negative numbers', () => {
    expect(minNumberList([-1, -2, 3, -4, 5])).toBe(-4);
  });

  it('handles duplicate values', () => {
    expect(minNumberList([5, 5, 5, 5])).toBe(5);
  });
});

describe('maxNumberList', () => {
  it('returns 0 for empty array', () => {
    expect(maxNumberList([])).toBe(0);
  });

  it('returns correct max for single element', () => {
    expect(maxNumberList([5])).toBe(5);
  });

  it('returns correct max for multiple elements', () => {
    expect(maxNumberList([1, 2, 3, 4, 5])).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(maxNumberList([-1, -2, 3, -4, 5])).toBe(5);
  });

  it('handles duplicate values', () => {
    expect(maxNumberList([5, 5, 5, 5])).toBe(5);
  });
});

describe('medianNumberList', () => {
  it('returns 0 for empty array', () => {
    expect(medianNumberList([])).toBe(0);
  });

  it('returns correct median for single element', () => {
    expect(medianNumberList([5])).toBe(5);
  });

  it('returns correct median for odd number of elements', () => {
    expect(medianNumberList([1, 3, 5, 7, 9])).toBe(5);
    expect(medianNumberList([1, 2, 3])).toBe(2);
  });

  it('returns correct median for even number of elements', () => {
    expect(medianNumberList([1, 2, 3, 4])).toBe(3);
    expect(medianNumberList([1, 2, 3, 4, 5, 6])).toBe(4);
  });

  it('rounds median correctly for even arrays', () => {
    expect(medianNumberList([1, 2, 3, 4])).toBe(3);
    expect(medianNumberList([1, 3, 5, 7])).toBe(4);
  });

  it('handles negative numbers', () => {
    expect(medianNumberList([-5, -3, -1, 1, 3])).toBe(-1);
  });

  it('handles unsorted arrays', () => {
    expect(medianNumberList([5, 1, 3, 2, 4])).toBe(3);
    expect(medianNumberList([4, 2, 6, 1, 3, 5])).toBe(4);
  });
});
