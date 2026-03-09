import { apiClient } from '@/lib/api/client';
import { setStoredToken, setAuthCookie, clearAuthCookie } from '@/lib/auth-token';
import type { LoginInput, SignupInput, User } from './auth.schema';

export interface AuthResponse {
  token: string;
  user: User;
}

export async function fetchCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me');
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', data);
  setStoredToken(res.token);
  await setAuthCookie(res.token);
  return res;
}

export async function logout(): Promise<void> {
  setStoredToken(null);
  await clearAuthCookie();
  try {
    await apiClient.delete<void>('/auth/logout');
  } catch {
    // Backend may not have logout endpoint
  }
}

export async function signup(data: SignupInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/signup', data);
  setStoredToken(res.token);
  await setAuthCookie(res.token);
  return res;
}

export async function forgotPassword(email: string): Promise<void> {
  return apiClient.post<void>('/auth/forgot-password', { email });
}

export async function verifyResetCode(email: string, code: string): Promise<{ token: string }> {
  return apiClient.post<{ token: string }>('/auth/verify-reset-code', { email, code });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  return apiClient.post<void>('/auth/reset-password', { token, password });
}

export async function changePassword(data: { current_password: string; password: string }): Promise<void> {
  return apiClient.post<void>('/auth/change-password', data);
}
