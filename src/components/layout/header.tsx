'use client';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <Avatar name={user?.name ?? user?.email} size="sm" />
        <span className="text-sm font-medium text-gray-700">{user?.name ?? user?.email}</span>
      </div>
    </header>
  );
}
