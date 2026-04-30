import {
  useCastVoteMutation,
  useEditVoteMutation,
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
  //  useVoteResultsQuery
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

  test('useVoteResultsQuery: pollId가 유효하지 않으면 쿼리가 실행되지 않는다', async () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useVoteResultsQuery(NaN), {
      wrapper: Wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedVotesService.getVoteResults).not.toHaveBeenCalled();
  });

  //  useMyVoteQuery
  test('useMyVoteQuery: 투표한 경우 vote 객체를 반환한다', async () => {
    mockedVotesService.getMyVote.mockResolvedValue({
      id: 1,
      poll_id: 1,
      user_id: 1,
      selected: '찬성',
      cast_at: '2026-04-27T06:21:55.452Z',
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMyVoteQuery(1, 1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.selected).toBe('찬성');
  });

  test('useMyVoteQuery: 미투표면 null을 반환한다', async () => {
    mockedVotesService.getMyVote.mockResolvedValue(null);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMyVoteQuery(1, 1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  test('useMyVoteQuery: pollId가 유효하지 않으면 쿼리가 실행되지 않는다', async () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMyVoteQuery(NaN, 1), {
      wrapper: Wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedVotesService.getMyVote).not.toHaveBeenCalled();
  });

  //  useCastVoteMutation
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

  test('useCastVoteMutation: 실패 시 error 상태가 된다', async () => {
    mockedVotesService.castVote.mockRejectedValue(new Error('이미 투표함'));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCastVoteMutation(1), {
      wrapper: Wrapper,
    });

    await expect(result.current.mutateAsync('찬성')).rejects.toThrow(
      '이미 투표함',
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  //  useEditVoteMutation
  test('useEditVoteMutation: 성공 시 success 상태가 된다', async () => {
    mockedVotesService.editVote.mockResolvedValue(undefined);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditVoteMutation(1), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync('반대');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedVotesService.editVote).toHaveBeenCalledWith(1, '반대');
  });

  test('useEditVoteMutation: 실패 시 error 상태가 된다', async () => {
    mockedVotesService.editVote.mockRejectedValue(
      new Error('Poll or vote not found'),
    );

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEditVoteMutation(1), {
      wrapper: Wrapper,
    });

    await expect(result.current.mutateAsync('반대')).rejects.toThrow(
      'Poll or vote not found',
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
