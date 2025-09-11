import { convertDollarsToCents } from '@/app/lib/utils';
import { getCashFlowValidationResult, INCOME_ITEM_NAME, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from '@/app/cashflow';
import { transformCashFlowFormDataToEntry } from '@/app/cashflow/components/form/functions/transformFormDataToEntry';

jest.mock('@/app/lib/utils', () => ({
  convertDollarsToCents: jest.fn(),
  currencyRegex: /^\d+(\.\d{0,2})?$/,
  replaceSpacesWithDashes: jest.fn(),
}));

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    YEARLY: 'Yearly',
  },
  getCashFlowValidationResult: jest.fn(),
}));


const mockConvertDollarsToCents = convertDollarsToCents as jest.MockedFunction<typeof convertDollarsToCents>;
const mockGetCashFlowValidationResult = getCashFlowValidationResult as jest.MockedFunction<typeof getCashFlowValidationResult>;

// Helper functions to reduce duplication
const createValidValidationResult = (data: { amount: string; categoryId: string; date: Date; id?: string; description?: string; recurrenceFrequency?: string; recurrenceEndDate?: string }) => ({
  success: true as const,
  data,
});

const createInvalidValidationResult = (message: string) => {
  const mockError = {
    issues: [{ 
      message, 
      code: 'invalid_type' as const, 
      path: [],
      expected: 'string' as const,
      received: 'undefined' as const
    }],
    format: () => ({ _errors: [message] }),
    message,
    isEmpty: false,
    name: 'ZodError',
    cause: undefined,
    stack: undefined,
    errors: [{ 
      message, 
      code: 'invalid_type' as const, 
      path: [],
      expected: 'string' as const,
      received: 'undefined' as const
    }],
    addIssue: jest.fn(),
    addIssues: jest.fn(),
    flatten: jest.fn(() => ({ fieldErrors: {}, formErrors: [message] })),
    formErrors: { formErrors: [message], fieldErrors: {} }
  };
  
  return {
    success: false as const,
    error: mockError,
  };
};

const createFormData = (type: string, fields: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(`${type}-${key}`, value);
  });
  return formData;
};

describe('transformCashFlowFormDataToEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transforms valid income form data to entry', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: '150.75',
      date: '2024-01-15',
      categoryId: '2',
      description: 'Test income',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2024-12-31',
    });

    mockGetCashFlowValidationResult.mockReturnValue(createValidValidationResult({
      amount: '150.75',
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: 'Test income',
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2024-12-31',
    }));
    mockConvertDollarsToCents.mockReturnValue(15075);

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 15075,
      date: '2024-01-15',
      categoryId: '2',
      description: 'Test income',
      entryType: INCOME_ITEM_NAME,
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2024-12-31',
    });
  });

  it('transforms valid expense form data to entry', () => {
    const formData = createFormData(EXPENSE_ITEM_NAME_LOWERCASE, {
      amount: '50.25',
      date: '2024-01-15',
      categoryId: '1',
    });

    mockGetCashFlowValidationResult.mockReturnValue(createValidValidationResult({
      amount: '50.25',
      date: new Date('2024-01-15'),
      categoryId: '1',
      description: '',
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    }));
    mockConvertDollarsToCents.mockReturnValue(5025);

    const result = transformCashFlowFormDataToEntry(formData, EXPENSE_ITEM_NAME);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 5025,
      date: '2024-01-15',
      categoryId: '1',
      description: '',
      entryType: EXPENSE_ITEM_NAME,
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    });
  });

  it('returns error for validation failure', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: 'invalid',
      date: '2024-01-15',
      categoryId: '2',
    });

    mockGetCashFlowValidationResult.mockReturnValue(createInvalidValidationResult('Invalid currency format'));

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/currency format/i);
  });

  it('returns error for invalid amount conversion', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: '150.75',
      date: '2024-01-15',
      categoryId: '2',
    });

    mockGetCashFlowValidationResult.mockReturnValue(createValidValidationResult({
      amount: '150.75',
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: '',
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    }));
    mockConvertDollarsToCents.mockReturnValue(null);

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid amount format']);
  });

  it('handles missing optional fields', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: '150.75',
      date: '2024-01-15',
      categoryId: '2',
    });

    mockGetCashFlowValidationResult.mockReturnValue(createValidValidationResult({
      amount: '150.75',
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: '',
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    }));
    mockConvertDollarsToCents.mockReturnValue(15075);

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 15075,
      date: '2024-01-15',
      categoryId: '2',
      description: '',
      entryType: INCOME_ITEM_NAME,
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    });
  });

  it('handles unexpected errors', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: '150.75',
      date: '2024-01-15',
      categoryId: '2',
    });

    mockGetCashFlowValidationResult.mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/unexpected validation error/i);
    expect(result.errors[0]).toMatch(/Test error/);
  });

  it('handles error without message property', () => {
    const formData = createFormData(INCOME_ITEM_NAME_LOWERCASE, {
      amount: '150.75',
      date: '2024-01-15',
      categoryId: '2',
    });

    mockConvertDollarsToCents.mockImplementation(() => {
      throw 'String error';
    });

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/unexpected validation error/i);
  });
}); 