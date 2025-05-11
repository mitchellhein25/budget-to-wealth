import { fetchWithAuth, HttpMethod } from '@/app/lib/api/apiClient';
import { ExpenseCategory } from '@/app/lib/models/ExpenseCategory';

export async function getExpenseCategories(): Promise<{data: ExpenseCategory[], responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<ExpenseCategory[]>(
    {
      endpoint: 'ExpenseCategories',
      method: HttpMethod.GET,
    }
  );
}
