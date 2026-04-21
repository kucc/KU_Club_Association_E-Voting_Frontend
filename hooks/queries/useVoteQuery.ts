'use client';

import {
  castVote,
  editVote,
  getMyVote,
  getVoteResults,
} from '@/services/votes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const voteQueryKeys = {
  results: (pollId: number) => ['votes', 'results', pollId] as const,
  myVote: (pollId: number) => ['votes', 'myVote', pollId] as const,
};

export const useVoteResultsQuery = (pollId: number) => {
  return useQuery({
    queryKey: voteQueryKeys.results(pollId),
    queryFn: () => getVoteResults(pollId),
    enabled: Number.isFinite(pollId),
  });
};

export const useMyVoteQuery = (pollId: number) => {
  return useQuery({
    queryKey: voteQueryKeys.myVote(pollId),
    queryFn: () => getMyVote(pollId),
    enabled: Number.isFinite(pollId),
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
        queryKey: voteQueryKeys.myVote(pollId),
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
        queryKey: voteQueryKeys.myVote(pollId),
      });
    },
  });
};
