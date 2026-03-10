'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Sidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { useSidebar } from '@/components/layout/sidebar-context';
import { Button } from '@/components/ui/button';

function MobileHeader() {
  const { toggleMobile } = useSidebar();

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
      <Image
        src="/images/logo.png"
        alt="Trainer Portal"
        width={96}
        height={96}
        className="invert"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleMobile}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>
    </header>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <MobileHeader />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 pt-6 md:gap-8 md:p-8 md:pt-8">
          <div className="@container/main flex flex-1 flex-col gap-6 md:gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
}
