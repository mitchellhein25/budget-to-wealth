import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../../..';
import { manualInvestmentReturnFormOnChange } from '../manualInvestmentReturnFormOnChange';
import { RecurrenceFrequency } from '@/app/cashflow/components/RecurrenceFrequency';

const formID = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

// Mock the cleanPercentageInput function
jest.mock('@/app/components', () => ({
  cleanPercentageInput: jest.fn((value) => {
    if (value === 'invalid') return null;
    return value.replace(/[^\d.]/g, '');
  })
}));

describe('manualInvestmentReturnFormOnChange', () => {
  const mockSetEditingFormData = jest.fn();
  const mockCleanPercentageInput = jest.requireMock('@/app/components').cleanPercentageInput;

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

  it('preserves existing form data when updating', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentReturnDate`,
        value: '2024-01-15'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const existingData = {
      manualInvestmentCategoryId: 'category-1',
      manualInvestmentPercentageReturn: '5.75'
    };

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction(existingData);
    
    expect(result).toEqual({
      ...existingData,
      manualInvestmentReturnDate: '2024-01-15'
    });
  });

  it('handles select element events', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentRecurrenceFrequency`,
        value: RecurrenceFrequency.WEEKLY
      }
    } as React.ChangeEvent<HTMLSelectElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    
    expect(result).toEqual({
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY
    });
  });

  it('handles input element events', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentReturnDate`,
        value: '2024-01-15'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    
    expect(result).toEqual({
      manualInvestmentReturnDate: '2024-01-15'
    });
  });

  it('correctly extracts field name from full input name', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentCategoryId`,
        value: 'new-category'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    
    expect(result).toEqual({
      manualInvestmentCategoryId: 'new-category'
    });
  });

  it('handles empty string values', () => {
    const event = {
      target: {
        name: `${formID}-manualInvestmentCategoryId`,
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    manualInvestmentReturnFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    
    expect(result).toEqual({
      manualInvestmentCategoryId: ''
    });
  });
});
