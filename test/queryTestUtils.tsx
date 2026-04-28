'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { PropsWithChildren, ReactElement } from 'react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const createQueryWrapper = () => {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: PropsWithChildren): ReactElement {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return {
    Wrapper,
    queryClient,
  };
};
