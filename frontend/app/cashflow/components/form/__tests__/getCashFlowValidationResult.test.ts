import { getCashFlowValidationResult } from '../';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME, INCOME_ITEM_NAME_LOWERCASE, EXPENSE_ITEM_NAME_LOWERCASE } from '../../';

describe('getCashFlowValidationResult', () => {
  it('validates valid income form data', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-id`, '123e4567-e89b-12d3-a456-426614174000');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-description`, 'Test income');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceFrequency`, 'Monthly');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceEndDate`, '2024-12-31');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.data.amount).toBe('150.75');
      expect(result.data.date).toEqual(new Date('2024-01-15'));
      expect(result.data.categoryId).toBe('2');
      expect(result.data.description).toBe('Test income');
      expect(result.data.recurrenceFrequency).toBe('Monthly');
      expect(result.data.recurrenceEndDate).toBe('2024-12-31');
    }
  });

  it('validates valid expense form data', () => {
    const formData = new FormData();
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-amount`, '50.25');
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${EXPENSE_ITEM_NAME_LOWERCASE}-categoryId`, '1');

    const result = getCashFlowValidationResult(formData, EXPENSE_ITEM_NAME);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe('50.25');
      expect(result.data.date).toEqual(new Date('2024-01-15'));
      expect(result.data.categoryId).toBe('1');
      expect(result.data.description).toBe('');
      expect(result.data.recurrenceFrequency).toBeUndefined();
      expect(result.data.recurrenceEndDate).toBeUndefined();
    }
  });

  it('returns error for missing amount', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/amount/i);
    }
  });

  it('returns error for invalid amount format', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, 'invalid');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/currency format/i);
    }
  });

  it('returns error for zero amount', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '0');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/greater than 0/i);
    }
  });

  it('returns error for missing date', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2'); 

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/date/i);
    }
  });

  it('returns error for missing category', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/category/i);
    }
  });

  it('handles empty optional fields', () => {
    const formData = new FormData();
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-amount`, '150.75');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-date`, '2024-01-15');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-categoryId`, '2');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-description`, '');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceFrequency`, '');
    formData.append(`${INCOME_ITEM_NAME_LOWERCASE}-recurrenceEndDate`, '');

    const result = getCashFlowValidationResult(formData, INCOME_ITEM_NAME);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('');
      expect(result.data.recurrenceFrequency).toBeUndefined();
      expect(result.data.recurrenceEndDate).toBeUndefined();
    }
  });
}); 