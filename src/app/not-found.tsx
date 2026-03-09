import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Page not found</h2>
        <Link href="/" className="mt-4 block text-blue-600 hover:underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
