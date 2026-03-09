import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Welcome back to Trainer Portal
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
