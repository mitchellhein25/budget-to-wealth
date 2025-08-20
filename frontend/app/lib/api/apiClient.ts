import { getAccessToken } from '../auth/getAccessToken';
import { API_BASE_URL } from './apiVariables';

export enum HttpMethod {
  GET = 'GET', 
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
} 

type FetchOptions = {
  endpoint: string;
  method: HttpMethod;
  body?: object;
};

export type FetchResult<T> = { 
  data: T | null;
  responseMessage: string; 
  successful: boolean;
};

export async function fetchWithAuth<T>(fetchOptions: FetchOptions): Promise<FetchResult<T>> {
  const token = await getAccessToken();

  if (!token) 
    return { data: {} as T, responseMessage: "Not authorized.", successful: false };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const request: RequestInit = {
    method: fetchOptions.method,
    headers: headers,
    // cache: 'no-cache',
  };
  
  if (fetchOptions.body) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/${fetchOptions.endpoint}`, request);
    // console.log(`Request: ${fetchOptions.method} ${API_BASE_URL}/${fetchOptions.endpoint}\n${request.body}`);
    // console.log(`Response: ${res.status} ${res.statusText}`);
    if (!res.ok) 
      return { data: {} as T, responseMessage: await res.text(), successful: res.ok };
    
    const data = res.body ? await res.json() as T : null;
    return { data, responseMessage: "", successful: res.ok };
  } catch (error) {
    return { data: {} as T, responseMessage: `Error fetching data: ${error}`, successful: false };
  }
}
