'use server';

import { Poll } from '@/types/poll';
import { UserProfile } from '@/types/user';

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
