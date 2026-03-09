import type { Metadata } from 'next';
import { SettingsForm } from '@/features/settings/components/settings-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Settings" description="Configure your app preferences" />
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <SettingsForm />
      </div>
    </div>
  );
}
