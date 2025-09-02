'use server'
import { FetchResult, fetchWithAuth, HttpMethod } from '../';

export async function postRequest<T>(endpoint: string, body: object): Promise<FetchResult<T>> {
  const result = await fetchWithAuth<T>(
    {
      endpoint: endpoint,
      method: HttpMethod.POST,
      body: body,
    });
    return result;
};
