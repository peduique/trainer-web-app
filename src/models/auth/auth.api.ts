import { apiClient } from '@/lib/api/client';
import type { LoginInput, SignupInput, User } from './auth.schema';

export async function fetchCurrentUser(): Promise<User> {
  return apiClient.get<User>('/api/auth/me');
}

export async function login(data: LoginInput): Promise<User> {
  return apiClient.post<User>('/api/auth/login', data);
}

export async function logout(): Promise<void> {
  return apiClient.delete<void>('/api/auth/logout');
}

export async function signup(data: SignupInput): Promise<User> {
  return apiClient.post<User>('/api/auth/signup', data);
}

export async function forgotPassword(email: string): Promise<void> {
  return apiClient.post<void>('/api/auth/forgot-password', { email });
}

export async function verifyResetCode(email: string, code: string): Promise<{ token: string }> {
  return apiClient.post<{ token: string }>('/api/auth/verify-reset-code', { email, code });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  return apiClient.post<void>('/api/auth/reset-password', { token, password });
}

export async function changePassword(data: { current_password: string; password: string }): Promise<void> {
  return apiClient.post<void>('/api/auth/change-password', data);
}
