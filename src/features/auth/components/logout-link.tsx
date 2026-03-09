'use client';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { Button } from '@/components/ui/button';

export function LogoutLink() {
  const { mutate, isPending } = useLogout();
  return (
    <Button variant="ghost" onClick={() => mutate()} disabled={isPending} className="text-sm">
      {isPending ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
