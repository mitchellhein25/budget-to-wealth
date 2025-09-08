import { CashFlowType } from '@/app/cashflow';
import { getCashFlowValidationResult } from '@/app/cashflow/components/form/functions/getCashFlowValidationResult';

// Mock only the schema, let the actual validation logic run
jest.mock('@/app/cashflow', () => ({
  CashFlowType: { 
    INCOME: 'Income',
    EXPENSE: 'Expense'
  },
  cashFlowEntryFormSchema: {
    safeParse: jest.fn()
  },
}));

describe('getCashFlowValidationResult', () => {
  const mockSafeParse = jest.requireMock('@/app/cashflow').cashFlowEntryFormSchema.safeParse;

  beforeEach(() => {
    mockSafeParse.mockClear();
  });

  it('should extract form data correctly and call schema validation', () => {
    const formData = new FormData();
    formData.append('income-id', '123e4567-e89b-12d3-a456-426614174000');
    formData.append('income-amount', '150.75');
    formData.append('income-date', '2024-01-15');
    formData.append('income-categoryId', '2');
    formData.append('income-description', 'Test income');
    formData.append('income-recurrenceFrequency', 'Monthly');
    formData.append('income-recurrenceEndDate', '2024-12-31');

    const mockResult = { success: true, data: { amount: '150.75' } };
    mockSafeParse.mockReturnValue(mockResult);

    const result = getCashFlowValidationResult(formData, CashFlowType.INCOME);

    // Verify the function extracted the correct data from FormData
    expect(mockSafeParse).toHaveBeenCalledWith({
      id: '123e4567-e89b-12d3-a456-426614174000',
      amount: '150.75',
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: 'Test income',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2024-12-31'
    });

    // Verify the function returns the schema result
    expect(result).toBe(mockResult);
  });

  it('should handle missing optional fields correctly', () => {
    const formData = new FormData();
    formData.append('expense-amount', '50.25');
    formData.append('expense-date', '2024-01-15');
    formData.append('expense-categoryId', '1');

    const mockResult = { success: true, data: { amount: '50.25' } };
    mockSafeParse.mockReturnValue(mockResult);

    const result = getCashFlowValidationResult(formData, CashFlowType.EXPENSE);

    // Verify optional fields are handled as undefined when missing
    expect(mockSafeParse).toHaveBeenCalledWith({
      id: undefined,
      amount: '50.25',
      date: new Date('2024-01-15'),
      categoryId: '1',
      description: '',
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined
    });

    expect(result).toBe(mockResult);
  });

  it('should convert CashFlowType enum to lowercase for form field names', () => {
    const formData = new FormData();
    formData.append('income-amount', '100.00');
    formData.append('income-date', '2024-01-15');
    formData.append('income-categoryId', '1');

    const mockResult = { success: true, data: {} };
    mockSafeParse.mockReturnValue(mockResult);

    getCashFlowValidationResult(formData, CashFlowType.INCOME);

    // Verify that "Income" was converted to "income" for form field names
    expect(mockSafeParse).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: '100.00',
        date: new Date('2024-01-15'),
        categoryId: '1'
      })
    );
  });

  it('should handle empty string values correctly', () => {
    const formData = new FormData();
    formData.append('income-amount', '150.75');
    formData.append('income-date', '2024-01-15');
    formData.append('income-categoryId', '2');
    formData.append('income-description', '');
    formData.append('income-recurrenceFrequency', '');
    formData.append('income-recurrenceEndDate', '');

    const mockResult = { success: true, data: {} };
    mockSafeParse.mockReturnValue(mockResult);

    getCashFlowValidationResult(formData, CashFlowType.INCOME);

    expect(mockSafeParse).toHaveBeenCalledWith({
      id: undefined,
      amount: '150.75',
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: '',
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined
    });
  });

  it('should handle null date values correctly', () => {
    const formData = new FormData();
    formData.append('income-amount', '150.75');
    formData.append('income-categoryId', '2');
    // No date field added

    const mockResult = { success: true, data: {} };
    mockSafeParse.mockReturnValue(mockResult);

    getCashFlowValidationResult(formData, CashFlowType.INCOME);

    expect(mockSafeParse).toHaveBeenCalledWith(
      expect.objectContaining({
        date: null
      })
    );
  });

  it('should return schema validation result for success case', () => {
    const formData = new FormData();
    formData.append('income-amount', '150.75');
    formData.append('income-date', '2024-01-15');
    formData.append('income-categoryId', '2');

    const mockSuccessResult = { 
      success: true, 
      data: { amount: '150.75', date: new Date('2024-01-15'), categoryId: '2' } 
    };
    mockSafeParse.mockReturnValue(mockSuccessResult);

    const result = getCashFlowValidationResult(formData, CashFlowType.INCOME);

    expect(result).toBe(mockSuccessResult);
  });

  it('should return schema validation result for error case', () => {
    const formData = new FormData();
    formData.append('income-amount', 'invalid');
    formData.append('income-date', '2024-01-15');
    formData.append('income-categoryId', '2');

    const mockErrorResult = { 
      success: false, 
      error: { errors: [{ message: 'Invalid amount format' }] } 
    };
    mockSafeParse.mockReturnValue(mockErrorResult);

    const result = getCashFlowValidationResult(formData, CashFlowType.INCOME);

    expect(result).toBe(mockErrorResult);
  });
});