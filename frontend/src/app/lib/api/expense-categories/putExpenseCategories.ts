'use server'
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function putExpenseCategories(expenseCategory: ExpenseCategory): Promise<{data: ExpenseCategory, responseMessage: string, successful: boolean}> {
  'use server'
  return await fetchWithAuth<ExpenseCategory>(
    {
      endpoint: `ExpenseCategories/${expenseCategory.id}`,
      method: HttpMethod.PUT,
      body: expenseCategory,
    }
  )
};
