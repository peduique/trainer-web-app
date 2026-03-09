import { env } from '@/config/env';
import type { User } from './auth.schema';

export async function fetchCurrentUser(): Promise<User> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    credentials: 'include',
  });
  if (response.status === 401) throw new Error('Unauthorized');
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to logout');
}
