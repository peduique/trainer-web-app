import type { Metadata } from 'next';
import { SignupWizard } from '@/features/auth/components/signup-wizard';

export const metadata: Metadata = { title: 'Create Account' };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading mb-6 text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <SignupWizard />
      </div>
    </div>
  );
}
