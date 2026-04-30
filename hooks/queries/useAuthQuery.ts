'use client';

import { getCurrentUser, signIn, signOut } from '@/services/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const authQueryKeys = {
  currentUser: ['auth', 'currentUser'] as const,
};

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const useSignInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => signIn(username, password),
    onSuccess: (user) => {
      queryClient.removeQueries({ queryKey: ['votes'] });
      queryClient.removeQueries({ queryKey: ['polls'] });
      queryClient.setQueryData(authQueryKeys.currentUser, user);
    },
  });
};

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: authQueryKeys.currentUser,
      });
      queryClient.removeQueries({ queryKey: ['votes'] });
      queryClient.removeQueries({ queryKey: ['polls'] });
    },
  });
};
