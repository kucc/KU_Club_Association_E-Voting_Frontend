'use client';

import {
  getEligibleVoterCount,
  getThemeByUserProfile,
  toUserProfile,
} from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import {
  useCurrentUserQuery,
  useSignOutMutation,
} from '@/hooks/queries/useAuthQuery';
import {
  pollQueryKeys,
  usePollsQuery,
  useStartPollMutation,
} from '@/hooks/queries/usePollQuery';
import { useTheme } from '@/providers/theme-provider';
import { getPollResults } from '@/services/polls';
import { useQueries } from '@tanstack/react-query';

import { useEffect, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import PollCard from '@/components/common/poll-card';
import ScheduledCard from '@/components/common/scheduled-card';

export default function Home() {
  const { data, isSuccess } = useCurrentUserQuery();
  const polls = usePollsQuery();
  const startPollMutation = useStartPollMutation();

  const { setTheme } = useTheme();
  const { mutate: _signOut } = useSignOutMutation();

  const userProfile = useMemo(() => {
    return data ? toUserProfile(data) : null;
  }, [data]);
  const isManagementAdmin = userProfile?.canOpenMemberResultPage === false;
  const usesExecutiveTheme = Boolean(userProfile?.usesExecutiveTheme);
  const canStartPoll =
    isSuccess &&
    ['president', 'vicepresident', 'vice_president', 'admin'].includes(
      data.username,
    );

  const ongoingVotes = (polls.data || []).filter(
    (v) => v.status === 'continuing',
  );
  const scheduledVotes = (polls.data || []).filter(
    (v) => v.status === 'pending',
  );
  const eligibleVoterCount = getEligibleVoterCount();

  const ongoingPollResultQueries = useQueries({
    queries: ongoingVotes.map((vote) => ({
      queryKey: pollQueryKeys.detail(vote.id),
      queryFn: () => getPollResults(vote.id),
      enabled: isSuccess,
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    })),
  });
  const resultsByPollId = new Map(
    ongoingVotes.map((vote, index) => [
      vote.id,
      ongoingPollResultQueries[index]?.data?.results,
    ]),
  );

  const signOut = () => {
    setTheme('theme-default');
    _signOut();
  };

  useEffect(() => {
    if (!userProfile) {
      setTheme('theme-default');
      return;
    }

    setTheme(getThemeByUserProfile(userProfile));
  }, [setTheme, userProfile]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <section
        className={`flex ${
          !isSuccess ? 'h-188' : 'h-131.5'
        } w-full flex-col rounded-b-[20px] bg-hero-card pt-15.5 shadow-[0_0_60px_rgba(0,0,0,0.04)] transition-all duration-300`}
      >
        {isSuccess ? (
          <div className="flex h-11 w-full items-center justify-between px-5">
            {/* <Image
              src="/icons/logo_poll.svg"
              alt="logo"
              width={28}
              height={28}
              className={
                usesExecutiveTheme
                  ? 'cursor-pointer'
                  : 'cursor-pointer brightness-0 invert'
              }
              onClick={() => signOut()}
            /> */}
            <div
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <Sans.T160
                as="p"
                weight="medium"
                color="hero"
              >
                로그아웃
              </Sans.T160>
            </div>
            <Link href="/board">
              <Image
                src="/icons/profile.svg"
                alt="profile"
                width={28}
                height={28}
                className={usesExecutiveTheme ? '' : 'brightness-0 invert'}
              />
            </Link>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <Image
              src="/icons/logo_poll.svg"
              alt="logo"
              width={28}
              height={28}
              className="brightness-0 invert"
            />
          </div>
        )}

        {/* 타이틀 및 문구 영역 */}
        <div
          className={`${
            isSuccess && !usesExecutiveTheme ? 'mt-14.5' : ''
          } mt-45 flex w-full flex-col items-start justify-center gap-2.5 px-5 py-2.5`}
        >
          <Sans.T400
            as="h1"
            weight="bold"
            color="hero"
          >
            <span className="block leading-12 tracking-[-1px]">
              {'고려대학교\n동아리연합회\n온라인투표시스템'}
            </span>
          </Sans.T400>

          {isSuccess ? (
            <div className="flex flex-row items-center gap-1">
              <Sans.T200
                as="span"
                weight="bold"
                color="hero"
              >
                {data?.username}
              </Sans.T200>
              <Sans.T200
                as="span"
                weight="medium"
                color="hero"
              >
                님 환영합니다
              </Sans.T200>
            </div>
          ) : (
            <Sans.T200
              as="p"
              weight="medium"
              color="hero"
            >
              KUVOTE © KUCC
            </Sans.T200>
          )}
        </div>

        {/* 관리자 바로가기 버튼 */}
        {/* {isManager && (
          <div className="absolute bottom-6 w-full px-5">
            <Link
              href="/admin"
              className="w-full"
            >
              <Button
                content="관리자 모드 바로가기"
                bigText
              ></Button>
            </Link>
          </div>
        )} */}

        {/* 로그인 전 버튼 */}
        {!isSuccess && (
          <div className="mt-51.25 w-full px-5">
            <Link href="/signin">
              <button className="flex h-13 w-full cursor-pointer items-center justify-center rounded-[10px] bg-label-home transition-transform active:scale-[0.98]">
                <Sans.T200
                  as="span"
                  weight="semi-bold"
                  color="label-home"
                  letterSpacing="0"
                  lineHeight="28px"
                >
                  로그인 후 이용
                </Sans.T200>
              </button>
            </Link>
          </div>
        )}
      </section>

      {isSuccess && (
        <main className="flex w-full flex-col gap-10 px-5 py-6">
          {ongoingVotes.length > 0 && (
            <section className="flex flex-col gap-4">
              <Sans.T240
                as="h2"
                color="heading-page"
                weight="bold"
              >
                지금 진행 중인 투표
              </Sans.T240>
              {ongoingVotes.map((vote) => {
                const voteCount =
                  resultsByPollId
                    .get(vote.id)
                    ?.reduce((total, result) => total + result.count, 0) ?? 0;

                return (
                  <PollCard
                    key={vote.id}
                    id={vote.id}
                    title={vote.question}
                    deadline={vote.ended_at || ''}
                    statistics={{
                      quota: eligibleVoterCount,
                      votes: voteCount,
                    }}
                    // myVote={vote.myVote}
                    isAdmin={isManagementAdmin}
                  />
                );
              })}
            </section>
          )}

          {scheduledVotes.length > 0 && (
            <section className="flex flex-col gap-4">
              <Sans.T240
                as="h2"
                color="heading-page"
                weight="bold"
              >
                예정된 투표
              </Sans.T240>
              <div className="flex flex-col gap-4">
                {scheduledVotes.map((vote) => (
                  <ScheduledCard
                    key={vote.id}
                    title={vote.question}
                    openingTime={vote.ended_at || ''}
                    isAdmin={canStartPoll}
                    isStarting={
                      startPollMutation.isPending &&
                      startPollMutation.variables === vote.id
                    }
                    onStart={() => startPollMutation.mutate(vote.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
