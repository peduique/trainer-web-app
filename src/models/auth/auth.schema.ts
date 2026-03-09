import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupAboutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
});

const signupCredentialsBaseSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
});

export const signupCredentialsSchema = signupCredentialsBaseSchema.refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const signupSchema = signupAboutSchema.merge(signupCredentialsBaseSchema.omit({ password_confirmation: true })).extend({
  avatar: z.instanceof(File).optional(),
  metric_system: z.enum(['metric', 'imperial']).default('metric'),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const verifyCodeSchema = z.object({
  code: z.string().min(4, 'Enter the code you received'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
