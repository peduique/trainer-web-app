import { apiClient } from '@/lib/api/client';
import type { Program, ProgramDetail, CreateProgramAiInput, CreateProgramManualInput, GenerationStatus } from './programs.schema';

export async function fetchPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>('/programs');
}

export async function fetchProgram(uuid: string): Promise<ProgramDetail> {
  return apiClient.get<ProgramDetail>(`/programs/by_uuid/${uuid}`);
}

export async function createProgramAi(data: CreateProgramAiInput): Promise<{ uuid: string }> {
  return apiClient.post<{ uuid: string }>('/programs/ai_generate_from_text_async', data);
}

export async function pollProgramGeneration(uuid: string): Promise<GenerationStatus> {
  return apiClient.get<GenerationStatus>(`/programs/generation/${uuid}`);
}

export async function createProgramManual(data: CreateProgramManualInput): Promise<Program> {
  return apiClient.post<Program>('/programs', data);
}

export async function deleteProgram(id: number): Promise<void> {
  return apiClient.delete<void>(`/programs/${id}`);
}

export async function restartProgram(id: number): Promise<void> {
  return apiClient.put<void>(`/programs/${id}/restart`);
}
