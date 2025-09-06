import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../../../constants';
import { getManualInvestmentReturnValidationResult } from '../getManualInvestmentReturnValidationResult';
import { RecurrenceFrequency } from '@/app/cashflow/components/RecurrenceFrequency';

const formID = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

describe('getManualInvestmentReturnValidationResult', () => {
  it('validates correct form data successfully', () => {
    const formData = new FormData();
    formData.append(`${formID}-id`, '123e4567-e89b-12d3-a456-426614174000');
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');
    formData.append(`${formID}-manualInvestmentRecurrenceFrequency`, RecurrenceFrequency.MONTHLY);
    formData.append(`${formID}-manualInvestmentRecurrenceEndDate`, '2024-12-31');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
        manualInvestmentRecurrenceEndDate: '2024-12-31'
      });
    }
  });

  it('validates form data without optional id', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: undefined,
        manualInvestmentCategoryId: 'category-1',
        manualInvestmentReturnDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: undefined,
        manualInvestmentRecurrenceEndDate: undefined
      });
    }
  });

  it('validates form data with recurrence frequency and end date', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');
    formData.append(`${formID}-manualInvestmentRecurrenceFrequency`, RecurrenceFrequency.WEEKLY);
    formData.append(`${formID}-manualInvestmentRecurrenceEndDate`, '2024-06-30');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.manualInvestmentRecurrenceFrequency).toBe(RecurrenceFrequency.WEEKLY);
      expect(result.data.manualInvestmentRecurrenceEndDate).toBe('2024-06-30');
    }
  });

  it('rejects missing required category field', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.message === 'Required')).toBe(true);
    }
  });

  it('handles missing return date field by creating default date', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.manualInvestmentReturnDate).toEqual(new Date(0)); // Unix epoch
    }
  });

  it('rejects missing required percentage return field', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.message === 'Required')).toBe(true);
    }
  });

  it('rejects invalid date format', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, 'invalid-date');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID format for id', () => {
    const formData = new FormData();
    formData.append(`${formID}-id`, 'invalid-uuid');
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-manualInvestmentReturnDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles empty string values as undefined', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, '');
    formData.append(`${formID}-manualInvestmentReturnDate`, '');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles whitespace-only values as undefined', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, '   ');
    formData.append(`${formID}-manualInvestmentReturnDate`, '   ');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '   ');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });
});
