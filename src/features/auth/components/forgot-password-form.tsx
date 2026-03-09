'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema } from '@/models/auth/auth.schema';
import { forgotPassword, verifyResetCode, resetPassword } from '@/models/auth/auth.api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'code' | 'reset';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) });
  const codeForm = useForm<z.infer<typeof verifyCodeSchema>>({ resolver: zodResolver(verifyCodeSchema) });
  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({ resolver: zodResolver(resetPasswordSchema) });

  const handleEmailSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true); setError(null);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep('code');
    } catch (e) {
      setError((e as Error).message);
    } finally { setIsLoading(false); }
  };

  const handleCodeSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    setIsLoading(true); setError(null);
    try {
      const result = await verifyResetCode(email, data.code);
      setToken(result.token);
      setStep('reset');
    } catch (e) {
      setError((e as Error).message);
    } finally { setIsLoading(false); }
  };

  const handleResetSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true); setError(null);
    try {
      await resetPassword(token, data.password);
      router.push('/login');
    } catch (e) {
      setError((e as Error).message);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {step === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">Enter your email and we&apos;ll send you a reset code.</p>
          <Input label="Email" type="email" error={emailForm.formState.errors.email?.message} {...emailForm.register('email')} />
          <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Sending...' : 'Send Reset Code'}</Button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">Enter the code sent to <strong>{email}</strong>.</p>
          <Input label="Reset Code" error={codeForm.formState.errors.code?.message} {...codeForm.register('code')} />
          <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Verifying...' : 'Verify Code'}</Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">Choose your new password.</p>
          <Input label="New Password" type="password" error={resetForm.formState.errors.password?.message} {...resetForm.register('password')} />
          <Input label="Confirm Password" type="password" error={resetForm.formState.errors.password_confirmation?.message} {...resetForm.register('password_confirmation')} />
          <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Saving...' : 'Reset Password'}</Button>
        </form>
      )}
    </div>
  );
}
