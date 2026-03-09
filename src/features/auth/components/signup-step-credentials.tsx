'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupCredentialsSchema } from '@/models/auth/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CredentialsData = z.infer<typeof signupCredentialsSchema>;

interface Props {
  onSubmit: (data: { email: string; password: string }) => void;
  onBack: () => void;
  isPending: boolean;
  error?: string;
}

export function SignupStepCredentials({ onSubmit, onBack, isPending, error }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<CredentialsData>({
    resolver: zodResolver(signupCredentialsSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Create your account</h2>
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
      <Input label="Confirm Password" type="password" autoComplete="new-password" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
