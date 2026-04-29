'use client';

import { getEligibleVoterCount } from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import {
  useEndPollMutation,
  usePollResultsQuery,
  useStartPollMutation,
} from '@/hooks/queries/usePollQuery';
import { useTheme } from '@/providers/theme-provider';

import { use, useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Label from '@/components/common/card/label';
import Title from '@/components/common/card/title';

import { formatDate } from '@/lib/utils';

interface PollResultItem {
  selected: string;
  count: number;
}

export default function AdminPollDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { setTheme } = useTheme();

  // 1. 데이터 조회 및 액션(시작/종료) Mutation 설정
  const { data, isPending, error } = usePollResultsQuery(Number(params.id));
  const { mutate: startPoll, isPending: isStarting } = useStartPollMutation();
  const { mutate: endPoll, isPending: isEnding } = useEndPollMutation();

  useEffect(() => {
    setTheme('theme-executive');
  }, [setTheme]);

  if (isPending)
    return <div className="p-10 text-center text-white">데이터 로딩 중</div>;
  if (error || !data)
    return (
      <div className="p-10 text-center text-red-500">
        투표 정보를 가져오지 못했습니다.
      </div>
    );

  const { poll, results } = data;

  const totalVoters = getEligibleVoterCount();
  const votedCount = results.reduce(
    (acc: number, curr: PollResultItem) => acc + curr.count,
    0,
  );
  const turnoutPercentage =
    totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0;
  const maxCount = Math.max(...results.map((r: PollResultItem) => r.count));

  //  투표 시작 핸들러
  const handleStartPoll = () => {
    if (confirm('투표를 시작하시겠습니까? 시작 즉시 회원들에게 공개됩니다.')) {
      startPoll(Number(params.id), {
        onSuccess: () => alert('투표가 시작되었습니다!'),
      });
    }
  };

  //  투표 종료 핸들러
  const handleEndPoll = () => {
    if (
      confirm(
        '이 투표를 지금 종료하시겠습니까?\n종료 후에는 더 이상 투표를 받을 수 없습니다.',
      )
    ) {
      endPoll(Number(params.id), {
        onSuccess: () => alert('투표가 종료되었습니다.'),
      });
    }
  };

  return (
    <main className="theme-executive min-h-screen bg-[#303030] pb-20 font-['Pretendard']">
      <div className="pt-15.5">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center opacity-50 brightness-0 invert"
          >
            <Image
              src="/icons/back.svg"
              alt="back"
              width={24}
              height={24}
            />
          </button>
          <Sans.T200
            as="h1"
            weight="semi-bold"
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
                  content={
                    poll.ended_at
                      ? `${formatDate(poll.ended_at)}에 종료`
                      : '기한 없음'
                  }
                />
                <Label
                  name="상태"
                  content={
                    poll.status === 'pending'
                      ? '대기 중'
                      : poll.status === 'continuing'
                        ? '진행 중'
                        : '종료됨'
                  }
                />
                <Label
                  name="투표 현황"
                  content={`${votedCount} `}
                  subContent={`/ ${totalVoters} (${turnoutPercentage}%)`}
                />
              </div>

              <Sans.T140
                as="p"
                color="title-value"
                lineHeight="20px"
                className="whitespace-pre-line text-[#D2D8DB]"
              >
                {(poll as { description?: string }).description ||
                  '등록된 상세 설명이 없습니다.'}
              </Sans.T140>

              <div className="flex w-full flex-col gap-3">
                {poll.options.map((optionLabel: string) => {
                  const resultData = results?.find(
                    (r: PollResultItem) => r.selected === optionLabel,
                  );
                  const count = resultData ? resultData.count : 0;

                  const percentage =
                    votedCount > 0 ? Math.round((count / votedCount) * 100) : 0;
                  const isHighest =
                    votedCount > 0 && count === maxCount && count > 0;
                  const colorHex = isHighest ? '#F8A1A4' : '#A9ABAD';

                  return (
                    <div
                      key={optionLabel}
                      className="relative h-11 w-full overflow-hidden rounded-[10px] border bg-[#52514E]"
                      style={{ borderColor: colorHex }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: `color-mix(in srgb, ${colorHex} 30%, transparent)`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4 py-3">
                        <span
                          className="text-[16px] font-semibold"
                          style={{ color: colorHex }}
                        >
                          {optionLabel}
                        </span>
                        <span
                          className="text-[16px] font-semibold"
                          style={{ color: colorHex }}
                        >
                          {percentage}% ({count}표)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {poll.status !== 'completed' && (
                <div className="flex w-full gap-[8px]">
                  {poll.status === 'pending' && (
                    <button
                      onClick={handleStartPoll}
                      disabled={isStarting}
                      className="h-[44px] flex-1 rounded-[10px] bg-[#28A745] font-semibold text-[#FFFFFF] disabled:opacity-50"
                    >
                      {isStarting ? '시작 중...' : '시작하기'}
                    </button>
                  )}

                  {poll.status === 'continuing' && (
                    <button
                      onClick={handleEndPoll}
                      disabled={isEnding}
                      className="h-[44px] flex-1 rounded-[10px] bg-[#848485] font-semibold text-[#FFFFFF] disabled:opacity-50"
                    >
                      {isEnding ? '종료 중...' : '종료하기'}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      router.replace(`/dashboard/poll/${params.id}/edit`)
                    }
                    className="h-[44px] flex-[2.5] rounded-[10px] bg-[#A0191E] font-semibold text-[#FFFFFF]"
                  >
                    수정하기
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
