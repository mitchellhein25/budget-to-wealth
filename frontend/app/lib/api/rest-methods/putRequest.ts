'use server';
import { FetchResult, fetchWithAuth, HttpMethod } from '../';

export async function putRequest<T>(endpoint: string, id: string, body: object): Promise<FetchResult<T>> {
  return await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.PUT,
      body: body
    }
  )
};
