import type { Metadata } from 'next';
import { SettingsForm } from '@/features/settings/components/settings-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Settings" description="Configure your app preferences" />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SettingsForm />
      </div>
    </div>
  );
}
