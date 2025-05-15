'use server'
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function deleteExpenseCategories(id: number): Promise<{data: ExpenseCategory, responseMessage: string, successful: boolean}> {
  'use server'
  return await fetchWithAuth<ExpenseCategory>(
    {
      endpoint: `ExpenseCategories/${id}`,
      method: HttpMethod.DELETE
    }
  )
};
