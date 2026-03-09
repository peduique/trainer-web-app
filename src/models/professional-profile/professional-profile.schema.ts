import { z } from 'zod';

export const professionalProfileSchema = z.object({
  id: z.string(),
  uuid: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  avatar_url: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  specialties: z.array(z.string()).optional(),
  credentials: z.string().nullable().optional(),
});

export type ProfessionalProfile = z.infer<typeof professionalProfileSchema>;
