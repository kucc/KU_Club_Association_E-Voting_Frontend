import axios from 'axios';

import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

type VoteActionRequest = {
  poll_id: number;
  selected: string;
};

type PollIdRequest = {
  poll_id: number;
};

type VoteResultItem = {
  selected: string;
  count: number;
};

type VoteResultsResponse = ApiSuccessResponse<{
  poll_id: number;
  results: VoteResultItem[];
}>;

type MyVote = {
  id: number;
  poll_id: number;
  user_id: number;
  selected: string;
  cast_at: string;
};

type MyVoteResponse = ApiSuccessResponse<{
  vote: MyVote | null;
}>;

export const castVote = async (
  pollId: number,
  selected: string,
): Promise<void> => {
  try {
    await apiClient.post('/api/votes/vote', {
      poll_id: pollId,
      selected,
    } satisfies VoteActionRequest);
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const editVote = async (
  pollId: number,
  selected: string,
): Promise<void> => {
  try {
    await apiClient.patch('/api/votes/edit-vote', {
      poll_id: pollId,
      selected,
    } satisfies VoteActionRequest);
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const getVoteResults = async (
  pollId: number,
): Promise<{ poll_id: number; results: VoteResultItem[] }> => {
  try {
    const { data } = await apiClient.post<VoteResultsResponse>(
      '/api/votes/results',
      {
        poll_id: pollId,
      } satisfies PollIdRequest,
    );

    return {
      poll_id: data.poll_id,
      results: data.results,
    };
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const getMyVote = async (pollId: number): Promise<MyVote | null> => {
  try {
    const { data } = await apiClient.post<MyVoteResponse>(
      '/api/votes/my-vote',
      {
        poll_id: pollId,
      } satisfies PollIdRequest,
    );

    return data.vote;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw new Error(parseApiError(error).message);
  }
};
