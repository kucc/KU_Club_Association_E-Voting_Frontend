'use client';

import {
  createPoll,
  endPoll,
  getPollResults,
  getPolls,
  startPoll,
} from '@/services/polls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const pollQueryKeys = {
  lists: ['polls'] as const,
  detail: (id: number) => ['polls', id] as const,
};

export const usePollsQuery = () => {
  return useQuery({
    queryKey: pollQueryKeys.lists,
    queryFn: getPolls,
  });
};

export const usePollResultsQuery = (id: number) => {
  return useQuery({
    queryKey: pollQueryKeys.detail(id),
    queryFn: () => getPollResults(id),
    enabled: Number.isFinite(id),
  });
};

export const useCreatePollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      question,
      options,
      sort_order,
    }: {
      question: string;
      options: string[];
      sort_order: number;
    }) => createPoll(question, options, sort_order),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: pollQueryKeys.lists,
      });
    },
  });
};

export const useStartPollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => startPoll(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: pollQueryKeys.lists });
      await queryClient.invalidateQueries({
        queryKey: pollQueryKeys.detail(id),
      });
    },
  });
};

export const useEndPollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => endPoll(id),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({
        queryKey: pollQueryKeys.lists,
      });
      await queryClient.invalidateQueries({
        queryKey: pollQueryKeys.detail(id),
      });
    },
  });
};
