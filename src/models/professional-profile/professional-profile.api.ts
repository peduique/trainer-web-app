import { apiClient } from '@/lib/api/client';
import type { ProfessionalProfile } from './professional-profile.schema';

export async function fetchProfessionalProfile(uuid: string): Promise<ProfessionalProfile> {
  return apiClient.get<ProfessionalProfile>(`/professional_profiles/${uuid}`);
}
