import { fetchWithAuth } from '@/lib/apiClient';

type ExpenseCategory = {
  id: number;
  name: string;
};

export async function useExpenseCategories(): Promise<ExpenseCategory[]> {
    return await fetchWithAuth<ExpenseCategory[]>('ExpenseCategories');
}
