import type { PollResponse, PollStatus } from '@/types/poll';
import type { User, UserProfile } from '@/types/user';

import {
  getAdminAccountByUsername,
  getClubAccountByUsername,
} from '../_data/user-directory';

export type PollResultItem = {
  selected: string;
  count: number;
};

const getRepresentativeClubName = (username: string): string => {
  return username.trim().replace(/_sub$/i, '').toUpperCase();
};

export const toUserProfile = (user: User): UserProfile => {
  const role = user.isAdmin
    ? 'EXECUTIVE'
    : user.isSubstitute
      ? 'AGENT'
      : 'REPRESENTATIVE';
  const adminAccount = getAdminAccountByUsername(user.username);

  if (adminAccount) {
    return {
      name: user.username,
      role,
      club: '동아리연합회',
      position: adminAccount.position,
      department: adminAccount.division,
      studentId: adminAccount.authority,
      status: '-',
      usesExecutiveTheme: true,
      showsExecutiveBadge: true,
    };
  }

  const clubAccount = getClubAccountByUsername(user.username);
  const clubName =
    clubAccount?.clubName ?? getRepresentativeClubName(user.username);

  return {
    name: user.username,
    role,
    club: clubName,
    position: user.isAdmin ? '임원진' : user.isSubstitute ? '대리인' : '대표자',
    department: clubAccount?.division ?? '-',
    studentId: clubName,
    status: '-',
  };
};

export const getThemeByRole = (role: UserProfile['role']) => {
  if (role === 'EXECUTIVE') return 'theme-executive';
  if (role === 'AGENT') return 'theme-agent';
  return 'theme-default';
};

export const getThemeByUserProfile = (user: UserProfile) => {
  if (user.usesExecutiveTheme) return 'theme-executive';
  return getThemeByRole(user.role);
};

export const isPollStatus = (poll: PollResponse, status: PollStatus): boolean =>
  poll.status === status;

export const sumVotes = (results: PollResultItem[] | undefined): number => {
  return results?.reduce((total, result) => total + result.count, 0) ?? 0;
};

export const getResultText = (
  results: PollResultItem[] | undefined,
): string => {
  const totalVotes = sumVotes(results);

  if (!results?.length || totalVotes === 0) return '결과 없음';

  const topResult = results.reduce((currentTop, result) =>
    result.count > currentTop.count ? result : currentTop,
  );
  const resultRate = Math.round((topResult.count / totalVotes) * 100);

  return `${topResult.selected} (${resultRate}%)`;
};

export const getPollDeadline = (poll: PollResponse): string => {
  return poll.ended_at ?? poll.started_at ?? new Date().toISOString();
};
