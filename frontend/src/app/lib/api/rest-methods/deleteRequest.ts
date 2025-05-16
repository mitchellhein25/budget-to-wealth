'use server'
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function deleteRequest<T>(endpoint: string, id: number): Promise<{data: T, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.DELETE
    }
  )
};
