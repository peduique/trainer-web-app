'use client';

import { BProgress } from '@bprogress/next';

export function ProgressProvider() {
  return (
    <BProgress
      height="4px"
      color="#3b82f6"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
