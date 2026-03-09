import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-gray-500">Sign in to your account</p>
      </div>
    </div>
  );
}
