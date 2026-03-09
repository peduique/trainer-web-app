'use client';
import { useRef, useState } from 'react';

interface FileUploadProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
  preview?: string | null;
  error?: string;
  className?: string;
}

export function FileUpload({ onFile, accept = 'image/*', label, preview, error, className = '' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(preview ?? null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFile(file);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-400 hover:bg-blue-50"
      >
        {localPreview ? (
          <img src={localPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <>
            <span className="text-3xl">📎</span>
            <span className="mt-2 text-sm text-gray-500">Click to upload</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={label ?? 'File upload'}
      />
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
