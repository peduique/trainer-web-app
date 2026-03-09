import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  workout_start_timer_preference: z.enum(['ask', 'always', 'never']).optional(),
  workout_timer_default_seconds: z.number().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  workout_start_timer_preference: z.enum(['ask', 'always', 'never']).optional(),
  workout_timer_default_seconds: z.number().min(10).max(300).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
