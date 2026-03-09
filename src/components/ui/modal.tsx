'use client';
import { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className = '' }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-black/50 ${className}`}
    >
      <div className="flex flex-col">
        {title && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </dialog>
  );
}
