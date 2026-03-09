export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-8 py-4">
        <span className="font-semibold">Trainer Portal</span>
      </nav>
      <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
    </div>
  );
}
