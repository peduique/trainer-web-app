import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/features/auth/components/login-form';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center justify-center self-center font-medium text-foreground"
        >
          <Image
            src="/images/logo.png"
            alt="TR[AI]NER"
            width={180}
            height={40}
            className="invert"
            priority
          />
        </Link>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Welcome back</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
