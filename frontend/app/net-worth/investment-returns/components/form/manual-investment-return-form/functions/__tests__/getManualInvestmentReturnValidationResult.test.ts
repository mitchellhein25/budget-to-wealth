import { RecurrenceFrequency } from '@/app/cashflow';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, getManualInvestmentReturnValidationResult } from '@/app/net-worth/investment-returns';

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {
    WEEKLY: 'Weekly',
    EVERY_2_WEEKS: 'Every2Weeks',
    MONTHLY: 'Monthly',
  }
}));

const formID = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

describe('getManualInvestmentReturnValidationResult', () => {
  it('validates correct form data successfully', () => {
    const formData = new FormData();
    formData.append(`${formID}-id`, '123e4567-e89b-12d3-a456-426614174000');
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '2024-01-01');
    formData.append(`${formID}-endDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');
    formData.append(`${formID}-manualInvestmentRecurrenceFrequency`, RecurrenceFrequency.MONTHLY);
    formData.append(`${formID}-manualInvestmentRecurrenceEndDate`, '2024-12-31');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        manualInvestmentCategoryId: 'category-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
        manualInvestmentPercentageReturn: '5.75',
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
        manualInvestmentRecurrenceEndDate: '2024-12-31'
      });
    }
  });

  it('validates form data without optional fields', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '2024-01-01');
    formData.append(`${formID}-endDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.manualInvestmentCategoryId).toBe('category-1');
      expect(result.data.startDate).toEqual(new Date('2024-01-01'));
      expect(result.data.endDate).toEqual(new Date('2024-01-15'));
      expect(result.data.manualInvestmentPercentageReturn).toBe('5.75');
    }
  });

  it('validates all recurrence frequency types', () => {
    const frequencies = [
      RecurrenceFrequency.WEEKLY,
      RecurrenceFrequency.EVERY_2_WEEKS,
      RecurrenceFrequency.MONTHLY
    ];

    frequencies.forEach(frequency => {
      const formData = new FormData();
      formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
      formData.append(`${formID}-startDate`, '2024-01-01');
      formData.append(`${formID}-endDate`, '2024-01-15');
      formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');
      formData.append(`${formID}-manualInvestmentRecurrenceFrequency`, frequency);

      const result = getManualInvestmentReturnValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.manualInvestmentRecurrenceFrequency).toBe(frequency);
      }
    });
  });

  it('validates with different date formats', () => {
    const dateFormats = [
      '2024-01-15',
      '2024/01/15',
      '01/15/2024',
      '2024-12-31T00:00:00.000Z'
    ];

    dateFormats.forEach(dateFormat => {
      const formData = new FormData();
      formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
      formData.append(`${formID}-startDate`, '2024-01-01');
      formData.append(`${formID}-endDate`, dateFormat);
      formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

      const result = getManualInvestmentReturnValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.endDate).toBeInstanceOf(Date);
      }
    });
  });

  it('validates with different percentage formats', () => {
    const percentageFormats = [
      '5.75',
      '0.001',
      '100.00',
      '-2.5',
      '999.99'
    ];

    percentageFormats.forEach(percentage => {
      const formData = new FormData();
      formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
      formData.append(`${formID}-startDate`, '2024-01-01');
      formData.append(`${formID}-endDate`, '2024-01-15');
      formData.append(`${formID}-manualInvestmentPercentageReturn`, percentage);

      const result = getManualInvestmentReturnValidationResult(formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.manualInvestmentPercentageReturn).toBe(percentage);
      }
    });
  });

  it('validates with future dates', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '2030-12-01');
    formData.append(`${formID}-endDate`, '2030-12-31');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.endDate).toEqual(new Date('2030-12-31'));
    }
  });

  it('validates with past dates', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '1989-12-01');
    formData.append(`${formID}-endDate`, '1990-01-01');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.endDate).toEqual(new Date('1990-01-01'));
    }
  });

  it('rejects missing required fields', () => {
    const formData = new FormData();
    formData.append(`${formID}-startDate`, '2024-01-01');
    formData.append(`${formID}-endDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid date format', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '2024-01-01');
    formData.append(`${formID}-endDate`, 'invalid-date');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID format for id', () => {
    const formData = new FormData();
    formData.append(`${formID}-id`, 'invalid-uuid');
    formData.append(`${formID}-manualInvestmentCategoryId`, 'category-1');
    formData.append(`${formID}-startDate`, '2024-01-01');
    formData.append(`${formID}-endDate`, '2024-01-15');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '5.75');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects empty string values', () => {
    const formData = new FormData();
    formData.append(`${formID}-manualInvestmentCategoryId`, '');
    formData.append(`${formID}-startDate`, '');
    formData.append(`${formID}-endDate`, '');
    formData.append(`${formID}-manualInvestmentPercentageReturn`, '');

    const result = getManualInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
  });
});
