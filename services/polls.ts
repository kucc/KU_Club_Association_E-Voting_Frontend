import type { PollResponse } from '@/types/poll';

import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

type PollIdRequest = {
  id: number;
};

type PollResultItem = {
  selected: string;
  count: number;
};

type PollListResponse = ApiSuccessResponse<{
  polls: PollResponse[];
}>;

type PollResultsResponse = ApiSuccessResponse<{
  poll: PollResponse;
  results: PollResultItem[];
}>;

type CreatePollRequest = {
  question: string;
  options: string[];
  sort_order: number;
};

type CreatePollApiResponse = {
  id: number;
  created_by: number;
  question: string;
  options: string[];
  status: string;
  sort_order: number;
};

type CreatePollResponse = ApiSuccessResponse<{
  poll: CreatePollApiResponse;
}>;

type EditPollRequest = {
  id: number;
  question?: string;
  options?: string[];
};

type EditPollResponse = ApiSuccessResponse<{
  poll: Record<string, unknown>;
}>;

const updatePollStatus = async (
  id: number,
  endpoint: 'start-poll' | 'end-poll',
) => {
  try {
    await apiClient.patch(`/api/polls/${endpoint}`, {
      id,
    } satisfies PollIdRequest);
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const getPolls = async (): Promise<PollResponse[]> => {
  try {
    const { data } = await apiClient.get<PollListResponse>('/api/polls');
    return data.polls;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const getPollResults = async (
  id: number,
): Promise<{ poll: PollResponse; results: PollResultItem[] }> => {
  try {
    const { data } = await apiClient.post<PollResultsResponse>(
      '/api/polls/poll-results',
      {
        id,
      } satisfies PollIdRequest,
    );

    return {
      poll: data.poll,
      results: data.results,
    };
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const createPoll = async (
  question: string,
  options: string[],
  sort_order: number,
): Promise<CreatePollApiResponse> => {
  try {
    const { data } = await apiClient.post<CreatePollResponse>(
      '/api/polls/create-poll',
      {
        question,
        options,
        sort_order,
      } satisfies CreatePollRequest,
    );

    return data.poll;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const editPoll = async (
  id: number,
  updates: { question?: string; options?: string[] },
): Promise<Record<string, unknown>> => {
  try {
    const { data } = await apiClient.patch<EditPollResponse>(
      '/api/polls/edit-poll',
      {
        id,
        ...updates,
      } satisfies EditPollRequest,
    );

    return data.poll;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const deletePoll = async (id: number): Promise<void> => {
  try {
    await apiClient.delete('/api/polls/delete-poll', {
      data: { id } satisfies PollIdRequest,
    });
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const startPoll = async (id: number): Promise<void> => {
  await updatePollStatus(id, 'start-poll');
};

export const endPoll = async (id: number): Promise<void> => {
  await updatePollStatus(id, 'end-poll');
};
