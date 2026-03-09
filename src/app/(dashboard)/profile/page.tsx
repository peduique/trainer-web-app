'use client';
import { useState } from 'react';
import { useProfile } from '@/features/profile/hooks/use-profile';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { AvatarUpload } from '@/features/profile/components/avatar-upload';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { DeleteAccountModal } from '@/features/profile/components/delete-account-modal';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!profile) return <div className="text-sm text-red-600">Failed to load profile.</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" />
      <div className="mb-6">
        <AvatarUpload currentUrl={profile.avatar_url} name={profile.name} />
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <Tabs
          tabs={[
            {
              id: 'info',
              label: 'Profile Info',
              content: <ProfileForm profile={profile} />,
            },
            {
              id: 'password',
              label: 'Change Password',
              content: <ChangePasswordForm />,
            },
            {
              id: 'danger',
              label: 'Danger Zone',
              content: (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-600">Permanently delete your account and all associated data.</p>
                  <Button
                    variant="outline"
                    className="w-fit border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
      <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
