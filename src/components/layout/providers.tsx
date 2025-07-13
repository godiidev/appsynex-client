//src/components/layout/providers.tsx - Simple version without ActiveTheme
'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import QueryProvider from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}
