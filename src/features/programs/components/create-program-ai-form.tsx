'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createProgramAiSchema,
  type CreateProgramAiInput,
} from '@/models/programs/programs.schema';
import { useCreateProgramAi } from '@/features/programs/hooks/use-create-program-ai';
import { AiGenerationProgress } from './ai-generation-progress';
import { Button } from '@/components/ui/button';
import { ChipGroupField } from './chip-group-field';
import { CheckboxField } from './checkbox-field';

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const WEEKS_OPTIONS = [
  { value: '4', label: '4 Weeks' },
  { value: '6', label: '6 Weeks' },
  { value: '8', label: '8 Weeks' },
];

const DAYS_PER_WEEK_OPTIONS = [
  { value: '2', label: '2 Days' },
  { value: '3', label: '3 Days' },
  { value: '4', label: '4 Days' },
  { value: '5', label: '5 Days' },
  { value: '6', label: '6 Days' },
];

const DURATION_OPTIONS = [
  { value: '10', label: '10 min' },
  { value: '20', label: '20 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
];

const GOAL_OPTIONS = [
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'strength_gain', label: 'Strength Gain' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'metcon_hiit', label: 'METCON / HIIT' },
  { value: 'hybrid_athlete', label: 'Hybrid Athlete' },
];

const EMPHASIS_OPTIONS = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'upper_body', label: 'Upper Body Bias' },
  { value: 'lower_body', label: 'Lower Body Bias' },
  { value: 'push_pull', label: 'Push / Pull' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'bodyweight', label: 'Bodyweight Only' },
  { value: 'dumbbells', label: 'Dumbbells Only' },
  { value: 'home_gym', label: 'Home Gym' },
  { value: 'full_gym', label: 'Full Gym' },
];

const INJURY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'low_back', label: 'Low Back' },
  { value: 'knees', label: 'Knees' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'wrists_elbows', label: 'Wrists / Elbows' },
  { value: 'hips', label: 'Hips' },
  { value: 'neck_cervical', label: 'Neck / Cervical' },
];

export function CreateProgramAiForm() {
  const { mutate, isPending, generationStatus, error } = useCreateProgramAi();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProgramAiInput>({
    resolver: zodResolver(createProgramAiSchema),
    defaultValues: {
      goal: 'build_muscle',
      difficulty: 'beginner',
      weeks: '4',
      days_per_week: '2',
      duration_minutes: '10',
      emphasis: 'balanced',
      equipment: 'bodyweight',
      injuries: ['none'],
      include_warm_up: true,
      include_stretching: true,
    },
  });

  if (generationStatus) {
    return <AiGenerationProgress status={generationStatus} />;
  }

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <ChipGroupField
          name="goal"
          control={control}
          label="Goal"
          options={GOAL_OPTIONS}
          error={errors.goal?.message}
        />
        <ChipGroupField
          name="difficulty"
          control={control}
          label="Difficulty"
          options={DIFFICULTY_OPTIONS}
          error={errors.difficulty?.message}
        />
        <ChipGroupField
          name="weeks"
          control={control}
          label="Program Length"
          options={WEEKS_OPTIONS}
          error={errors.weeks?.message}
        />
        <ChipGroupField
          name="days_per_week"
          control={control}
          label="Days per Week"
          options={DAYS_PER_WEEK_OPTIONS}
          error={errors.days_per_week?.message}
        />
        <ChipGroupField
          name="duration_minutes"
          control={control}
          label="Session Duration"
          options={DURATION_OPTIONS}
          error={errors.duration_minutes?.message}
        />
        <ChipGroupField
          name="emphasis"
          control={control}
          label="Emphasis"
          options={EMPHASIS_OPTIONS}
          error={errors.emphasis?.message}
        />
        <ChipGroupField
          name="equipment"
          control={control}
          label="Equipment"
          options={EQUIPMENT_OPTIONS}
          error={errors.equipment?.message}
        />
        <ChipGroupField
          name="injuries"
          control={control}
          label="Injuries / Limitations"
          options={INJURY_OPTIONS}
          error={errors.injuries?.message}
          isMulti
          exclusiveValue="none"
        />
      </div>

      <div className="flex flex-wrap gap-6 border-t border-border pt-6">
        <CheckboxField
          name="include_warm_up"
          control={control}
          label="Include Warm-Up"
        />
        <CheckboxField
          name="include_stretching"
          control={control}
          label="Include Stretching"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Submitting...' : 'Generate Program'}
      </Button>
    </form>
  );
}
