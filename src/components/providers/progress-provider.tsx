'use client';

import { AppProgressProvider } from '@bprogress/next';

export function ProgressProvider() {
  return (
    <AppProgressProvider
      height="4px"
      color="#3b82f6"
      options={{ showSpinner: false }}
    />
  );
}
