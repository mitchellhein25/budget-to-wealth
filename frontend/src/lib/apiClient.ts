import { API_BASE_URL } from './apiVariables';
import { getAccessToken } from './getAccessToken';


export enum HttpMethod {
  GET = 'GET', 
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
} 

type FetchOptions = {
  endpoint: string;
  method: HttpMethod;
  body?: string | undefined;
  headers?: Record<string, string> | undefined;
};

export async function fetchWithAuth<T>(fetchOptions: FetchOptions): Promise<T> {
  const token = await getAccessToken();
  if (!token) 
    return {} as T;
  const res = await fetch(`${API_BASE_URL}/${fetchOptions.endpoint}`, {
    method: fetchOptions.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
    cache: 'force-cache',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching ${fetchOptions.endpoint}: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json() as Promise<T>;
}
