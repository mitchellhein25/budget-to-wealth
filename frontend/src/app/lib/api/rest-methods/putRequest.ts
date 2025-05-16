'use server';
import { fetchWithAuth, HttpMethod } from '../apiClient';

export async function putRequest<T>(endpoint: string, id: number, body: object): Promise<{data: T, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.PUT,
      body: body
    }
  )
};
