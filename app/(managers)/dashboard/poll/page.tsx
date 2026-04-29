'use client';

import { Sans } from '@/app/ui/sans';
import { useTheme } from '@/providers/theme-provider';

import { useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Label from '@/components/common/card/label';
import Title from '@/components/common/card/title';

import { formatDate } from '@/lib/utils';

type PollResultOption = {
  label: string;
  voteCount: number;
  percentage: number;
};

// 일반 사용자 페이지처럼 게이지 바를 별도 컴포넌트로 분리
type AdminResultOptionItemProps = Readonly<{
  option: PollResultOption;
  isHighest: boolean;
}>;

function AdminResultOptionItem({
  option,
  isHighest,
}: AdminResultOptionItemProps) {
  // 관리자 전용 피그마 색상
  const colorHex = isHighest ? '#F8A1A4' : '#A9ABAD';

  return (
    <div
      className="relative h-11 w-full overflow-hidden rounded-[10px] border bg-[#52514E] transition-all"
      style={{ borderColor: colorHex }}
    >
      {/* 일반 사용자 코드의 color-mix 방식 차용 */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-500"
        style={{
          width: `${option.percentage}%`,
          backgroundColor: `color-mix(in srgb, ${colorHex} 30%, transparent)`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-between px-4 py-3 text-left">
        <span
          className="text-[16px] leading-[20px] font-semibold"
          style={{ color: colorHex }}
        >
          {option.label}
        </span>
        <span
          className="text-[16px] leading-[20px] font-semibold"
          style={{ color: colorHex }}
        >
          {option.percentage}%
        </span>
      </div>
    </div>
  );
}

export default function AdminPollDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const pollId = params.id;

  useEffect(() => {
    setTheme('theme-executive');
  }, [setTheme]);

  const poll = {
    question: '제1회 동아리연합회장 선거',
    ended_at: '2026-04-07T16:00:00.000Z',
    manager: '홍길동',
    description:
      '투표 설명 어쩌고 저쩌고..\n무슨 투표인지\n뭐시기뭐시기\n어쩌고저쩌고',
    totalVoters: 24,
    votedCount: 12,
    options: [
      { label: '찬성', voteCount: 5, percentage: 41 },
      { label: '반대', voteCount: 4, percentage: 33 },
      { label: '기권', voteCount: 3, percentage: 26 },
    ],
  };

  const turnoutPercentage = Math.round(
    (poll.votedCount / poll.totalVoters) * 100,
  );
  const maxCount = Math.max(...poll.options.map((o) => o.voteCount));

  return (
    // 배경색 유지
    <main className="theme-executive min-h-screen bg-[#303030] pb-20">
      {/* 헤더 */}
      <div className="pt-4">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center opacity-50 brightness-0 invert"
          >
            <Image
              src="/icons/back.svg"
              alt="뒤로가기"
              width={24}
              height={24}
            />
          </button>
          <Sans.T200
            as="h1"
            weight="semi-bold"
            lineHeight="28px"
            letterSpacing="-0.4px"
            color="heading-page"
          >
            투표 상세
          </Sans.T200>
        </header>

        <div className="px-5 pt-6 pb-8">
          <Card>
            <div className="flex flex-col gap-5 rounded-[16px] bg-[#52514E]">
              <Title content={poll.question} />

              <div className="flex flex-col gap-3">
                <Label
                  name="마감 기한"
                  content={`${formatDate(poll.ended_at)}에 종료`}
                />
                <Label
                  name="책임자"
                  content={poll.manager}
                />
                <Label
                  name="투표 현황"
                  content={`${poll.votedCount} `}
                  subContent={`/ ${poll.totalVoters} (${turnoutPercentage}%)`}
                />
              </div>

              <Sans.T140
                as="p"
                color="title-value"
                lineHeight="20px"
                className="whitespace-pre-line text-[#D2D8DB]"
              >
                {poll.description}
              </Sans.T140>

              {/* 투표 안건 리스트 */}
              <div className="flex w-full flex-col gap-3">
                {poll.options.map((option) => (
                  <AdminResultOptionItem
                    key={option.label}
                    option={option}
                    isHighest={
                      option.voteCount === maxCount && option.voteCount > 0
                    }
                  />
                ))}
              </div>

              {/* --- 하단 관리자 버튼 영역 --- */}
              <div className="flex w-full gap-[8px]">
                <button
                  type="button"
                  className="flex h-[44px] w-[92px] cursor-pointer items-center justify-center rounded-[10px] border-none bg-[#848485] transition-transform active:scale-95"
                >
                  <span className="text-[16px] leading-[20px] font-semibold text-[#FFFFFF]">
                    종료하기
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/poll/${pollId}/edit`)}
                  className="flex h-[44px] w-[218px] cursor-pointer items-center justify-center rounded-[10px] border-none bg-[#A0191E] transition-transform active:scale-95"
                >
                  <span className="text-[16px] leading-[20px] font-semibold text-[#FFFFFF]">
                    수정하기
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
