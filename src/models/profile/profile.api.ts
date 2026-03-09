import { apiClient } from '@/lib/api/client';
import type { Profile, UpdateProfileInput } from './profile.schema';

export async function fetchProfile(): Promise<Profile> {
  return apiClient.get<Profile>('/api/users/profile');
}

export async function updateProfile(data: UpdateProfileInput): Promise<Profile> {
  return apiClient.patch<Profile>('/api/users/profile', data);
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiClient.upload<{ avatar_url: string }>('/api/users/profile/avatar', formData);
}

export async function deleteAvatar(): Promise<void> {
  return apiClient.delete<void>('/api/users/profile/avatar');
}

export async function deleteAccount(): Promise<void> {
  return apiClient.delete<void>('/api/users/account');
}
