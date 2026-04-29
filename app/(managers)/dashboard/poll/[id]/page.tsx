'use client';

import { Sans } from '@/app/ui/sans';
import { usePollResultsQuery } from '@/hooks/queries/usePollQuery';
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

  const { data, isPending, error } = usePollResultsQuery(Number(params.id));

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

  const totalVoters = 100;
  const votedCount = results.reduce(
    (acc: number, curr: PollResultItem) => acc + curr.count,
    0,
  );
  const turnoutPercentage = Math.round((votedCount / totalVoters) * 100);
  const maxCount = Math.max(...results.map((r: PollResultItem) => r.count));

  return (
    <main className="theme-executive min-h-screen bg-[#303030] pb-20 font-['Pretendard']">
      <div className="pt-4">
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
                  content={`${formatDate(poll.ended_at ?? '')}에 종료`}
                />
                <Label
                  name="상태"
                  content={
                    poll.status === 'continuing' ? '진행 중' : '대기/종료'
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

              <div className="flex w-full gap-[8px]">
                <button className="h-[44px] flex-1 rounded-[10px] bg-[#848485] font-semibold text-[#FFFFFF]">
                  종료하기
                </button>
                <button
                  onClick={() =>
                    router.push(`/dashboard/poll/${params.id}/edit`)
                  }
                  className="h-[44px] flex-[2.5] rounded-[10px] bg-[#A0191E] font-semibold text-[#FFFFFF]"
                >
                  수정하기
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
