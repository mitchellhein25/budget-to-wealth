import { transformFormDataToManualInvestmentReturn } from '../transformFormDataToManualInvestmentReturn';
import { RecurrenceFrequency } from '@/app/cashflow/components/RecurrenceFrequency';



// Mock the Utils function
jest.mock('@/app/components/Utils', () => ({
  convertDateToISOString: jest.fn((date) => date.toISOString().split('T')[0]),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-'))
}));

// Mock the validation function to avoid circular dependencies
jest.mock('../getManualInvestmentReturnValidationResult', () => ({
  getManualInvestmentReturnValidationResult: jest.fn()
}));

describe('transformFormDataToManualInvestmentReturn', () => {
  const mockGetManualInvestmentReturnValidationResult = jest.requireMock('../getManualInvestmentReturnValidationResult').getManualInvestmentReturnValidationResult;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transforms valid form data successfully', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
        manualInvestmentRecurrenceEndDate: '2024-12-31'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeDefined();
    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      manualInvestmentCategoryId: 'category-1',
      manualInvestmentReturnDate: '2024-01-15',
      manualInvestmentPercentageReturn: 5.75,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    });
  });

  it('transforms form data without optional fields', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeDefined();
    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      manualInvestmentCategoryId: 'category-1',
      manualInvestmentReturnDate: '2024-01-15',
      manualInvestmentPercentageReturn: 5.75
    });
  });

  it('transforms form data with recurrence frequency but no end date', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeDefined();
    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      manualInvestmentCategoryId: 'category-1',
      manualInvestmentReturnDate: '2024-01-15',
      manualInvestmentPercentageReturn: 5.75,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY
    });
  });

  it('returns validation errors when validation fails', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: false,
      error: {
        errors: [
          { message: 'Category field is required' },
          { message: 'Return date field is required' }
        ]
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Category field is required']);
  });

  it('handles validation errors with multiple error messages', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: false,
      error: {
        errors: [
          { message: 'First error' },
          { message: 'Second error' },
          { message: 'Third error' }
        ]
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['First error']);
  });

  it('handles unexpected errors gracefully', () => {
    const mockFormData = new FormData();
    
    // Mock the validation function to throw an error
    mockGetManualInvestmentReturnValidationResult.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected error']);
  });

  it('handles errors without message property', () => {
    const mockFormData = new FormData();
    
    // Mock the validation function to throw an error without message
    mockGetManualInvestmentReturnValidationResult.mockImplementation(() => {
      throw {};
    });

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.']);
  });

  it('parses percentage return as float correctly', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '12.50'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item?.manualInvestmentPercentageReturn).toBe(12.50);
  });

  it('handles zero percentage return', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '0.00'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item?.manualInvestmentPercentageReturn).toBe(0);
  });
});
