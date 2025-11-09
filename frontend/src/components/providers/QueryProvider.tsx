'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, setupQueryPersistence } from '@/lib/query-client';
import dynamic from 'next/dynamic';

const Devtools = process.env.NODE_ENV === 'development'
  ? dynamic(() => import('@tanstack/react-query-devtools').then(m => m.ReactQueryDevtools), { ssr: false })
  : (() => null as unknown as React.ReactNode);

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Setup persistence on mount
  React.useEffect(() => {
    setupQueryPersistence();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Devtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
} 