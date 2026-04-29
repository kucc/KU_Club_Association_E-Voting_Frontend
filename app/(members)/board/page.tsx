'use client';

import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';
import { pollQueryKeys, usePollsQuery } from '@/hooks/queries/usePollQuery';
import { voteQueryKeys } from '@/hooks/queries/useVoteQuery';
import { useTheme } from '@/providers/theme-provider';
import { getPollResults } from '@/services/polls';
import { getMyVote } from '@/services/votes';
import { useQueries } from '@tanstack/react-query';

import { useEffect, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/button';
import HistoryCard from '@/components/common/history-card';
import PollCard from '@/components/common/poll-card';

import {
  getPollDeadline,
  getResultText,
  getThemeByUserProfile,
  isPollStatus,
  sumVotes,
  toUserProfile,
} from '../_utils/poll-display';

export default function Home() {
  const router = useRouter();
  const {
    data: authUser,
    isLoading: isAuthLoading,
    isError,
    error,
  } = useCurrentUserQuery();
  const { data: polls = [], isLoading: isPollsLoading } = usePollsQuery();
  const { setTheme } = useTheme();

  const user = useMemo(() => {
    return authUser ? toUserProfile(authUser) : null;
  }, [authUser]);

  const myVoteQueries = useQueries({
    queries: polls.map((poll) => ({
      queryKey: voteQueryKeys.myVote(poll.id),
      queryFn: () => getMyVote(poll.id),
      enabled: Boolean(authUser),
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const pollRows = polls.map((poll, index) => ({
    poll,
    myVote: myVoteQueries[index]?.data ?? null,
  }));
  const isManagementAdmin = user?.canOpenMemberResultPage === false;

  const votedPollRows = pollRows.filter((row) => row.myVote !== null);
  const resultPollRows = isManagementAdmin ? pollRows : votedPollRows;

  const resultQueries = useQueries({
    queries: resultPollRows.map(({ poll }) => ({
      queryKey: pollQueryKeys.detail(poll.id),
      queryFn: () => getPollResults(poll.id),
      enabled: Boolean(authUser),
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const resultsByPollId = new Map(
    resultPollRows.map(({ poll }, index) => [
      poll.id,
      resultQueries[index]?.data?.results,
    ]),
  );

  useEffect(() => {
    if (user) setTheme(getThemeByUserProfile(user));
  }, [user, setTheme]);

  if (isAuthLoading || isPollsLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Sans.T240
          as="p"
          color="heading-page"
        >
          로딩 중...
        </Sans.T240>
      </div>
    );
  }

  if (isError || !authUser) {
    return (
      <Sans.T240 as="p">
        {error instanceof Error
          ? error.message
          : '사용자 정보를 불러오는 중 문제가 발생했습니다.'}
      </Sans.T240>
    );
  }

  const ongoingVotes = pollRows.filter(({ poll }) =>
    isPollStatus(poll, 'continuing'),
  );
  // TODO: 대표자 화면에 대리인 투표까지 합치려면 백엔드에서
  // original_user_id 기준 대리인 vote 조회 API를 제공해야 함.
  const completedVotes = pollRows.filter(
    ({ poll, myVote }) =>
      isPollStatus(poll, 'completed') && (isManagementAdmin || myVote !== null),
  );
  const displayedCompletedVotes = completedVotes.slice(0, 3);

  const handlePollAction = (pollId: number) => {
    if (isManagementAdmin) {
      router.push(`/dashboard/poll/${pollId}`);
      return;
    }

    router.push(`/poll/${pollId}`);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="relative h-[274px] w-full rounded-b-[20px] bg-profile shadow-[0_0_60px_rgba(0,0,0,0.04)]">
        <div className="absolute top-4 flex h-11 w-full items-center gap-3 px-5">
          <div className="flex h-7 items-center gap-4">
            <button
              type="button"
              aria-label="홈으로 이동"
              onClick={() => router.push('/')}
              className="flex size-6 items-center justify-center"
            >
              <Image
                src="/icons/back.svg"
                alt="back"
                width={24}
                height={24}
                className={
                  user.usesExecutiveTheme || user.role === 'REPRESENTATIVE'
                    ? 'brightness-0 invert'
                    : 'opacity-100'
                }
              />
            </button>
            <Sans.T200
              as="h2"
              color="profile-name"
            >
              <span className="leading-[140%] font-semibold tracking-[-0.02em]">
                내 투표
              </span>
            </Sans.T200>
          </div>
        </div>
        <div className="absolute top-22 right-5 left-5 flex flex-col gap-4">
          <div className="flex h-13 w-full items-center gap-4 px-2">
            <div className="flex flex-grow flex-col gap-2">
              <div className="flex items-center justify-between">
                <Sans.T240
                  as="h1"
                  weight="bold"
                  color="profile-name"
                  className="leading-[29px]"
                >
                  {user.name}
                </Sans.T240>

                {(user.role === 'AGENT' || user.showsExecutiveBadge) && (
                  <div className="flex items-center justify-center rounded bg-badge px-1.5 py-0.5">
                    <Sans.T120
                      as="span"
                      weight="medium"
                      color="badge"
                      lineHeight="17px"
                      letterSpacing="-0.1px"
                    >
                      {user.showsExecutiveBadge ? '임원진' : '대리인'}
                    </Sans.T120>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Sans.T160
                  as="span"
                  color="profile-support"
                  className="font-medium"
                >
                  {user.club}
                </Sans.T160>
                <Sans.T160
                  as="span"
                  color="profile-support"
                  className="font-medium"
                >
                  ·
                </Sans.T160>
                <Sans.T160
                  as="span"
                  color="profile-support"
                  className="font-medium"
                >
                  {user.position}
                </Sans.T160>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-5 rounded-[16px] bg-background-profile-section p-6">
            <div className="flex flex-col gap-3">
              <ProfileRow
                label="분과"
                value={user.department}
              />
              <ProfileRow
                label={user.showsExecutiveBadge ? '권한' : '소속'}
                value={user.studentId}
              />
              {/* <ProfileRow
                label="재휴학"
                value={user.status}
              /> */}
            </div>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-col gap-10 px-5 py-6">
        <section className="flex flex-col gap-4">
          <div className="flex h-10 items-center">
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="leading-[140%] font-semibold tracking-[-0.02em]">
                지금 진행 중인 투표
              </span>
            </Sans.T240>
          </div>
          {ongoingVotes.length > 0 ? (
            ongoingVotes.map(({ poll, myVote }) => {
              const results = resultsByPollId.get(poll.id);
              const voteCount = sumVotes(results);

              return (
                <PollCard
                  key={poll.id}
                  title={poll.question}
                  deadline={getPollDeadline(poll)}
                  statistics={{
                    quota: voteCount,
                    votes: voteCount,
                  }}
                  myVote={myVote?.selected}
                  isAdmin={isManagementAdmin}
                  onAction={() => handlePollAction(poll.id)}
                />
              );
            })
          ) : (
            <Sans.T160
              as="p"
              color="title-subvalue"
            >
              진행 중인 내 투표가 없습니다.
            </Sans.T160>
          )}
        </section>
        <section className="flex flex-col gap-4 pb-10">
          <div className="flex h-10 items-center justify-between">
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="font-semibold tracking-[-0.02em]">
                완료된 투표
              </span>
            </Sans.T240>
            <Link href="/completed-votes">
              <Image
                src="/icons/arrow.svg"
                alt="more"
                width={32}
                height={32}
                className={
                  user.usesExecutiveTheme
                    ? 'cursor-pointer brightness-0 invert'
                    : 'cursor-pointer'
                }
              />
            </Link>
          </div>
          {displayedCompletedVotes.length > 0 ? (
            displayedCompletedVotes.map(({ poll, myVote }) => {
              const results = resultsByPollId.get(poll.id);
              const voteCount = sumVotes(results);

              return (
                <HistoryCard
                  key={poll.id}
                  title={poll.question}
                  deadline={getPollDeadline(poll)}
                  myVote={myVote?.selected ?? '-'}
                  statistics={{
                    quota: voteCount,
                    votes: voteCount,
                  }}
                  results={getResultText(results)}
                  isAgent={user.role === 'AGENT'}
                  badgeLabel={user.showsExecutiveBadge ? '임원진' : undefined}
                  hideMyVote={isManagementAdmin}
                  href={
                    user.canOpenMemberResultPage === false
                      ? undefined
                      : `/poll/${poll.id}/result`
                  }
                />
              );
            })
          ) : (
            <Sans.T160
              as="p"
              color="title-subvalue"
            >
              완료된 내 투표가 없습니다.
            </Sans.T160>
          )}
          {completedVotes.length >= 3 && (
            <Link
              href="/completed-votes"
              className="w-full"
            >
              <div className="mt-1 flex flex-col">
                <Button
                  content="완료된 투표 더보기"
                  size="medium"
                />
              </div>
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-13.75">
        <Sans.T140
          as="p"
          weight="medium"
          lineHeight="17px"
          color="profile-label"
        >
          {label}
        </Sans.T140>
      </span>
      <Sans.T140
        as="p"
        weight="medium"
        lineHeight="17px"
        color="profile-value"
      >
        {value}
      </Sans.T140>
    </div>
  );
}
