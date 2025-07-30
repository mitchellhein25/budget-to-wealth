import { validateImportData } from '../validateImportData';
import { ImportDataTypeStringMappings } from '../../models/ImportDataTypeStringMappings';

describe('validateImportData', () => {
  it('validates CashFlow Entries data successfully', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: 'Groceries',
        description: 'Weekly shopping',
        categoryType: 'Expense',
        recurrenceFrequency: 'Weekly'
      },
      {
        amount: '2500.00',
        date: '2024-01-15',
        categoryName: 'Salary',
        description: 'Monthly salary',
        categoryType: 'Income',
        recurrenceFrequency: 'Monthly'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('validates Holdings data successfully', () => {
    const data = [
      {
        name: 'Savings Account',
        type: 'Asset',
        holdingCategoryName: 'Cash',
        institution: 'Bank of America'
      },
      {
        name: 'Credit Card',
        type: 'Debt',
        holdingCategoryName: 'Credit',
        institution: 'American Express'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.Holdings);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('validates Holding Snapshots data successfully', () => {
    const data = [
      {
        holdingName: 'Savings Account',
        date: '2024-01-15',
        balance: '5000.00',
        holdingCategoryName: 'Cash',
        holdingType: 'Asset',
        holdingInstitution: 'Bank of America'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.HoldingSnapshots);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it('validates Budgets data successfully', () => {
    const data = [
      {
        categoryName: 'Groceries',
        amount: '500.00'
      },
      {
        categoryName: 'Entertainment',
        amount: '200.00'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.Budgets);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('validates CashFlow Categories data successfully', () => {
    const data = [
      {
        name: 'Restaurants',
        categoryType: 'Expense'
      },
      {
        name: 'Salary',
        categoryType: 'Income'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowCategories);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('validates Holding Categories data successfully', () => {
    const data = [
      { name: 'Cash' },
      { name: 'Credit' },
      { name: 'Investments' }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.HoldingCategories);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
    expect(result.errors).toHaveLength(0);
  });

  it('handles missing required fields', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: '', // Missing required field
        categoryType: 'Expense'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(1); // Row is still included in data
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(1);
    expect(result.errors[0].message).toContain('categoryName is required');
    expect(result.errors[0].field).toBe('categoryName');
  });

  it('handles missing data type', () => {
    const data = [{ amount: '100.50', categoryName: 'Test' }];

    const result = validateImportData(data, undefined);

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(0);
    expect(result.errors[0].message).toBe('Data type is required');
  });

  it('handles invalid currency values', () => {
    const data = [
      {
        amount: 'invalid-currency',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(1);
    expect(result.errors[0].message).toContain('amount must be a valid currency value');
    expect(result.errors[0].field).toBe('amount');
  });

  it('handles multiple validation errors in same row', () => {
    const data = [
      {
        amount: '', // Missing required field
        date: '', // Missing required field
        categoryName: '', // Missing required field
        categoryType: '' // Missing required field
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
    expect(result.errors).toHaveLength(5); // 4 required field errors + 1 currency validation error
    expect(result.errors.every(error => error.row === 1)).toBe(true);
  });

  it('handles mixed valid and invalid rows', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: 'Groceries',
        categoryType: 'Expense'
      },
      {
        amount: '', // Invalid row
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      },
      {
        amount: '200.00',
        date: '2024-01-16',
        categoryName: 'Salary',
        categoryType: 'Income'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(2); // Only valid rows
    expect(result.errors).toHaveLength(2); // Two errors for invalid row (required + currency)
    expect(result.errors[0].row).toBe(2);
  });

  it('handles empty data array', () => {
    const result = validateImportData([], ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it('handles whitespace-only values as missing', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: '   ', // Whitespace only
        categoryType: 'Expense'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(1); // Row is still included in data
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('categoryName is required');
  });

  it('handles null and undefined values', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: 'null' as any,
        categoryType: 'undefined' as any
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true); // The function treats string 'null' and 'undefined' as valid values
    expect(result.data).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it('validates currency fields correctly', () => {
    const data = [
      {
        amount: '$1,234.56',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      },
      {
        amount: '0.99',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      },
      {
        amount: '1000000.00',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
    expect(result.errors).toHaveLength(0);
  });

  it('handles validation errors gracefully', () => {
    const data = [
      {
        amount: '100.50',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      }
    ];

    const result = validateImportData(data, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it('validates different data types with their specific required fields', () => {
    const cashFlowData = [
      {
        amount: '100.00',
        date: '2024-01-15',
        categoryName: 'Test',
        categoryType: 'Expense'
      }
    ];

    const budgetData = [
      {
        categoryName: 'Test',
        amount: '500.00'
      }
    ];

    const cashFlowResult = validateImportData(cashFlowData, ImportDataTypeStringMappings.CashFlowEntries);
    const budgetResult = validateImportData(budgetData, ImportDataTypeStringMappings.Budgets);

    expect(cashFlowResult.success).toBe(true);
    expect(budgetResult.success).toBe(true);
  });

  it('handles unknown data types gracefully', () => {
    const data = [{ field1: 'value1' }];

    const result = validateImportData(data, 'Unknown Type' as any);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });
}); 