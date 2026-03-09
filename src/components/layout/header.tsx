'use client';

import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@/features/auth/hooks/use-logout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-border bg-background px-6">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-full p-1.5 pr-3"
          >
            <Avatar name={user?.name ?? user?.email} size="sm" />
            <span className="text-sm font-medium text-foreground">
              {user?.name ?? user?.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Link href="/profile" className="flex cursor-pointer items-center">
              <User className="mr-2 size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex cursor-pointer items-center">
              <Settings className="mr-2 size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => { e.preventDefault(); logout(); }}
            disabled={isPending}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 size-4" />
            {isPending ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
