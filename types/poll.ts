export type PollStatus = 'pending' | 'continuing' | 'completed';

// API response
export type PollResponse = {
  id: number;
  created_by: number;
  question: string;
  description?: string | null;
  options: string[];
  status: PollStatus;
  started_at: string | null;
  ended_at: string | null;
  sort_order: number;
};

// UI용
export interface PollStatistics {
  quota: number;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  deadline: string;
  myVote: string;
  isOngoing: boolean;
  isAgentVote?: boolean;
  isMyVote: boolean; // 필터링용: 내가 참여한 투표인지 여부

  currentCount?: number;
  totalParticipants?: number;
  votingRate?: number;

  attendanceCount?: number;
  attendanceTotal?: number;
  attendanceRate?: number;
  resultStatus?: string;
  resultRate?: number;
}
