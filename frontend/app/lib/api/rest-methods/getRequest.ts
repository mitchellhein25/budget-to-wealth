'use server';
import { fetchWithAuth, HttpMethod } from '@/app/lib/api/apiClient';

export type GetRequestResultSingle<T> = {
  data: T | null,
  responseMessage: string,
  successful: boolean
}
export type GetRequestResultList<T> = {
  data: T[] | null,
  responseMessage: string,
  successful: boolean
}

export async function getRequestList<T>(endpoint: string): Promise<GetRequestResultList<T>> {
  return await fetchWithAuth<T[]>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}

export async function getRequestSingle<T>(endpoint: string): Promise<GetRequestResultSingle<T>> {
  return await fetchWithAuth<T>(
    {
      endpoint: endpoint,
      method: HttpMethod.GET,
    }
  );
}
