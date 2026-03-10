'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, mobileOpen, setMobileOpen, toggleMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
