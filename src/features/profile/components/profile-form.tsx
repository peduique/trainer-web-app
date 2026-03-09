'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/models/profile/profile.schema';
import { useUpdateProfile } from '@/features/profile/hooks/use-profile';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/models/profile/profile.schema';

interface Props {
  profile: Profile;
}

export function ProfileForm({ profile }: Props) {
  const { mutate, isPending, isSuccess, error } = useUpdateProfile();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name ?? '',
      username: profile.username ?? '',
      workout_start_timer_preference: profile.workout_start_timer_preference ?? 'ask',
      workout_timer_default_seconds: profile.workout_timer_default_seconds ?? 60,
    },
  });

  useEffect(() => {
    reset({
      name: profile.name ?? '',
      username: profile.username ?? '',
      workout_start_timer_preference: profile.workout_start_timer_preference ?? 'ask',
      workout_timer_default_seconds: profile.workout_timer_default_seconds ?? 60,
    });
  }, [profile, reset]);

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-4">
      <Input label="Full Name" error={errors.name?.message} {...register('name')} />
      <Input label="Username" error={errors.username?.message} {...register('username')} />
      <Select
        label="Workout Timer"
        options={[
          { value: 'ask', label: 'Ask every time' },
          { value: 'always', label: 'Always start' },
          { value: 'never', label: 'Never start' },
        ]}
        {...register('workout_start_timer_preference')}
      />
      <Input
        label="Default Timer Duration (seconds)"
        type="number"
        min={10}
        max={300}
        error={errors.workout_timer_default_seconds?.message}
        {...register('workout_timer_default_seconds', { valueAsNumber: true })}
      />
      {error && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">Profile updated!</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
