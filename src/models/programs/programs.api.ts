import { apiClient } from '@/lib/api/client';
import type { Program, ProgramDetail, CreateProgramAiInput, CreateProgramManualInput, GenerationStatus } from './programs.schema';

const GOAL_LABELS: Record<string, string> = {
  build_muscle: 'Build Muscle',
  strength_gain: 'Strength Gain',
  weight_loss: 'Weight Loss',
  metcon_hiit: 'METCON / HIIT',
  hybrid_athlete: 'Hybrid Athlete',
};

const EMPHASIS_LABELS: Record<string, string> = {
  balanced: 'Balanced',
  upper_body: 'Upper Body Bias',
  lower_body: 'Lower Body Bias',
  push_pull: 'Push / Pull',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  bodyweight: 'Bodyweight Only',
  dumbbells: 'Dumbbells Only',
  home_gym: 'Home Gym',
  full_gym: 'Full Gym',
};

/**
 * Builds the text prompt for AI generation (same format as TR[AI]NER Mobile custom.tsx).
 */
function buildPromptFromInput(data: CreateProgramAiInput): string {
  const preferences: string[] = [];
  if (data.emphasis) {
    preferences.push(`emphasis_${data.emphasis === 'upper_body' ? 'upper_body_bias' : data.emphasis === 'lower_body' ? 'lower_body_bias' : data.emphasis}`);
  }
  if (data.injuries && data.injuries.length > 0) {
    if (data.injuries.includes('none')) {
      preferences.push('injuries_none');
    } else {
      preferences.push(`injuries_${data.injuries.join('_')}`);
    }
  }

  const weeks = data.weeks ?? '4';
  const lines = [
    `Create a ${weeks}-week training program with ${data.days_per_week} days per week.`,
    `Program Length chip: ${weeks} weeks.`,
    `Difficulty level: ${data.difficulty}.`,
    `Training frequency: ${data.days_per_week} days per week.`,
    `Session duration: ${data.duration_minutes} minutes.`,
    `Goal/type: ${GOAL_LABELS[data.goal] ?? data.goal}.`,
    `Emphasis: ${EMPHASIS_LABELS[data.emphasis] ?? data.emphasis}.`,
    `Equipment: ${EQUIPMENT_LABELS[data.equipment] ?? data.equipment}.`,
    data.include_warm_up
      ? 'Warm-up: enabled. Include warm_up.included=true in every workout and provide a short warm_up.description.'
      : 'Warm-up: disabled. Set warm_up.included=false in every workout and keep warm_up.description null or empty.',
    data.include_stretching
      ? 'Post-workout stretching: enabled. Include cooldown.included=true in every workout and provide a short cooldown.description.'
      : 'Post-workout stretching: disabled. Set cooldown.included=false in every workout and keep cooldown.description null or empty.',
    data.difficulty === 'expert' && data.goal === 'hybrid_athlete'
      ? 'Include advanced two-a-day sessions in the weekly plan.'
      : null,
    preferences.length > 0 ? `Preferences: ${preferences.join(', ')}.` : null,
    'Return ONLY the JSON program object (no markdown).',
  ].filter(Boolean);

  return lines.join('\n');
}

export async function fetchPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>('/programs');
}

export async function fetchProgram(uuid: string): Promise<ProgramDetail> {
  return apiClient.get<ProgramDetail>(`/programs/by_uuid/${uuid}`);
}

export async function createProgramAi(data: CreateProgramAiInput): Promise<{ uuid: string }> {
  const prompt = buildPromptFromInput(data);
  return apiClient.post<{ uuid: string }>('/programs/ai_generate_from_text_async', { prompt });
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
