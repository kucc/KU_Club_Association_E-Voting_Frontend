import {
  useCreatePollMutation,
  usePollResultsQuery,
  usePollsQuery,
} from '@/hooks/queries/usePollQuery';
import * as pollsService from '@/services/polls';
import { createQueryWrapper } from '@/test/queryTestUtils';
import { describe, expect, jest, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/services/polls');

const mockedPollsService = jest.mocked(pollsService);

describe('hooks/queries/usePollQuery', () => {
  test('usePollsQuery: 목록 조회 성공', async () => {
    mockedPollsService.getPolls.mockResolvedValue([
      {
        id: 1,
        created_by: 1,
        question: '회장 선출에 찬성하십니까?',
        options: ['찬성', '반대', '기권'],
        status: 'pending',
        started_at: null,
        ended_at: null,
        sort_order: 0,
      },
    ]);

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => usePollsQuery(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].status).toBe('pending');
  });

  test('usePollResultsQuery: 상세 결과 조회 성공', async () => {
    mockedPollsService.getPollResults.mockResolvedValue({
      poll: {
        id: 1,
        created_by: 1,
        question: '회장 선출에 찬성하십니까?',
        options: ['찬성', '반대', '기권'],
        status: 'completed',
        started_at: '2026-04-19T13:17:08.897Z',
        ended_at: '2026-04-19T13:17:08.897Z',
        sort_order: 0,
      },
      results: [
        { selected: '찬성', count: 15 },
        { selected: '반대', count: 8 },
      ],
    });

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => usePollResultsQuery(1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.poll.id).toBe(1);
    expect(result.current.data?.results[0].count).toBe(15);
  });

  test('useCreatePollMutation: 생성 성공', async () => {
    mockedPollsService.createPoll.mockResolvedValue({
      id: 10,
      created_by: 1,
      question: '신규 안건',
      options: ['찬성', '반대'],
      status: 'pending',
      sort_order: 1,
    });

    const { Wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useCreatePollMutation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      question: '신규 안건',
      options: ['찬성', '반대'],
      sort_order: 1,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPollsService.createPoll).toHaveBeenCalledWith(
      '신규 안건',
      ['찬성', '반대'],
      1,
    );
  });
});
