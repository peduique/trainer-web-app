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

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  if (!profile)
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load profile.
      </div>
    );

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Profile" description="Manage your account and preferences" />
      <div className="flex flex-col gap-4">
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Photo</h2>
          <AvatarUpload currentUrl={profile.avatar_url} name={profile.name} />
        </section>
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Tabs
            tabs={[
              {
                id: 'info',
                label: 'Profile Info',
                content: (
                  <div className="pt-6">
                    <ProfileForm profile={profile} />
                  </div>
                ),
              },
              {
                id: 'password',
                label: 'Change Password',
                content: (
                  <div className="pt-6">
                    <ChangePasswordForm />
                  </div>
                ),
              },
              {
                id: 'danger',
                label: 'Danger Zone',
                content: (
                  <div className="flex flex-col gap-4 pt-6">
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This cannot be
                      undone.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-fit"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </section>
      </div>
      <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
