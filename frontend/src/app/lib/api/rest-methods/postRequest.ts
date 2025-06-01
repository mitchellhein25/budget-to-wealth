'use server'
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function postRequest<T>(endpoint: string, body: object): Promise<{data: T, responseMessage: string, successful: boolean}> {
  const result = await fetchWithAuth<T>(
    {
      endpoint: endpoint,
      method: HttpMethod.POST,
      body: body,
    });
    return result;
};
