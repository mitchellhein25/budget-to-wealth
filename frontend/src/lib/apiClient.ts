import { API_BASE_URL } from './apiVariables';
import { getAccessToken } from './getAccessToken';

export async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const token = await getAccessToken();
  if (!token) 
    return {} as T;
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching ${endpoint}: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json() as Promise<T>;
}
