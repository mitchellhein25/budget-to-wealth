'use server';
import { FetchResult, fetchWithAuth, HttpMethod } from '@/app/lib/api/apiClient';

export async function getRequestList<T>(endpoint: string): Promise<FetchResult<T[]>> {
  return await fetchWithAuth<T[]>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}

export async function getRequestSingle<T>(endpoint: string): Promise<FetchResult<T>> {
  return await fetchWithAuth<T>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}
