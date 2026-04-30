'use client';

import {
  createPoll,
  endPoll,
  getPollResults,
  getPolls,
  getPollsByMonth,
  getPollsBySemester,
  getSelectableSemesters,
  startPoll,
} from '@/services/polls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const pollQueryKeys = {
  lists: ['polls'] as const,
  detail: (id: number) => ['polls', id] as const,
  byMonth: (year: number, month: number) =>
    ['polls', 'by-month', year, month] as const,
  selectableSemesters: ['polls', 'selectable-semesters'] as const,
  bySemester: (year: number, semester: number) =>
    ['polls', 'by-semester', year, semester] as const,
};

const queryOptions = {
  staleTime: 1000 * 60 * 3,
  gcTime: 1000 * 60 * 10,
  refetchOnWindowFocus: true,
  keepPreviousData: true,
};

export const usePollsQuery = () => {
  return useQuery({
    queryKey: pollQueryKeys.lists,
    queryFn: getPolls,
    ...queryOptions,
  });
};

export const usePollResultsQuery = (id: number) => {
  return useQuery({
    queryKey: pollQueryKeys.detail(id),
    queryFn: () => getPollResults(id),
    enabled: Number.isFinite(id),
    ...queryOptions,
  });
};

export const useCreatePollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      question: string;
      description: string;
      options: string[];
      sort_order: number;
      ended_at: string;
    }) =>
      createPoll(
        data.question,
        data.description,
        data.options,
        data.sort_order,
        data.ended_at,
      ),
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

export const usePollsByMonthQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: pollQueryKeys.byMonth(year, month),
    queryFn: () => getPollsByMonth(year, month),
    enabled: Number.isFinite(year) && Number.isFinite(month),
    ...queryOptions,
  });
};

export const useSelectableSemestersQuery = () => {
  return useQuery({
    queryKey: pollQueryKeys.selectableSemesters,
    queryFn: getSelectableSemesters,
    ...queryOptions,
  });
};

export const usePollsBySemesterQuery = (year: number, semester: number) => {
  return useQuery({
    queryKey: pollQueryKeys.bySemester(year, semester),
    queryFn: () => getPollsBySemester(year, semester),
    enabled: Number.isFinite(year) && Number.isFinite(semester),
    ...queryOptions,
  });
};
