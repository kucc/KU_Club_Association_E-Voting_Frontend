export type PollStatus = 'pending' | 'continuing' | 'completed';

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
