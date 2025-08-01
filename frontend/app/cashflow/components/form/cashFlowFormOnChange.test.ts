import { cashFlowFormOnChange } from './functions/cashFlowFormOnChange';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from '../../components';

jest.mock('@/app/components/Utils', () => ({
  cleanCurrencyInput: jest.fn(),
}));

import { cleanCurrencyInput } from '@/app/components/Utils';

const mockCleanCurrencyInput = cleanCurrencyInput as jest.MockedFunction<typeof cleanCurrencyInput>;

describe('cashFlowFormOnChange', () => {
  let setEditingFormData: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setEditingFormData = jest.fn();
  });

  it('updates amount field with cleaned currency input', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-amount`,
        value: '1,500.75',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('1500.75');

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('1,500.75');
    expect(setEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ amount: '1500.75' });
  });

  it('returns early when currency input cleaning returns null', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-amount`,
        value: 'invalid',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue(null);

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('invalid');
    expect(setEditingFormData).not.toHaveBeenCalled();
  });

  it('updates non-amount fields without currency cleaning', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-description`,
        value: 'Test description',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    expect(mockCleanCurrencyInput).not.toHaveBeenCalled();
    expect(setEditingFormData).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ description: 'Test description' });
  });

  it('updates category field', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-categoryId`,
        value: '2',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ categoryId: '2' });
  });

  it('updates date field', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-date`,
        value: '2024-01-15',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ date: '2024-01-15' });
  });

  it('updates recurrence frequency field', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-recurrenceFrequency`,
        value: 'Monthly',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ recurrenceFrequency: 'Monthly' });
  });

  it('removes recurrence end date when frequency is cleared', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-recurrenceFrequency`,
        value: '',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({ 
      recurrenceFrequency: 'Monthly',
      recurrenceEndDate: '2024-12-31'
    });
    expect(result).toEqual({ 
      recurrenceFrequency: '',
      recurrenceEndDate: undefined
    });
  });

  it('preserves existing form data when updating', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-description`,
        value: 'Updated description',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({ 
      amount: '150.75',
      categoryId: '2'
    });
    expect(result).toEqual({ 
      amount: '150.75',
      categoryId: '2',
      description: 'Updated description'
    });
  });

  it('works with expense cash flow type', () => {
    const event = {
      target: {
        name: `${EXPENSE_ITEM_NAME_LOWERCASE}-amount`,
        value: '50.25',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('50.25');

    cashFlowFormOnChange(event, setEditingFormData, EXPENSE_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ amount: '50.25' });
  });

  it('handles recurrence end date field', () => {
    const event = {
      target: {
        name: `${INCOME_ITEM_NAME_LOWERCASE}-recurrenceEndDate`,
        value: '2024-12-31',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    cashFlowFormOnChange(event, setEditingFormData, INCOME_ITEM_NAME);

    const updateFunction = setEditingFormData.mock.calls[0][0];
    const result = updateFunction({});
    expect(result).toEqual({ recurrenceEndDate: '2024-12-31' });
  });
}); 