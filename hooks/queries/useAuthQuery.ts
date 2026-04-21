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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.currentUser,
      });
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
    },
  });
};
