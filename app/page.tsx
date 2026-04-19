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
    // Promise.all로 유저와 투표 데이터를 동시에 받아오고 로딩 끝내기
    Promise.all([createMockUser(), createMockPolls()]).then(
      ([userData, pollData]) => {
        setUser(userData); // 비로그인이면 null이 들어감
        const sanitizedData = pollData.map((v) => ({
          ...v,
          deadline: v.deadline.includes('T')
            ? v.deadline
            : `20${v.deadline.replace(/\./g, '-').replace(' ', 'T')}:00`,
        }));
        setVotes(sanitizedData);
        setIsLoading(false); // 로딩 완료
      },
    );
  }, []);

  // 초기 데이터 불러올 때 빈 화면 렌더링
  if (isLoading) return null;

  // 옵셔널 체이닝(?.)을 써서 user가 null이어도 에러 안 나게
  const isManager = user?.role === 'EXECUTIVE';
  const isLogin = !!user;

  const ongoingVotes = (votes || []).filter((v) => v.isOngoing);
  const scheduledVotes = (votes || []).filter(
    (v) => !v.isOngoing && !v.resultStatus,
  );

  return (
    <div className="min-h-screen bg-background pb-[80px]">
      {/* --- 1. 상단 히어로(Hero) 섹션 --- */}
      <section
        className={`relative flex ${
          !isLogin ? 'h-[752px]' : isManager ? 'h-[602px]' : 'h-[526px]'
        } w-full flex-col rounded-b-[20px] ${
          isManager ? 'bg-[#FFDCDE]' : 'bg-hero-card'
        } shadow-[0_0_60px_rgba(0,0,0,0.04)] transition-all duration-300`}
      >
        {/* 아이콘 영역 */}
        {isLogin ? (
          <div className="absolute top-[62px] flex h-[44px] w-full items-center justify-between px-[20px]">
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
          <div className="absolute top-[62px] left-1/2 -translate-x-1/2">
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
            isLogin && !isManager ? 'mt-[58px]' : ''
          } flex w-full flex-col items-start justify-center gap-[10px] px-[20px] py-[10px]`}
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
            <div className="flex flex-row items-center gap-[4px]">
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

        {/* 관리자 바로가기 버튼 노출 */}
        {isManager && (
          <div className="absolute bottom-[24px] w-full px-[20px]">
            <Link
              href="/admin"
              className="w-full"
            >
              <button className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#A0191E] transition-transform active:scale-[0.98]">
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
          <div className="absolute top-[680px] w-full px-[20px]">
            <button className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-label-home transition-transform active:scale-[0.98]">
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
        <main className="flex w-full flex-col gap-[40px] px-[20px] py-[24px]">
          {/* 진행 중 투표 */}
          {ongoingVotes.length > 0 && (
            <section className="flex flex-col gap-[16px]">
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

          {/* 예정된 투표 */}
          {scheduledVotes.length > 0 && (
            <section className="flex flex-col gap-[16px]">
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
