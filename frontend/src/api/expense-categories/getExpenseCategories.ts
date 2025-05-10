import { fetchWithAuth, HttpMethod } from '@/lib/apiClient';
import { ExpenseCategory } from '@/models/ExpenseCategory';

export async function useExpenseCategories(): Promise<ExpenseCategory[]> {
    return await fetchWithAuth<ExpenseCategory[]>(
      {
        endpoint: 'ExpenseCategories',
        method: HttpMethod.GET,
      }
    );
}
