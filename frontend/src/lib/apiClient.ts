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
  body?: any;
};

export async function fetchWithAuth<T>(fetchOptions: FetchOptions): Promise<{ data: T; responseMessage: string, successful: boolean }> {
  const token = await getAccessToken();
  if (!token) 
    return { data: {} as T, responseMessage: "Not authorized.", successful: false };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const request: RequestInit = {
    method: fetchOptions.method,
    headers: headers,
    cache: 'no-cache',
  };
  
  if (fetchOptions.body) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(fetchOptions.body);
  }

  const res = await fetch(`${API_BASE_URL}/${fetchOptions.endpoint}`, request);

  if (!res.ok) 
    return { data: {} as T, responseMessage: await res.text(), successful: res.ok };
  
  const data = await res.json() as T;
  return { data, responseMessage: "", successful: res.ok };
}
