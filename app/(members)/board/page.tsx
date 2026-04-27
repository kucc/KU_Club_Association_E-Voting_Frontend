'use client';

import { createMockPolls, createMockUser } from '@/app/lib/mocks';
import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';
import { useTheme } from '@/providers/theme-provider';
import type { Poll } from '@/types/poll';
import type { UserProfile } from '@/types/user';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/common/button';
import HistoryCard from '@/components/common/history-card';
import PollCard from '@/components/common/poll-card';

export default function Home() {
  const { data: authUser, isLoading, isError, error } = useCurrentUserQuery();
  const { setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [votes, setVotes] = useState<Poll[] | null>(null);

  useEffect(() => {
    createMockUser().then(setUser);
    createMockPolls().then((data) => {
      const sanitizedData = data.map((v) => ({
        ...v,
        deadline: v.deadline.includes('T')
          ? v.deadline
          : `20${v.deadline.replace(/\./g, '-').replace(' ', 'T')}:00`,
      }));
      setVotes(sanitizedData);
    });
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'EXECUTIVE') {
        setTheme('theme-executive');
      } else if (user.role === 'AGENT') {
        setTheme('theme-agent');
      } else {
        setTheme('theme-default');
      }
    }
  }, [user, setTheme]);

  if (isLoading || !user || !votes) {
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

  const filteredVotes =
    user.role === 'EXECUTIVE' ? votes : votes.filter((v) => v.isMyVote);
  const ongoingVotes = filteredVotes.filter((v) => v.isOngoing);
  const completedVotes = filteredVotes.filter((v) => !v.isOngoing);
  const displayedCompletedVotes = completedVotes.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* --- 상단 프로필 영역 --- */}
      <header className="relative h-86.25 w-full rounded-b-[20px] bg-profile shadow-[0_0_60px_rgba(0,0,0,0.04)]">
        {' '}
        {/* h-[345px] -> 86.25 */}
        <div className="absolute top-15.5 flex h-11 w-full items-center gap-3 px-5">
          {' '}
          {/* top-15.5(62px), h-11(44px), gap-3(12px), px-5(20px) */}
          <div className="flex h-7 items-center gap-4">
            {' '}
            {/* h-7(28px), gap-4(16px) */}
            <Image
              src="/icons/back.svg"
              alt="back"
              width={24}
              height={24}
              className={
                user.role === 'REPRESENTATIVE'
                  ? 'brightness-0 invert'
                  : 'opacity-100'
              }
            />
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
        <div className="absolute top-32.5 right-5 left-5 flex flex-col gap-4">
          {' '}
          {/* top-32.5(130px), right-5, left-5, gap-4(16px) */}
          <div className="flex h-13 w-full items-center gap-4 px-2">
            {' '}
            {/* h-13(52px), gap-4(16px), px-2(8px) */}
            <div className="flex flex-grow flex-col gap-1">
              {' '}
              {/* gap-1(4px) */}
              <div className="flex items-center justify-between">
                <Sans.T240
                  as="h1"
                  weight="bold"
                  color="profile-name"
                  className="leading-[29px]"
                >
                  {user.name}
                </Sans.T240>

                {user.role === 'AGENT' && (
                  <div className="flex items-center justify-center rounded bg-badge px-1.5 py-0.5">
                    {' '}
                    {/* rounded-[4px] -> rounded(4px), px-1.5(6px), py-0.5(2px) */}
                    <Sans.T120
                      as="span"
                      weight="medium"
                      color="badge"
                      lineHeight="17px"
                      letterSpacing="-0.1px"
                    >
                      대리인
                    </Sans.T120>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {' '}
                {/* gap-1(4px) */}
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
          <div className="rounded-4 flex w-full flex-col gap-5 bg-background-profile-section p-6">
            {' '}
            {/* gap-5(20px), rounded-4(16px), p-6(24px) */}
            <div className="flex flex-col gap-3">
              <ProfileRow
                label="학과"
                value={user.department}
              />
              <ProfileRow
                label="학번"
                value={user.studentId}
              />
              <ProfileRow
                label="재휴학"
                value={user.status}
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- 하단 메인 영역 --- */}
      <main className="flex w-full flex-col gap-10 px-5 py-6">
        {' '}
        {/* gap-10(40px), px-5(20px), py-6(24px) */}
        <section className="flex flex-col gap-4">
          {' '}
          {/* gap-4(16px) */}
          <div className="flex h-10 items-center">
            {' '}
            {/* h-10(40px) */}
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="leading-[140%] font-semibold tracking-[-0.02em]">
                지금 진행 중인 투표
              </span>
            </Sans.T240>
          </div>
          {ongoingVotes.map((vote) => (
            <PollCard
              key={vote.id}
              title={vote.title}
              deadline={vote.deadline}
              statistics={{
                quota: vote.totalParticipants || 0,
                votes: vote.currentCount || 0,
              }}
              myVote={vote.myVote}
              isAdmin={user.role === 'EXECUTIVE'}
            />
          ))}
        </section>
        <section className="flex flex-col gap-4 pb-10">
          {' '}
          {/* gap-4(16px), pb-10(40px) */}
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
                className="cursor-pointer opacity-20"
              />
            </Link>
          </div>
          {displayedCompletedVotes.map((vote) => (
            <HistoryCard
              key={vote.id}
              title={vote.title}
              deadline={vote.deadline}
              myVote={vote.myVote}
              statistics={{
                quota: vote.attendanceTotal || 0,
                votes: vote.attendanceCount || 0,
              }}
              results={`${vote.resultStatus}(${vote.resultRate}%)`}
              isAgent={vote.isAgentVote}
            />
          ))}
          {completedVotes.length > 3 && (
            <Link
              href="/completed-votes"
              className="w-full"
            >
              <div className="mt-1 flex flex-col">
                {' '}
                {/* mt-1(4px) */}
                <Button content="완료된 투표 더보기" />
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
