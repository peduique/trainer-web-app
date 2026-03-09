'use client';
import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';

interface Props {
  onNext: (file: File | null) => void;
  onBack: () => void;
}

export function SignupStepPhoto({ onNext, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Add a profile photo</h2>
      <p className="text-sm text-gray-500">Optional — you can always add one later.</p>
      <FileUpload onFile={setFile} label="Profile Photo" />
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={() => onNext(file)} className="flex-1">
          {file ? 'Next' : 'Skip'}
        </Button>
      </div>
    </div>
  );
}
