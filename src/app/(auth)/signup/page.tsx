import type { Metadata } from 'next';
import { SignupWizard } from '@/features/auth/components/signup-wizard';

export const metadata: Metadata = { title: 'Create Account' };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Create your account</h1>
        <SignupWizard />
      </div>
    </div>
  );
}
