import type { PollResponse } from '@/types/poll';
import type { Vote } from '@/types/vote';

import type { PollResultItem } from '../(members)/_utils/poll-display';

export type MyPagePollRow = {
  poll: PollResponse;
  myVote: Vote | null;
};

export type PollResultsById = Map<number, PollResultItem[] | undefined>;
