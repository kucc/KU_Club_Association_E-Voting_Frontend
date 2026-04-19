'use client';

import { createMockPolls, createMockUser } from '@/app/lib/mocks';
import { Sans } from '@/app/ui/sans';
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
  const { setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [votes, setVotes] = useState<Poll[] | null>(null);

  useEffect(() => {
    createMockUser().then(setUser);
    createMockPolls().then((data) => {
      const sanitizedData = data.map((v) => ({
        ...v,
        // '26.04.07 16:00' -> '2026-04-07T16:00:00Z' 형태로 인식되게 보정
        deadline: v.deadline.includes('T')
          ? v.deadline
          : `20${v.deadline.replace(/\./g, '-').replace(' ', 'T')}:00`,
      }));
      setVotes(sanitizedData);
    });
  }, []);

  // 유저 역할에 맞춰 테마 변경
  useEffect(() => {
    if (user) {
      if (user.role === 'EXECUTIVE') {
        setTheme('theme-executive'); // 전체 관리자
      } else if (user.role === 'AGENT') {
        setTheme('theme-agent'); // 대리인
      } else {
        setTheme('theme-default'); // 대표자
      }
    }
  }, [user, setTheme]);

  if (!user || !votes) {
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

  const filteredVotes =
    user.role === 'EXECUTIVE' ? votes : votes.filter((v) => v.isMyVote);
  const ongoingVotes = filteredVotes.filter((v) => v.isOngoing);
  const completedVotes = filteredVotes.filter((v) => !v.isOngoing);
  const displayedCompletedVotes = completedVotes.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* --- 상단 프로필 영역 --- */}
      <header className="relative h-[345px] w-full rounded-b-[20px] bg-profile shadow-[0_0_60px_rgba(0,0,0,0.04)]">
        <div className="absolute top-[62px] flex h-[44px] w-full items-center gap-[12px] px-[20px]">
          <div className="flex h-[28px] items-center gap-[16px]">
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

        <div className="absolute top-[130px] right-[20px] left-[20px] flex flex-col gap-[16px]">
          <div className="flex h-[52px] w-full items-center gap-[16px] px-[8px]">
            <div className="flex flex-grow flex-col gap-[4px]">
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
                  <div className="flex items-center justify-center rounded-[4px] bg-badge px-[6px] py-[2px]">
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
              <div className="flex items-center gap-[4px]">
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

          <div className="flex w-full flex-col gap-[20px] rounded-[16px] bg-background-profile-section p-[24px]">
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
      <main className="flex w-full flex-col gap-[40px] px-[20px] py-[24px]">
        {/* 지금 진행 중인 투표 */}
        <section className="flex flex-col gap-[16px]">
          <div className="flex h-[40px] items-center">
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

        {/* 완료된 투표 */}
        <section className="flex flex-col gap-[16px] pb-[40px]">
          <div className="flex h-[40px] items-center justify-between">
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
              <div className="mt-[4px] flex flex-col">
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
