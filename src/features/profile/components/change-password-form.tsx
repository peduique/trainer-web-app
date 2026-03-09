'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordInput } from '@/models/profile/profile.schema';
import { changePassword } from '@/models/auth/auth.api';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChangePasswordForm() {
  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (data: { current_password: string; password: string }) => changePassword(data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordInput) => {
    mutate(
      { current_password: data.current_password, password: data.password },
      { onSuccess: () => reset() }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Current Password" type="password" error={errors.current_password?.message} {...register('current_password')} />
      <Input label="New Password" type="password" error={errors.password?.message} {...register('password')} />
      <Input label="Confirm New Password" type="password" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
      {error && <p role="alert" className="text-sm text-red-600">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">Password changed successfully!</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
}
