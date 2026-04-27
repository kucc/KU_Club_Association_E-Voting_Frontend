'use client';

import { createMockPolls, createMockUser } from '@/app/lib/mocks';
import { Sans } from '@/app/ui/sans';
import type { Poll } from '@/types/poll';
import type { UserProfile } from '@/types/user';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import PollCard from '@/components/common/poll-card';
import ScheduledCard from '@/components/common/scheduled-card';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [votes, setVotes] = useState<Poll[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([createMockUser(), createMockPolls()]).then(
      ([userData, pollData]) => {
        setUser(userData);
        const sanitizedData = pollData.map((v) => ({
          ...v,
          deadline: v.deadline.includes('T')
            ? v.deadline
            : `20${v.deadline.replace(/\./g, '-').replace(' ', 'T')}:00`,
        }));
        setVotes(sanitizedData);
        setIsLoading(false);
      },
    );
  }, []);

  if (isLoading) return null;

  const isManager = user?.role === 'EXECUTIVE';
  const isLogin = !!user;

  const ongoingVotes = (votes || []).filter((v) => v.isOngoing);
  const scheduledVotes = (votes || []).filter(
    (v) => !v.isOngoing && !v.resultStatus,
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {' '}
      {/* pb-20 (80px) */}
      {/* --- 1. 상단 히어로(Hero) 섹션 --- */}
      <section
        className={`relative flex ${
          // 💡 Canonical Classes 적용 (높이)
          !isLogin ? 'h-188' : isManager ? 'h-150.5' : 'h-131.5'
        } w-full flex-col rounded-b-[20px] ${
          // 💡 곡률 복구 완료!
          isManager ? 'bg-[#FFDCDE]' : 'bg-hero-card'
        } shadow-[0_0_60px_rgba(0,0,0,0.04)] transition-all duration-300`}
      >
        {/* 아이콘 영역 */}
        {isLogin ? (
          <div className="absolute top-15.5 flex h-11 w-full items-center justify-between px-5">
            {' '}
            {/* top-15.5(62px), h-11(44px) */}
            <Image
              src="/icons/logo_poll.svg"
              alt="logo"
              width={28}
              height={28}
              className={isManager ? '' : 'brightness-0 invert'}
            />
            <Image
              src="/icons/profile.svg"
              alt="profile"
              width={28}
              height={28}
              className={isManager ? '' : 'brightness-0 invert'}
            />
          </div>
        ) : (
          <div className="absolute top-15.5 left-1/2 -translate-x-1/2">
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
          className={`absolute top-1/2 -translate-y-1/2 ${
            isLogin && !isManager ? 'mt-14.5' : '' // mt-14.5(58px)
          } flex w-full flex-col items-start justify-center gap-2.5 px-5 py-2.5`} // gap, px, py 2.5(10px)
        >
          <Sans.T400
            as="h1"
            weight="bold"
            color={isManager ? 'label-home' : 'hero'}
          >
            <span className="block leading-[48px] tracking-[-1px]">
              {'고려대학교\n동아리연합회\n온라인투표시스템'}
            </span>
          </Sans.T400>

          {isLogin ? (
            <div className="flex flex-row items-center gap-1">
              <Sans.T200
                as="span"
                weight="bold"
                color={isManager ? 'label-home' : 'hero'}
              >
                {user?.name}
              </Sans.T200>
              <Sans.T200
                as="span"
                weight="medium"
                color={isManager ? 'label-home' : 'hero'}
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
              © KUCC
            </Sans.T200>
          )}
        </div>

        {/* 관리자 바로가기 버튼 */}
        {isManager && (
          <div className="absolute bottom-6 w-full px-5">
            {' '}
            {/* bottom-6(24px) */}
            <Link
              href="/admin"
              className="w-full"
            >
              <button className="flex h-13 w-full items-center justify-center rounded-[10px] bg-[#A0191E] transition-transform active:scale-[0.98]">
                <Sans.T200
                  as="span"
                  weight="semi-bold"
                  className="text-white"
                >
                  관리자 모드 바로가기
                </Sans.T200>
              </button>
            </Link>
          </div>
        )}

        {/* 로그인 전 버튼 */}
        {!isLogin && (
          <div className="absolute top-170 w-full px-5">
            {' '}
            {/* top-170(680px) */}
            <button className="flex h-13 w-full items-center justify-center rounded-[10px] bg-label-home transition-transform active:scale-[0.98]">
              <Sans.T200
                as="span"
                weight="semi-bold"
                color="label-home"
              >
                로그인 후 이용
              </Sans.T200>
            </button>
          </div>
        )}
      </section>
      {/* --- 2. 하단 리스트 영역 --- */}
      {isLogin && (
        <main className="flex w-full flex-col gap-10 px-5 py-6">
          {' '}
          {/* gap-10(40px), py-6(24px) */}
          {/* 진행 중 투표 섹션 */}
          {ongoingVotes.length > 0 && (
            <section className="flex flex-col gap-4">
              <Sans.T240
                as="h2"
                color="heading-page"
                weight="bold"
              >
                지금 진행 중인 투표
              </Sans.T240>
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
                  isAdmin={isManager}
                />
              ))}
            </section>
          )}
          {/* 예정된 투표 섹션 */}
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
                    title={vote.title}
                    openingTime={vote.deadline}
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
