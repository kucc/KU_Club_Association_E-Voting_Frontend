import {
  useCastVoteMutation,
  useMyVoteQuery,
  useVoteResultsQuery,
} from '@/hooks/queries/useVoteQuery';
import * as votesService from '@/services/votes';
import { createQueryWrapper } from '@/test/queryTestUtils';
import { describe, expect, jest, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/services/votes');

const mockedVotesService = jest.mocked(votesService);

describe('hooks/queries/useVoteQuery', () => {
  test('useVoteResultsQuery: 결과 조회 성공', async () => {
    mockedVotesService.getVoteResults.mockResolvedValue({
      poll_id: 1,
      results: [
        { selected: '찬성', count: 10 },
        { selected: '반대', count: 2 },
      ],
    });

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useVoteResultsQuery(1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.poll_id).toBe(1);
    expect(result.current.data?.results).toHaveLength(2);
  });

  test('useMyVoteQuery: 미투표면 null 반환', async () => {
    mockedVotesService.getMyVote.mockResolvedValue(null);

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useMyVoteQuery(1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  test('useCastVoteMutation: 성공 시 mutation success 상태가 된다', async () => {
    mockedVotesService.castVote.mockResolvedValue(undefined);

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCastVoteMutation(1), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync('찬성');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedVotesService.castVote).toHaveBeenCalledWith(1, '찬성');
  });
});
