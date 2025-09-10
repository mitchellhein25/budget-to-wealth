import { RecurrenceFrequency } from '@/app/cashflow';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, manualInvestmentReturnFormOnChange } from '@/app/net-worth/investment-returns';

const formID = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

// Mock the cleanPercentageInput function
jest.mock('@/app/lib/utils', () => ({
  cleanPercentageInput: jest.fn((value) => {
    if (value === 'invalid') return null;
    return value.replace(/[^\d.]/g, '');
  }),
  replaceSpacesWithDashes: jest.fn()
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

describe('manualInvestmentReturnFormOnChange', () => {
  const mockSetEditingFormData = jest.fn();
  const mockCleanPercentageInput = jest.requireMock('@/app/lib/utils').cleanPercentageInput;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates form data for regular input fields', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentCategoryId`,
        value: 'category-1'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({ manualInvestmentCategoryId: 'old-value' });
    
    expect(result).toEqual({
      manualInvestmentCategoryId: 'category-1'
    });
  });

  it('cleans percentage input values', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentPercentageReturn`,
        value: '5.75%'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanPercentageInput).toHaveBeenCalledWith('5.75%');
    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
  });

  it('returns early when percentage input cleaning returns null', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentPercentageReturn`,
        value: 'invalid'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).not.toHaveBeenCalled();
  });

  it('updates recurrence frequency field', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentRecurrenceFrequency`,
        value: RecurrenceFrequency.MONTHLY
      }
    } as React.ChangeEvent<HTMLSelectElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({ 
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    });
    
    expect(result).toEqual({
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    });
  });

  it('removes recurrence end date when frequency is cleared', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentRecurrenceFrequency`,
        value: ''
      }
    } as React.ChangeEvent<HTMLSelectElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({ 
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    });
    
    expect(result).toEqual({
      manualInvestmentRecurrenceFrequency: ''
    });
    expect(result.manualInvestmentRecurrenceEndDate).toBeUndefined();
  });
});
