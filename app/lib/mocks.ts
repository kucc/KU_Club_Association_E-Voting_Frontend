'use server';

import { Poll } from '@/types/poll';
import { UserProfile } from '@/types/user';

export interface CompletedPollItem extends Poll {
  semester: string;
}

export async function createMockUser(): Promise<UserProfile> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('createMockUser should not be called in production');
  }

  return {
    name: '오승민',
    role: 'REPRESENTATIVE', // REPRESENTATIVE = 대표자 | AGENT = 대리인
    club: 'KUCC',
    position: '회장',
    department: '전기전자공학부',
    studentId: '2020170984',
    status: '재학',
  };
}

export async function createMockCompletedPolls(): Promise<CompletedPollItem[]> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'createMockCompletedPolls should not be called in production',
    );
  }

  return [
    {
      id: 'c1',
      title: '2026년도 1학기 정기총회 안건 투표',
      deadline: '2026-04-07T16:00:00',
      myVote: '찬성',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 80,
      semester: '2026-1학기',
    },
    {
      id: 'c2',
      title: '동아리 예산안 승인 투표',
      deadline: '2026-03-20T18:00:00',
      myVote: '찬성',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '부결',
      resultRate: 35,
      semester: '2026-1학기',
    },
    {
      id: 'c3',
      title: '회칙 개정 특별투표',
      deadline: '2026-03-10T17:00:00',
      myVote: '기권',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 76,
      semester: '2026-1학기',
    },
    {
      id: 'c4',
      title: '임원 불신임 투표',
      deadline: '2025-11-15T16:00:00',
      myVote: '기권',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 76,
      semester: '2025-2학기',
    },
    {
      id: 'c5',
      title: '2025년도 2학기 정기총회 안건 투표',
      deadline: '2025-10-07T16:00:00',
      myVote: '불참',
      isOngoing: false,
      isMyVote: false,
      isAgentVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 76,
      semester: '2025-2학기',
    },
    {
      id: 'c6',
      title: '동아리방 사용 규정 개정 투표',
      deadline: '2025-09-20T16:00:00',
      myVote: '불참',
      isOngoing: false,
      isMyVote: false,
      isAgentVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '부결',
      resultRate: 45,
      semester: '2025-2학기',
    },
    {
      id: 'c7',
      title: '2023년도 1학기 행사 예산 투표',
      deadline: '2023-05-10T17:00:00',
      myVote: '기권',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 76,
      semester: '2023-1학기',
    },
  ];
}

export async function createMockPolls(): Promise<Poll[]> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('createMockPolls should not be called in production');
  }

  return [
    {
      id: 'v1',
      title: '제1회 동아리연합회장 선거',
      deadline: '26.04.07 16:00',
      myVote: '찬성',
      isOngoing: true,
      isMyVote: true,
      currentCount: 12,
      totalParticipants: 24,
      votingRate: 50,
    },
    {
      id: 'v2',
      title: '동아리 예산안 승인 투표',
      deadline: '26.04.07 16:00',
      myVote: '찬성',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 80,
    },
    {
      id: 'v3',
      title: '하계 엠티 장소 선정',
      deadline: '26.04.07 16:00',
      myVote: '기권',
      isOngoing: false,
      isMyVote: false,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '가결',
      resultRate: 76,
    },
    {
      id: 'v4',
      title: '임시 총회 안건 투표',
      deadline: '26.04.07 16:00',
      myVote: '불참',
      isOngoing: false,
      isAgentVote: true,
      isMyVote: true,
      attendanceCount: 70,
      attendanceTotal: 72,
      attendanceRate: 97,
      resultStatus: '부결',
      resultRate: 45,
    },
    {
      id: 'v5',
      title: '테스트용 추가 투표 (4번째)',
      deadline: '26.04.07 16:00',
      myVote: '찬성',
      isOngoing: false,
      isMyVote: true,
      attendanceCount: 10,
      attendanceTotal: 20,
      attendanceRate: 50,
      resultStatus: '가결',
      resultRate: 90,
    },
  ];
}
