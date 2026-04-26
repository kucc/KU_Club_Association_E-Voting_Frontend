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

/** --- 메인 컴포넌트 --- */
export default function Home() {
  const { data: authUser, isLoading, isError, error } = useCurrentUserQuery();
  const { setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [votes, setVotes] = useState<Poll[] | null>(null);

  useEffect(() => {
    createMockUser().then(setUser);
    createMockPolls().then(setVotes);
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

  // [로직 1] 역할에 따른 필터링
  const filteredVotes =
    user?.role === 'REPRESENTATIVE' ? votes : votes?.filter((v) => v.isMyVote);

  // [로직 2] 진행 중인 투표
  const ongoingVotes = filteredVotes.filter((v) => v.isOngoing);

  // [로직 3] 완료된 투표 전체 리스트
  const completedVotes = filteredVotes.filter((v) => !v.isOngoing);

  // [로직 4] 메인 화면 3개만
  const displayedCompletedVotes = completedVotes.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-voting-mint-high">
      {/* --- 상단 프로필 영역 --- */}
      <header className="relative h-[345px] w-full bg-voting-mint">
        <div className="absolute top-[62px] flex h-[44px] w-full items-center gap-[12px] px-[20px]">
          <div className="flex h-[28px] items-center gap-[16px]">
            <Image
              src="/icons/back.svg"
              alt="back"
              width={24}
              height={24}
              className="opacity-50"
            />
            <Sans.T200
              as="h2"
              color="heading-page"
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
              <Sans.T240
                as="h1"
                weight="bold"
                color="heading-page"
                className="leading-[29px]"
              >
                {user.name}
              </Sans.T240>
              <div className="flex items-center gap-[4px]">
                <Sans.T160
                  as="span"
                  color="title-subvalue"
                  className="font-medium"
                >
                  {user.club}
                </Sans.T160>
                <Sans.T160
                  as="span"
                  color="title-subvalue"
                  className="font-medium"
                >
                  ·
                </Sans.T160>
                <Sans.T160
                  as="span"
                  color="title-subvalue"
                  className="font-medium"
                >
                  {user.position}
                </Sans.T160>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-[20px] rounded-[16px] bg-white/40 p-[24px]">
            <div className="flex flex-col gap-[12px]">
              <InfoRow
                label="학과"
                value={user.department}
              />
              <InfoRow
                label="학번"
                value={user.studentId}
              />
              <InfoRow
                label="재휴학"
                value={user.status}
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- 하단 메인 영역 --- */}
      <main className="flex w-full flex-col gap-[40px] px-[20px] py-[24px]">
        {/* 진행 중인 투표 */}
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
            <div
              key={vote.id}
              className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm"
            >
              <Sans.T200
                as="h3"
                weight="bold"
                color="heading-page"
              >
                {vote.title}
              </Sans.T200>
              <div className="flex flex-col gap-[12px]">
                <VoteRow
                  label="마감 기한"
                  value={vote.deadline}
                />
                {vote.currentCount !== undefined && (
                  <VoteRow
                    label="투표 현황"
                    value={`${vote.currentCount}`}
                    subValue={`/ ${vote.totalParticipants} (${vote.votingRate}%)`}
                  />
                )}
                <VoteRow
                  label="내 투표"
                  value={vote.myVote}
                />
              </div>
              <button className="flex h-[40px] w-full items-center justify-center rounded-[10px] bg-voting-black text-[14px] font-semibold text-white active:scale-[0.98]">
                투표 수정하기
              </button>
            </div>
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
            <VoteCard
              key={vote.id}
              vote={vote}
            />
          ))}

          {/* 원본 리스트가 3개보다 많을 때만 더보기 버튼 노출 */}
          {completedVotes.length > 3 && (
            <Link
              href="/completed-votes"
              className="w-full"
            >
              <button className="mt-[4px] flex h-[42px] w-full items-center justify-center rounded-[10px] bg-voting-black text-[16px] font-semibold text-white active:scale-[0.98]">
                완료된 투표 더보기
              </button>
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}

/** --- 서브 컴포넌트 --- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[17px] items-center gap-[16px]">
      <Sans.T140
        as="span"
        color="input-placeholder"
        className="w-[55px] leading-[17px]"
      >
        <span className="font-medium">{label}</span>
      </Sans.T140>
      <Sans.T140
        as="span"
        color="title-subvalue"
        className="leading-[17px]"
      >
        <span className="font-medium">{value}</span>
      </Sans.T140>
    </div>
  );
}

function VoteRow({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex h-[17px] items-center gap-[16px]">
      <Sans.T140
        as="span"
        color="input-placeholder"
        className="w-[55px] leading-[17px]"
      >
        <span className="font-medium">{label}</span>
      </Sans.T140>
      <div className="flex h-[17px] items-center gap-[4px]">
        <Sans.T140
          as="span"
          color="title-subvalue"
          className="leading-[17px]"
        >
          <span className="font-medium">{value}</span>
        </Sans.T140>
        {subValue && (
          <Sans.T140
            as="span"
            color="input-placeholder"
            className="leading-[17px]"
          >
            <span className="font-medium">{subValue}</span>
          </Sans.T140>
        )}
      </div>
    </div>
  );
}

function VoteCard({ vote }: { vote: Poll }) {
  return (
    <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
      <div className="flex h-[24px] items-center justify-between">
        <Sans.T200
          as="h3"
          weight="bold"
          color="heading-page"
        >
          {vote.title}
        </Sans.T200>
        {vote.isAgentVote && (
          <div className="flex h-[21px] items-center justify-center rounded-[4px] bg-black px-[6px] py-[2px]">
            <Sans.T120
              as="span"
              color="heading-page-light"
            >
              <span className="font-medium">대리인</span>
            </Sans.T120>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[12px]">
        <VoteRow
          label="마감 기한"
          value={vote.deadline}
        />
        <VoteRow
          label="내 투표"
          value={vote.myVote}
        />
        {vote.attendanceCount !== undefined && (
          <VoteRow
            label="출석률"
            value={`${vote.attendanceCount}`}
            subValue={`/ ${vote.attendanceTotal} (${vote.attendanceRate}%)`}
          />
        )}
        {vote.resultStatus && (
          <VoteRow
            label="결과"
            value={`${vote.resultStatus} (${vote.resultRate}%)`}
          />
        )}
      </div>
    </div>
  );
}
