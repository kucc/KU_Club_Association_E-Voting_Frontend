import {
  useCreatePollMutation,
  useEndPollMutation,
  usePollResultsQuery,
  usePollsByMonthQuery,
  usePollsBySemesterQuery,
  usePollsQuery,
  useSelectableSemestersQuery,
  useStartPollMutation,
} from '@/hooks/queries/usePollQuery';
import * as pollsService from '@/services/polls';
import { createQueryWrapper } from '@/test/queryTestUtils';
import { describe, expect, jest, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/services/polls');

const mockedPollsService = jest.mocked(pollsService);

describe('hooks/queries/usePollQuery', () => {
  //  usePollsQuery
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
    const { result } = renderHook(() => usePollsQuery(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].status).toBe('pending');
  });

  test('usePollsQuery: 실패 시 error 상태가 된다', async () => {
    mockedPollsService.getPolls.mockRejectedValue(new Error('로그인 필요'));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePollsQuery(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('로그인 필요');
  });

  //  usePollResultsQuery
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

  test('usePollResultsQuery: id가 유효하지 않으면 쿼리가 실행되지 않는다', async () => {
    const { Wrapper } = createQueryWrapper();
    // enabled: Number.isFinite(id) — NaN이나 Infinity는 비활성화
    const { result } = renderHook(() => usePollResultsQuery(NaN), {
      wrapper: Wrapper,
    });

    // pending 상태여야 함 (fetchStatus: idle)
    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedPollsService.getPollResults).not.toHaveBeenCalled();
  });

  //  useCreatePollMutation
  test('useCreatePollMutation: 생성 성공', async () => {
    mockedPollsService.createPoll.mockResolvedValue({
      id: 10,
      created_by: 1,
      question: '신규 안건',
      options: ['찬성', '반대'],
      status: 'pending',
      sort_order: 1,
      ended_at: '2026-12-31T23:59:59Z',
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreatePollMutation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync({
      question: '신규 안건',
      options: ['찬성', '반대'],
      sort_order: 1,
      ended_at: '2026-12-31T23:59:59Z',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPollsService.createPoll).toHaveBeenCalledWith(
      '신규 안건',
      ['찬성', '반대'],
      1,
      '2026-12-31T23:59:59Z',
    );
  });

  test('useCreatePollMutation: 실패 시 error 상태가 된다', async () => {
    mockedPollsService.createPoll.mockRejectedValue(new Error('Not an admin'));

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreatePollMutation(), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync({
        question: '신규 안건',
        options: ['찬성', '반대'],
        sort_order: 1,
        ended_at: '2026-12-31T23:59:59Z',
      }),
    ).rejects.toThrow('Not an admin');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  //  useStartPollMutation
  test('useStartPollMutation: 성공 시 success 상태가 된다', async () => {
    mockedPollsService.startPoll.mockResolvedValue(undefined);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useStartPollMutation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPollsService.startPoll).toHaveBeenCalledWith(1);
  });

  test('useStartPollMutation: 실패 시 error 상태가 된다', async () => {
    mockedPollsService.startPoll.mockRejectedValue(
      new Error('이미 시작된 투표입니다.'),
    );

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useStartPollMutation(), {
      wrapper: Wrapper,
    });

    await expect(result.current.mutateAsync(1)).rejects.toThrow(
      '이미 시작된 투표입니다.',
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  //  useEndPollMutation
  test('useEndPollMutation: 성공 시 success 상태가 된다', async () => {
    mockedPollsService.endPoll.mockResolvedValue(undefined);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEndPollMutation(), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedPollsService.endPoll).toHaveBeenCalledWith(1);
  });

  test('useEndPollMutation: 실패 시 error 상태가 된다', async () => {
    mockedPollsService.endPoll.mockRejectedValue(
      new Error('이미 종료된 투표입니다.'),
    );

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useEndPollMutation(), {
      wrapper: Wrapper,
    });

    await expect(result.current.mutateAsync(1)).rejects.toThrow(
      '이미 종료된 투표입니다.',
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  //  usePollsByMonthQuery
  test('usePollsByMonthQuery: 해당 월의 투표 목록을 반환한다', async () => {
    mockedPollsService.getPollsByMonth.mockResolvedValue([
      { results: [{ selected: '찬성', count: 10 }] },
    ]);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePollsByMonthQuery(2026, 4), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].results[0].count).toBe(10);
    expect(mockedPollsService.getPollsByMonth).toHaveBeenCalledWith(2026, 4);
  });

  test('usePollsByMonthQuery: year/month가 유효하지 않으면 쿼리가 실행되지 않는다', async () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePollsByMonthQuery(NaN, NaN), {
      wrapper: Wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedPollsService.getPollsByMonth).not.toHaveBeenCalled();
  });

  //  useSelectableSemestersQuery
  test('useSelectableSemestersQuery: 학기 목록을 반환한다', async () => {
    mockedPollsService.getSelectableSemesters.mockResolvedValue([
      { year: 2026, semester: 1 },
      { year: 2025, semester: 2 },
    ]);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSelectableSemestersQuery(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]).toEqual({ year: 2026, semester: 1 });
  });

  //  usePollsBySemesterQuery
  test('usePollsBySemesterQuery: 해당 학기의 투표 목록을 반환한다', async () => {
    mockedPollsService.getPollsBySemester.mockResolvedValue([
      { results: [{ selected: '반대', count: 5 }] },
    ]);

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePollsBySemesterQuery(2026, 1), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].results[0].count).toBe(5);
    expect(mockedPollsService.getPollsBySemester).toHaveBeenCalledWith(2026, 1);
  });

  test('usePollsBySemesterQuery: year/semester가 유효하지 않으면 쿼리가 실행되지 않는다', async () => {
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => usePollsBySemesterQuery(NaN, NaN), {
      wrapper: Wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedPollsService.getPollsBySemester).not.toHaveBeenCalled();
  });
});
