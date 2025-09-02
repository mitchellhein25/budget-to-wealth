'use server'
import { FetchResult, fetchWithAuth, HttpMethod } from '../';

export async function deleteRequest<T>(endpoint: string, id: number): Promise<FetchResult<T>> {
  const result = await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.DELETE
    }
  );
  return result;
};
