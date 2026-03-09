import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-gray-500">Welcome back to Trainer Portal</p>
        <LoginForm />
      </div>
    </div>
  );
}
