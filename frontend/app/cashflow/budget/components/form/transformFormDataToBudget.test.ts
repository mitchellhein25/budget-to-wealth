import { BUDGET_ITEM_NAME, transformFormDataToBudget } from '..';

const budgetAmountField = `${BUDGET_ITEM_NAME}-amount`;
const budgetCategoryIdField = `${BUDGET_ITEM_NAME}-categoryId`;

describe('transformFormDataToBudget', () => {
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
});