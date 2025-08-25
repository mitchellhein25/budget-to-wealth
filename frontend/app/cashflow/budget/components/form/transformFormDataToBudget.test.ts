import { BUDGET_ITEM_NAME_LOWERCASE, transformFormDataToBudget } from '..';
import { convertDollarsToCents } from '@/app/components';

// Mock only the convertDollarsToCents function
jest.mock('@/app/components', () => ({
  ...jest.requireActual('@/app/components'),
  convertDollarsToCents: jest.fn(),
}));

const budgetAmountField = `${BUDGET_ITEM_NAME_LOWERCASE}-amount`;
const budgetCategoryIdField = `${BUDGET_ITEM_NAME_LOWERCASE}-categoryId`;

describe('transformFormDataToBudget', () => {
  const mockConvertDollarsToCents = jest.mocked(convertDollarsToCents);

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    mockConvertDollarsToCents.mockImplementation((amount: string) => {
      const num = parseFloat(amount);
      return isNaN(num) ? null : Math.round(num * 100);
    });
  });

  it('successfully transforms valid form data', () => {
    const formData = new FormData();
    formData.append(budgetAmountField, '100.50');
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.errors).toEqual([]);
    expect(result.item).toEqual({
      amount: 10050,
      categoryId: 'category-123',
      name: '',
    });
  });

  it('returns error for missing amount', () => {
    const formData = new FormData();
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors.some(error => /amount/i.test(error))).toBe(true);
  });

  it('returns error for missing category', () => {
    const formData = new FormData();
    formData.append(budgetAmountField, '100.50');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors.some(error => /category/i.test(error))).toBe(true);
  });

  it('returns error for invalid amount format', () => {
    const formData = new FormData();
    formData.append(budgetAmountField, 'invalid-amount');
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors.some(error => /amount/i.test(error))).toBe(true);
  });

  it('returns error when convertDollarsToCents returns null', () => {
    mockConvertDollarsToCents.mockReturnValue(null);
    
    const formData = new FormData();
    formData.append(budgetAmountField, '0.001');
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['Amount must be a valid currency format (e.g., 100.50)']);
  });

  it('handles unexpected errors in try-catch block', () => {
    mockConvertDollarsToCents.mockImplementation(() => {
      throw new Error('Test error message');
    });

    const formData = new FormData();
    formData.append(budgetAmountField, '100.50');
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\nTest error message']);
  });

  it('handles unexpected errors without message property', () => {
    mockConvertDollarsToCents.mockImplementation(() => {
      throw new Error();
    });

    const formData = new FormData();
    formData.append(budgetAmountField, '100.50');
    formData.append(budgetCategoryIdField, 'category-123');

    const result = transformFormDataToBudget(formData);

    expect(result.item).toBeNull();
    expect(result.errors).toEqual(['An unexpected validation error occurred.\n']);
  });
});