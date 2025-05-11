'use server'
import { fetchWithAuth, HttpMethod } from '@/lib/apiClient';
import { ExpenseCategory } from '@/models/ExpenseCategory';

export async function postExpenseCategories(expenseCategory: ExpenseCategory): Promise<{data: ExpenseCategory, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<ExpenseCategory>(
    {
      endpoint: 'ExpenseCategories',
      method: HttpMethod.POST,
      body: expenseCategory,
    }
  )
};
