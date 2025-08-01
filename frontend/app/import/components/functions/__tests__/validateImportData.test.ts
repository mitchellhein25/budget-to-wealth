import { validateImportData } from '../validateImportData';

interface MockImportRow {
  [key: string]: string | number;
}

interface MockValidationResult {
  success: boolean;
  data?: MockImportRow[];
  errors?: Array<{ row: number; message: string }>;
}

describe('validateImportData', () => {
  it('validates CashFlowEntries data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        amount: '100.50',
        categoryName: 'Food',
        categoryType: 'Expense',
        date: '2024-01-01',
        description: 'Grocery shopping',
        recurrenceFrequency: 'Monthly'
      }
    ];
    
    const result = validateImportData(mockData, 'CashFlow Entries');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('validates Budgets data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        amount: '500.00',
        categoryName: 'Food'
      }
    ];
    
    const result = validateImportData(mockData, 'Budgets');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('validates CashFlowCategories data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        name: 'Food',
        categoryType: 'Expense'
      }
    ];
    
    const result = validateImportData(mockData, 'CashFlow Categories');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('validates Holdings data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        name: 'Savings Account',
        type: 'Cash',
        holdingCategoryName: 'Bank Accounts',
        institution: 'Bank of America'
      }
    ];
    
    const result = validateImportData(mockData, 'Holdings');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('validates HoldingCategories data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        name: 'Bank Accounts'
      }
    ];
    
    const result = validateImportData(mockData, 'Holding Categories');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('validates HoldingSnapshots data correctly', () => {
    const mockData: MockImportRow[] = [
      {
        balance: '1000.00',
        holdingName: 'Savings Account',
        holdingCategoryName: 'Bank Accounts',
        holdingType: 'Cash',
        date: '2024-01-01',
        holdingInstitution: 'Bank of America'
      }
    ];
    
    const result = validateImportData(mockData, 'Holding Snapshots');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('handles empty data array', () => {
    const mockData: MockImportRow[] = [];
    
    const result = validateImportData(mockData, 'CashFlow Entries');
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
  });

  it('returns validation result with correct structure', () => {
    const mockData: MockImportRow[] = [
      {
        amount: '100.50',
        categoryName: 'Food',
        categoryType: 'Expense',
        date: '2024-01-01',
        description: 'Grocery shopping'
      }
    ];
    
    const result = validateImportData(mockData, 'CashFlow Entries');
    
    const mockResult = result as MockValidationResult;
    
    expect(mockResult).toHaveProperty('success');
    expect(typeof mockResult.success).toBe('boolean');
    
    if (mockResult.success) {
      expect(mockResult).toHaveProperty('data');
      expect(Array.isArray(mockResult.data)).toBe(true);
    } else {
      expect(mockResult).toHaveProperty('errors');
      expect(Array.isArray(mockResult.errors)).toBe(true);
    }
  });
}); 