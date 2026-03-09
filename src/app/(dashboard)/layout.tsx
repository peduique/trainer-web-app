'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-svh overflow-hidden bg-background">
        <Sidebar />
        <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 pt-6 md:gap-8 md:p-8 md:pt-8">
          <div className="@container/main flex flex-1 flex-col gap-6 md:gap-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
