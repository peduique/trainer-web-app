'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDeleteAccount } from '@/features/profile/hooks/use-profile';

const CONFIRM_TEXT = 'DELETE';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: Props) {
  const [input, setInput] = useState('');
  const { mutate, isPending } = useDeleteAccount();

  return (
    <Modal open={open} onClose={onClose} title="Delete Account">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          This action is <strong>permanent and irreversible</strong>. All your data will be deleted.
        </p>
        <p className="text-sm text-gray-600">
          Type <strong>{CONFIRM_TEXT}</strong> to confirm.
        </p>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={CONFIRM_TEXT}
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            variant="outline"
            disabled={input !== CONFIRM_TEXT || isPending}
            onClick={() => mutate()}
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            {isPending ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
