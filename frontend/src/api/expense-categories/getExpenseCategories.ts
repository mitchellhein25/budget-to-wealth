import { fetchWithAuth, HttpMethod } from '@/lib/apiClient';
import { ExpenseCategory } from '@/models/ExpenseCategory';

export async function getExpenseCategories(): Promise<{data: ExpenseCategory[], responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<ExpenseCategory[]>(
    {
      endpoint: 'ExpenseCategories',
      method: HttpMethod.GET,
    }
  );
}
