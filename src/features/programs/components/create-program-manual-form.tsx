'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProgramManualSchema, type CreateProgramManualInput } from '@/models/programs/programs.schema';
import { useCreateProgramManual } from '@/features/programs/hooks/use-create-program-manual';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CreateProgramManualForm() {
  const { mutate, isPending, error } = useCreateProgramManual();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProgramManualInput>({
    resolver: zodResolver(createProgramManualSchema),
    defaultValues: { weeks: 8, days_per_week: 4 },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-4">
      <Input label="Program Name" placeholder="e.g. Summer Strength Block" error={errors.name?.message} {...register('name')} />
      <Input label="Number of Weeks" type="number" min={1} max={52} error={errors.weeks?.message} {...register('weeks', { valueAsNumber: true })} />
      <Input label="Days per Week" type="number" min={1} max={7} error={errors.days_per_week?.message} {...register('days_per_week', { valueAsNumber: true })} />
      {error && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Creating...' : 'Create Program'}
      </Button>
    </form>
  );
}
