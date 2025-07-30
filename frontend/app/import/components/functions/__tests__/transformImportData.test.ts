import { transformImportData } from '../transformImportData';
import { ImportDataTypeStringMappings } from '../../models/ImportDataTypeStringMappings';

describe('transformImportData', () => {
  it('transforms CashFlow Entries data correctly', () => {
    const rawData = [
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

    const result = transformImportData(rawData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      amountInCents: 10050,
      date: '2024-01-15',
      categoryName: 'Groceries',
      description: 'Weekly shopping',
      categoryType: 'Expense',
      recurrenceFrequency: 'Weekly'
    });
    expect(result[1]).toMatchObject({
      amountInCents: 250000,
      date: '2024-01-15',
      categoryName: 'Salary',
      description: 'Monthly salary',
      categoryType: 'Income',
      recurrenceFrequency: 'Monthly'
    });
  });

  it('transforms Holdings data correctly', () => {
    const rawData = [
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

    const result = transformImportData(rawData, ImportDataTypeStringMappings.Holdings);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: 'Savings Account',
      type: 'Asset',
      holdingCategoryName: 'Cash',
      institution: 'Bank of America'
    });
    expect(result[1]).toMatchObject({
      name: 'Credit Card',
      type: 'Debt',
      holdingCategoryName: 'Credit',
      institution: 'American Express'
    });
  });

  it('transforms Holding Snapshots data correctly', () => {
    const rawData = [
      {
        holdingName: 'Savings Account',
        date: '2024-01-15',
        balance: '5000.00',
        holdingCategoryName: 'Cash',
        holdingType: 'Asset',
        holdingInstitution: 'Bank of America'
      },
      {
        holdingName: 'Credit Card',
        date: '2024-01-15',
        balance: '-1500.00',
        holdingCategoryName: 'Credit',
        holdingType: 'Debt',
        holdingInstitution: 'American Express'
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.HoldingSnapshots);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      holdingName: 'Savings Account',
      date: '2024-01-15',
      balanceInCents: 500000,
      holdingCategoryName: 'Cash',
      holdingType: 'Asset',
      holdingInstitution: 'Bank of America'
    });
    expect(result[1]).toMatchObject({
      holdingName: 'Credit Card',
      date: '2024-01-15',
      balanceInCents: 150000,
      holdingCategoryName: 'Credit',
      holdingType: 'Debt',
      holdingInstitution: 'American Express'
    });
  });

  it('transforms Budgets data correctly', () => {
    const rawData = [
      {
        categoryName: 'Groceries',
        amount: '500.00'
      },
      {
        categoryName: 'Entertainment',
        amount: '200.00'
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.Budgets);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      categoryName: 'Groceries',
      amountInCents: 50000
    });
    expect(result[1]).toMatchObject({
      categoryName: 'Entertainment',
      amountInCents: 20000
    });
  });

  it('transforms Holding Categories data correctly', () => {
    const rawData = [
      { name: 'Cash' },
      { name: 'Credit' },
      { name: 'Investments' }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.HoldingCategories);

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ name: 'Cash' });
    expect(result[1]).toMatchObject({ name: 'Credit' });
    expect(result[2]).toMatchObject({ name: 'Investments' });
  });

  it('transforms CashFlow Categories data correctly', () => {
    const rawData = [
      {
        name: 'Restaurants',
        categoryType: 'Expense'
      },
      {
        name: 'Salary',
        categoryType: 'Income'
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.CashFlowCategories);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: 'Restaurants',
      categoryType: 'Expense'
    });
    expect(result[1]).toMatchObject({
      name: 'Salary',
      categoryType: 'Income'
    });
  });

  it('handles currency conversion correctly', () => {
    const rawData = [
      { amount: '$1,234.56', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' },
      { amount: '0.99', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' },
      { amount: '1000000.00', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.CashFlowEntries) as any[];

    expect(result).toHaveLength(3);
    expect(result[0].amountInCents).toBe(123456);
    expect(result[1].amountInCents).toBe(99);
    expect(result[2].amountInCents).toBe(100000000);
  });

  it('handles negative balances for holding snapshots', () => {
    const rawData = [
      {
        holdingName: 'Credit Card',
        date: '2024-01-15',
        balance: '-2500.75',
        holdingCategoryName: 'Credit',
        holdingType: 'Debt',
        holdingInstitution: 'Chase'
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.HoldingSnapshots);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      holdingName: 'Credit Card',
      date: '2024-01-15',
      balanceInCents: 250075,
      holdingCategoryName: 'Credit',
      holdingType: 'Debt',
      holdingInstitution: 'Chase'
    });
  });

  it('handles empty or missing values gracefully', () => {
    const rawData = [
      {
        amount: '',
        date: '2024-01-15',
        categoryName: 'Test',
        description: '',
        categoryType: 'Expense',
        recurrenceFrequency: ''
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      amountInCents: 0,
      date: '2024-01-15',
      categoryName: 'Test',
      description: '',
      categoryType: 'Expense',
      recurrenceFrequency: ''
    });
  });

  it('handles missing institution field for holdings', () => {
    const rawData = [
      {
        name: 'Investment Portfolio',
        type: 'Asset',
        holdingCategoryName: 'Investments',
        institution: ''
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.Holdings);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Investment Portfolio',
      type: 'Asset',
      holdingCategoryName: 'Investments',
      institution: ''
    });
  });

  it('handles missing holding institution for snapshots', () => {
    const rawData = [
      {
        holdingName: 'Investment Portfolio',
        date: '2024-01-15',
        balance: '25000.00',
        holdingCategoryName: 'Investments',
        holdingType: 'Asset',
        holdingInstitution: ''
      }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.HoldingSnapshots);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      holdingName: 'Investment Portfolio',
      date: '2024-01-15',
      balanceInCents: 2500000,
      holdingCategoryName: 'Investments',
      holdingType: 'Asset',
      holdingInstitution: ''
    });
  });

  it('returns raw data for unknown data types', () => {
    const rawData = [
      { field1: 'value1', field2: 'value2' },
      { field1: 'value3', field2: 'value4' }
    ];

    const result = transformImportData(rawData, 'Unknown Type' as any);

    expect(result).toEqual(rawData);
  });

  it('handles empty data array', () => {
    const result = transformImportData([], ImportDataTypeStringMappings.CashFlowEntries);

    expect(result).toEqual([]);
  });

  it('preserves all required fields for each data type', () => {
    const cashFlowData = [
      {
        amount: '100.00',
        date: '2024-01-15',
        categoryName: 'Test',
        description: 'Test description',
        categoryType: 'Expense',
        recurrenceFrequency: 'Weekly'
      }
    ];

    const result = transformImportData(cashFlowData, ImportDataTypeStringMappings.CashFlowEntries);

    expect(result[0]).toHaveProperty('amountInCents');
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('categoryName');
    expect(result[0]).toHaveProperty('description');
    expect(result[0]).toHaveProperty('categoryType');
    expect(result[0]).toHaveProperty('recurrenceFrequency');
  });

  it('handles different currency formats', () => {
    const rawData = [
      { amount: '1,234.56', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' },
      { amount: '$1,234.56', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' },
      { amount: '1234.56', date: '2024-01-15', categoryName: 'Test', description: 'Test', categoryType: 'Expense' }
    ];

    const result = transformImportData(rawData, ImportDataTypeStringMappings.CashFlowEntries) as any[];

    expect(result).toHaveLength(3);
    expect(result[0].amountInCents).toBe(123456);
    expect(result[1].amountInCents).toBe(123456);
    expect(result[2].amountInCents).toBe(123456);
  });
}); 