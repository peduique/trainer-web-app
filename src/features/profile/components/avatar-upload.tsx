'use client';
import { useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUploadAvatar, useDeleteAvatar } from '@/features/profile/hooks/use-profile';

interface Props {
  currentUrl?: string | null;
  name?: string | null;
}

export function AvatarUpload({ currentUrl, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadAvatar();
  const remove = useDeleteAvatar();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload.mutate(file);
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar src={currentUrl} name={name ?? undefined} size="lg" />
      <div className="flex flex-col gap-2">
        <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
          {upload.isPending ? 'Uploading...' : 'Change Photo'}
        </Button>
        {currentUrl && (
          <Button size="sm" variant="ghost" onClick={() => remove.mutate()} disabled={remove.isPending}>
            Remove
          </Button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}
