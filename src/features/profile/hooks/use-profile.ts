import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile, uploadAvatar, deleteAvatar, deleteAccount } from '@/models/profile/profile.api';
import type { UpdateProfileInput } from '@/models/profile/profile.schema';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  });
  return { profile: data ?? null, isLoading, error };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updated);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => { window.location.href = '/login'; },
  });
}
