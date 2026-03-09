import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Reset your password</h1>
        <p className="mb-6 text-sm text-gray-500">We'll help you get back in.</p>
        <ForgotPasswordForm />
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
