import type { PollResponse, PollStatus } from '@/types/poll';
import type { User, UserProfile } from '@/types/user';

import {
  ADMIN_ACCOUNTS,
  CLUB_ACCOUNTS,
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

const getRepresentativeUsername = (username: string): string => {
  return username.trim().replace(/_sub$/i, '');
};

const isSubstituteUser = (user: User): boolean => {
  return Boolean(user.isSubstitute) || /_sub$/i.test(user.username);
};

export const toUserProfile = (user: User): UserProfile => {
  const isSubstitute = isSubstituteUser(user);
  const role = user.isAdmin
    ? 'EXECUTIVE'
    : isSubstitute
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
      canOpenMemberResultPage: adminAccount.authority === '투표자',
    };
  }

  const representativeUsername = getRepresentativeUsername(user.username);
  const clubAccount =
    getClubAccountByUsername(user.username) ??
    getClubAccountByUsername(representativeUsername);
  const clubName =
    clubAccount?.clubName ?? getRepresentativeClubName(user.username);

  return {
    name: user.username,
    role,
    club: '동아리',
    position: user.isAdmin ? '임원진' : isSubstitute ? '대리인' : '대표자',
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

export const getEligibleVoterCount = (): number => {
  const clubVoters = new Set(
    CLUB_ACCOUNTS.map((account) => account.clubName.trim()),
  );
  const adminVoters = new Set(
    ADMIN_ACCOUNTS.filter((account) => account.authority === '투표자').map(
      (account) => `${account.position}:${account.division}`,
    ),
  );

  return clubVoters.size + adminVoters.size;
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
