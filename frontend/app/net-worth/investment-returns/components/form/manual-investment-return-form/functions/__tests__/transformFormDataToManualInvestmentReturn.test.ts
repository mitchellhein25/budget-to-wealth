import { RecurrenceFrequency } from '@/app/cashflow';
import { transformFormDataToManualInvestmentReturn } from '@/app/net-worth/investment-returns/components/form/manual-investment-return-form/functions/transformFormDataToManualInvestmentReturn';
import { getManualInvestmentReturnValidationResult } from '@/app/net-worth/investment-returns/components/form/manual-investment-return-form/functions/getManualInvestmentReturnValidationResult';

jest.mock('@/app/lib/utils', () => ({
  convertDateToISOString: jest.fn((date) => date.toISOString().split('T')[0]),
  replaceSpacesWithDashes: jest.fn((str) => str.replace(/\s+/g, '-')),
}));

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    EVERY_2_WEEKS: 'EVERY_2_WEEKS',
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    YEARLY: 'YEARLY'
  }
}));

jest.mock('@/app/net-worth/investment-returns/components/form/manual-investment-return-form/functions/getManualInvestmentReturnValidationResult', () => ({
  getManualInvestmentReturnValidationResult: jest.fn(),
}));

describe('transformFormDataToManualInvestmentReturn', () => {
  const mockGetManualInvestmentReturnValidationResult = getManualInvestmentReturnValidationResult as jest.MockedFunction<typeof getManualInvestmentReturnValidationResult>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transforms valid form data successfully', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
        manualInvestmentRecurrenceEndDate: '2024-12-31'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

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

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeDefined();
    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      manualInvestmentCategoryId: 'category-1',
      manualInvestmentReturnDate: '2024-01-15',
      manualInvestmentPercentageReturn: 5.75
    });
  });

  it('handles negative percentage returns', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '-2.5'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item?.manualInvestmentPercentageReturn).toBe(-2.5);
  });

  it('handles very large percentage returns', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '999.99'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item?.manualInvestmentPercentageReturn).toBe(999.99);
  });

  it('handles decimal percentage returns', () => {
    const mockFormData = new FormData();
    const mockValidationResult = {
      success: true,
      data: {
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '0.001'
      }
    };

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item?.manualInvestmentPercentageReturn).toBe(0.001);
  });

  it('handles all recurrence frequency types', () => {
    const mockFormData = new FormData();
    const frequencies = [
      RecurrenceFrequency.WEEKLY,
      RecurrenceFrequency.EVERY_2_WEEKS,
      RecurrenceFrequency.MONTHLY
    ];

    frequencies.forEach(frequency => {
      const mockValidationResult = {
        success: true,
        data: {
          manualInvestmentCategoryId: 'category-1',
          manualInvestmentReturnDate: new Date('2024-01-15'),
          manualInvestmentPercentageReturn: '5.0',
          manualInvestmentRecurrenceFrequency: frequency
        }
      };

      mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

      const result = transformFormDataToManualInvestmentReturn(mockFormData);

      expect(result.item?.manualInvestmentRecurrenceFrequency).toBe(frequency);
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

    mockGetManualInvestmentReturnValidationResult.mockReturnValue(mockValidationResult as any);

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Category field is required']);
  });

  it('handles unexpected errors gracefully', () => {
    const mockFormData = new FormData();
    
    mockGetManualInvestmentReturnValidationResult.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = transformFormDataToManualInvestmentReturn(mockFormData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nUnexpected error']);
  });
});
