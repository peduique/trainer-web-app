import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    </Suspense>
  );
}
