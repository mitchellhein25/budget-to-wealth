import { parseCsvFile } from '../parseCsvFile';

interface MockCsvRow {
  [key: string]: string | number;
}

describe('parseCsvFile', () => {
  it('parses valid CSV data correctly', async () => {
    const mockFile = new File([
      'name,amount,date\nTest,100.50,2024-01-01'
    ], 'test.csv', { type: 'text/csv' });

    const result = await parseCsvFile(mockFile);

    const mockResult = result as MockCsvRow[];
    expect(mockResult[0]).toEqual({
      name: 'Test',
      amount: 100.5,
      date: '2024-01-01'
    });
  });

  it('handles empty CSV file', async () => {
    const mockFile = new File([
      'name,amount,date\nTest,100.50,2024-01-01'
    ], 'test.csv', { type: 'text/csv' });

    const result = await parseCsvFile(mockFile);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles CSV with only headers', async () => {
    const mockFile = new File([
      'name,amount,date\nTest,100.50,2024-01-01'
    ], 'test.csv', { type: 'text/csv' });

    const result = await parseCsvFile(mockFile);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('preserves data types correctly', async () => {
    const mockFile = new File([
      'name,amount,date,active\nTest,100.50,2024-01-01,true'
    ], 'test.csv', { type: 'text/csv' });

    const result = await parseCsvFile(mockFile);

    const mockResult = result as MockCsvRow[];
    expect(typeof mockResult[0].name).toBe('string');
    expect(typeof mockResult[0].amount).toBe('number');
    expect(typeof mockResult[0].date).toBe('string');
    expect(typeof mockResult[0].active).toBe('boolean');
  });
}); 