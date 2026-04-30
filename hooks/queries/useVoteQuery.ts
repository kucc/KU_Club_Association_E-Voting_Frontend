'use client';

import {
  castVote,
  editVote,
  getMyVote,
  getVoteResults,
} from '@/services/votes';
import { Vote } from '@/types/vote';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const voteQueryKeys = {
  results: (pollId: number) => ['votes', 'results', pollId] as const,
  myVote: (pollId: number, userId?: number) =>
    ['votes', 'myVote', pollId, userId ?? 'anonymous'] as const,
};

export const useVoteResultsQuery = (pollId: number) => {
  return useQuery<{
    poll_id: number;
    results: Array<{ selected: string; count: number }>;
  }>({
    queryKey: voteQueryKeys.results(pollId),
    queryFn: () => getVoteResults(pollId),
    enabled: Number.isFinite(pollId),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
};

export const useMyVoteQuery = (pollId: number, userId?: number) => {
  return useQuery<Vote | null>({
    queryKey: voteQueryKeys.myVote(pollId, userId),
    queryFn: () => getMyVote(pollId),
    enabled: Number.isFinite(pollId) && userId !== undefined,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
};

export const useCastVoteMutation = (pollId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selected: string) => castVote(pollId, selected),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: voteQueryKeys.results(pollId),
      });
      await queryClient.invalidateQueries({
        queryKey: ['votes', 'myVote', pollId],
      });
    },
  });
};

export const useEditVoteMutation = (pollId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selected: string) => editVote(pollId, selected),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: voteQueryKeys.results(pollId),
      });
      await queryClient.invalidateQueries({
        queryKey: ['votes', 'myVote', pollId],
      });
    },
  });
};
