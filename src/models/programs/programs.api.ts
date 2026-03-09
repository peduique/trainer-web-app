import { apiClient } from '@/lib/api/client';
import type { Program, ProgramDetail, CreateProgramAiInput, CreateProgramManualInput, GenerationStatus } from './programs.schema';

export async function fetchPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>('/api/programs');
}

export async function fetchProgram(uuid: string): Promise<ProgramDetail> {
  return apiClient.get<ProgramDetail>(`/api/programs/by_uuid/${uuid}`);
}

export async function createProgramAi(data: CreateProgramAiInput): Promise<{ uuid: string }> {
  return apiClient.post<{ uuid: string }>('/api/programs/ai_generate_from_text_async', data);
}

export async function pollProgramGeneration(uuid: string): Promise<GenerationStatus> {
  return apiClient.get<GenerationStatus>(`/api/programs/generation/${uuid}`);
}

export async function createProgramManual(data: CreateProgramManualInput): Promise<Program> {
  return apiClient.post<Program>('/api/programs', data);
}

export async function deleteProgram(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/programs/${id}`);
}

export async function restartProgram(id: number): Promise<void> {
  return apiClient.put<void>(`/api/programs/${id}/restart`);
}
