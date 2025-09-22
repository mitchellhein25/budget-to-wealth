'use server';
import { FetchResult, fetchWithAuth, HttpMethod } from '@/app/lib/api';

export async function putRequest<T>(endpoint: string, id: string, body: object): Promise<FetchResult<T>> {
  return await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}`,
      method: HttpMethod.PUT,
      body: body
    }
  )
};

export async function archivePutRequest<T>(endpoint: string, id: number): Promise<FetchResult<T>> {
  return await fetchWithAuth<T>(
    {
      endpoint: `${endpoint}/${id}/archive`,
      method: HttpMethod.PUT
    }
  )
};
