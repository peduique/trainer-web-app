'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProgramAiSchema, type CreateProgramAiInput } from '@/models/programs/programs.schema';
import { useCreateProgramAi } from '@/features/programs/hooks/use-create-program-ai';
import { AiGenerationProgress } from './ai-generation-progress';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

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
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CreateProgramAiInput>({
    resolver: zodResolver(createProgramAiSchema),
    defaultValues: {
      difficulty: 'intermediate',
      weeks: '8',
      days_per_week: '4',
      duration_minutes: '45',
      goal: 'build_muscle',
      emphasis: 'balanced',
      equipment: 'full_gym',
      injuries: ['none'],
      include_warm_up: true,
      include_stretching: true,
    },
  });

  const injuries = watch('injuries');

  const toggleInjury = (val: string) => {
    const current = injuries ?? [];
    if (val === 'none') {
      setValue('injuries', ['none']);
      return;
    }
    const filtered = current.filter((i) => i !== 'none');
    setValue(
      'injuries',
      filtered.includes(val as never)
        ? filtered.filter((i) => i !== val)
        : [...filtered, val as never],
    );
  };

  if (generationStatus) {
    return <AiGenerationProgress status={generationStatus} />;
  }

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Difficulty"
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'expert', label: 'Expert' },
          ]}
          error={errors.difficulty?.message}
          {...register('difficulty')}
        />

        <Select
          label="Program Length"
          options={[
            { value: '4', label: '4 Weeks' },
            { value: '6', label: '6 Weeks' },
            { value: '8', label: '8 Weeks' },
          ]}
          error={errors.weeks?.message}
          {...register('weeks')}
        />

        <Select
          label="Days per Week"
          options={[
            { value: '2', label: '2 Days' },
            { value: '3', label: '3 Days' },
            { value: '4', label: '4 Days' },
            { value: '5', label: '5 Days' },
            { value: '6', label: '6 Days' },
          ]}
          error={errors.days_per_week?.message}
          {...register('days_per_week')}
        />

        <Select
          label="Session Duration"
          options={[
            { value: '10', label: '10 min' },
            { value: '20', label: '20 min' },
            { value: '30', label: '30 min' },
            { value: '45', label: '45 min' },
            { value: '60', label: '60 min' },
            { value: '90', label: '90 min' },
          ]}
          error={errors.duration_minutes?.message}
          {...register('duration_minutes')}
        />

        <Select
          label="Goal"
          options={[
            { value: 'build_muscle', label: 'Build Muscle' },
            { value: 'strength_gain', label: 'Strength Gain' },
            { value: 'weight_loss', label: 'Weight Loss' },
            { value: 'metcon_hiit', label: 'METCON / HIIT' },
            { value: 'hybrid_athlete', label: 'Hybrid Athlete' },
          ]}
          error={errors.goal?.message}
          {...register('goal')}
        />

        <Select
          label="Emphasis"
          options={[
            { value: 'balanced', label: 'Balanced' },
            { value: 'upper_body', label: 'Upper Body Bias' },
            { value: 'lower_body', label: 'Lower Body Bias' },
            { value: 'push_pull', label: 'Push / Pull' },
          ]}
          error={errors.emphasis?.message}
          {...register('emphasis')}
        />

        <Select
          label="Equipment"
          options={[
            { value: 'bodyweight', label: 'Bodyweight Only' },
            { value: 'dumbbells', label: 'Dumbbells Only' },
            { value: 'home_gym', label: 'Home Gym' },
            { value: 'full_gym', label: 'Full Gym' },
          ]}
          error={errors.equipment?.message}
          {...register('equipment')}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Injuries / Limitations</p>
        <div className="flex flex-wrap gap-3">
          {INJURY_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={injuries?.includes(opt.value as never) ?? false}
              onChange={() => toggleInjury(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <Controller
          name="include_warm_up"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="Include Warm-Up"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        <Controller
          name="include_stretching"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="Include Stretching"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Submitting...' : 'Generate Program'}
      </Button>
    </form>
  );
}
