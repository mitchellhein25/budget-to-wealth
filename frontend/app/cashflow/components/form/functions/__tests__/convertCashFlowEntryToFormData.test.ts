import { convertCashFlowEntryToFormData } from '@/app/cashflow/components/form/functions/convertCashFlowEntryToFormData';
import { CashFlowEntry } from '@/app/cashflow';
import { CashFlowType, RecurrenceFrequency } from '@/app/cashflow';

describe('convertCashFlowEntryToFormData', () => {
  const baseCashFlowEntry: CashFlowEntry = {
    id: 123,
    amount: 15000,
    entryType: CashFlowType.INCOME,
    categoryId: 'cat-1',
    date: '2024-01-15',
    description: 'Test description',
    userId: 'user-1',
    recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    recurrenceEndDate: '2024-12-31',
  };

  it('converts cash flow entry with all fields to form data', () => {
    const result = convertCashFlowEntryToFormData(baseCashFlowEntry);

    expect(result).toEqual({
      id: '123',
      amount: '150.00',
      date: new Date('2024-01-15'),
      categoryId: 'cat-1',
      description: 'Test description',
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
      recurrenceEndDate: '2024-12-31',
    });
  });

  it('converts cash flow entry with undefined id', () => {
    const entryWithoutId = { ...baseCashFlowEntry, id: undefined };
    const result = convertCashFlowEntryToFormData(entryWithoutId);

    expect(result.id).toBeUndefined();
  });

  it('converts cash flow entry with zero amount', () => {
    const entryWithZeroAmount = { ...baseCashFlowEntry, amount: 0 };
    const result = convertCashFlowEntryToFormData(entryWithZeroAmount);

    expect(result.amount).toBe('0.00');
  });

  it('converts cash flow entry with negative amount', () => {
    const entryWithNegativeAmount = { ...baseCashFlowEntry, amount: -5000 };
    const result = convertCashFlowEntryToFormData(entryWithNegativeAmount);

    expect(result.amount).toBe('-50.00');
  });

  it('converts cash flow entry with undefined description', () => {
    const entryWithoutDescription = { ...baseCashFlowEntry, description: undefined };
    const result = convertCashFlowEntryToFormData(entryWithoutDescription);

    expect(result.description).toBe('');
  });

  it('converts cash flow entry with empty description', () => {
    const entryWithEmptyDescription = { ...baseCashFlowEntry, description: '' };
    const result = convertCashFlowEntryToFormData(entryWithEmptyDescription);

    expect(result.description).toBe('');
  });

  it('converts cash flow entry without recurrence fields', () => {
    const entryWithoutRecurrence = {
      ...baseCashFlowEntry,
      recurrenceFrequency: undefined,
      recurrenceEndDate: undefined,
    };
    const result = convertCashFlowEntryToFormData(entryWithoutRecurrence);

    expect(result.recurrenceFrequency).toBeUndefined();
    expect(result.recurrenceEndDate).toBeUndefined();
  });

  it('converts cash flow entry with only recurrence frequency', () => {
    const entryWithOnlyFrequency = {
      ...baseCashFlowEntry,
      recurrenceEndDate: undefined,
    };
    const result = convertCashFlowEntryToFormData(entryWithOnlyFrequency);

    expect(result.recurrenceFrequency).toBe(RecurrenceFrequency.MONTHLY);
    expect(result.recurrenceEndDate).toBeUndefined();
  });

  it('converts cash flow entry with only recurrence end date', () => {
    const entryWithOnlyEndDate = {
      ...baseCashFlowEntry,
      recurrenceFrequency: undefined,
    };
    const result = convertCashFlowEntryToFormData(entryWithOnlyEndDate);

    expect(result.recurrenceFrequency).toBeUndefined();
    expect(result.recurrenceEndDate).toBe('2024-12-31');
  });

  it('handles decimal amounts correctly', () => {
    const entryWithDecimalAmount = { ...baseCashFlowEntry, amount: 12345 };
    const result = convertCashFlowEntryToFormData(entryWithDecimalAmount);

    expect(result.amount).toBe('123.45');
  });

  it('handles large amounts correctly', () => {
    const entryWithLargeAmount = { ...baseCashFlowEntry, amount: 123456789 };
    const result = convertCashFlowEntryToFormData(entryWithLargeAmount);

    expect(result.amount).toBe('1234567.89');
  });
});
