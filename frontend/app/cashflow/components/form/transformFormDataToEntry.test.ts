import { transformCashFlowFormDataToEntry } from './functions/transformFormDataToEntry';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from '../../components';

jest.mock('@/app/components/Utils', () => ({
  convertDollarsToCents: jest.fn(),
  numberRegex: /^\d+(\.\d{0,2})?$/,
}));

import { convertDollarsToCents } from '@/app/components/Utils';

const mockConvertDollarsToCents = convertDollarsToCents as jest.MockedFunction<typeof convertDollarsToCents>;

describe('transformCashFlowFormDataToEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transforms valid income form data to entry', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-description`, 'Test income');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceFrequency`, 'Monthly');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceEndDate`, '2024-12-31');

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
    const formData = new FormData();
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-amount`, '50.25');
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-categoryId`, '1');

    mockConvertDollarsToCents.mockReturnValue(5025);

    const result = transformCashFlowFormDataToEntry(formData, EXPENSE_ITEM_NAME);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 5025,
      date: '2024-01-15',
      categoryId: '1',
      description: '',
      entryType: EXPENSE_ITEM_NAME,
    });
  });

  it('returns error for validation failure', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, 'invalid');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/currency format/i);
  });

  it('returns error for invalid amount conversion', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    mockConvertDollarsToCents.mockReturnValue(null);

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Invalid amount format']);
  });

  it('handles missing optional fields', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    mockConvertDollarsToCents.mockReturnValue(15075);

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 15075,
      date: '2024-01-15',
      categoryId: '2',
      description: '',
      entryType: INCOME_ITEM_NAME,
    });
    expect(result.item?.recurrenceFrequency).toBeUndefined();
    expect(result.item?.recurrenceEndDate).toBeUndefined();
  });

  it('handles unexpected errors', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    mockConvertDollarsToCents.mockImplementation(() => {
      throw new Error('Test error');
    });

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/unexpected validation error/i);
    expect(result.errors[0]).toMatch(/Test error/);
  });

  it('handles error without message property', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    mockConvertDollarsToCents.mockImplementation(() => {
      throw 'String error';
    });

    const result = transformCashFlowFormDataToEntry(formData, INCOME_ITEM_NAME);

    expect(result.item).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/unexpected validation error/i);
  });
}); 