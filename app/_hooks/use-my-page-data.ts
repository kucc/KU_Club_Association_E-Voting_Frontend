'use client';

import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';
import { pollQueryKeys, usePollsQuery } from '@/hooks/queries/usePollQuery';
import { voteQueryKeys } from '@/hooks/queries/useVoteQuery';
import { useTheme } from '@/providers/theme-provider';
import { getPollResults } from '@/services/polls';
import { getMyVote } from '@/services/votes';
import { useQueries } from '@tanstack/react-query';

import { useEffect, useMemo } from 'react';

import {
  getThemeByUserProfile,
  toUserProfile,
} from '../(members)/_utils/poll-display';

export const useMyPageData = () => {
  const {
    data: authUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUserQuery();
  const { data: polls = [], isLoading: isPollsLoading } = usePollsQuery();
  const { setTheme } = useTheme();

  const user = useMemo(() => {
    return authUser ? toUserProfile(authUser) : null;
  }, [authUser]);
  const isManagementAdmin = user?.canOpenMemberResultPage === false;

  const myVoteQueries = useQueries({
    queries: polls.map((poll) => ({
      queryKey: voteQueryKeys.myVote(poll.id),
      queryFn: () => getMyVote(poll.id),
      enabled: Boolean(authUser),
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const pollRows = polls.map((poll, index) => ({
    poll,
    myVote: myVoteQueries[index]?.data ?? null,
  }));

  const votedPollRows = pollRows.filter((row) => row.myVote !== null);
  const resultPollRows = isManagementAdmin ? pollRows : votedPollRows;

  const resultQueries = useQueries({
    queries: resultPollRows.map(({ poll }) => ({
      queryKey: pollQueryKeys.detail(poll.id),
      queryFn: () => getPollResults(poll.id),
      enabled: Boolean(authUser),
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const resultsByPollId = new Map(
    resultPollRows.map(({ poll }, index) => [
      poll.id,
      resultQueries[index]?.data?.results,
    ]),
  );

  useEffect(() => {
    if (user) setTheme(getThemeByUserProfile(user));
  }, [user, setTheme]);

  return {
    authUser,
    error,
    isError,
    isLoading: isAuthLoading || isPollsLoading || !user,
    isManagementAdmin,
    pollRows,
    resultsByPollId,
    user,
  };
};
