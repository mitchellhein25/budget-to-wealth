'use server'
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function postExpenseCategories(expenseCategory: ExpenseCategory): Promise<{data: ExpenseCategory, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<ExpenseCategory>(
    {
      endpoint: 'ExpenseCategories',
      method: HttpMethod.POST,
      body: expenseCategory,
    }
  )
};
