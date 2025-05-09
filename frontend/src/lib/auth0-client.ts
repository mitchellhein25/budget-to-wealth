import { SessionResponse } from '@/models/auth';

export async function getSession(): Promise<SessionResponse | null> {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return null;
  }
}