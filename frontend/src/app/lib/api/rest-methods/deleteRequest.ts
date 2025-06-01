'use server'
import { revalidatePath } from 'next/cache';
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function deleteRequest<T>(endpoint: string, id: number, revalidateUrl: string): Promise<{data: T, responseMessage: string, successful: boolean}> {
  const result = await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.DELETE
    }
  );
  revalidatePath(revalidateUrl);
  return result;
};
