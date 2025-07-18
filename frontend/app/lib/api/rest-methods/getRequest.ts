'use server';
import { fetchWithAuth, HttpMethod } from '@/app/lib/api/apiClient';

export async function getRequest<T>(endpoint: string): Promise<{data: T[] | null, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<T[]>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}

export async function getRequestSingle<T>(endpoint: string): Promise<{data: T | null, responseMessage: string, successful: boolean}> {
  return await fetchWithAuth<T>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}
