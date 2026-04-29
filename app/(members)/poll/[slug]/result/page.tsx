'use client';

import { getAdminPositionById } from '@/app/(members)/_data/user-directory';
import {
  getEligibleVoterCount,
  getThemeByUserProfile,
  toUserProfile,
} from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';
import { usePollResultsQuery } from '@/hooks/queries/usePollQuery';
import { useMyVoteQuery } from '@/hooks/queries/useVoteQuery';
import { useTheme } from '@/providers/theme-provider';

import { useEffect, useMemo } from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Label from '@/components/common/card/label';
import Title from '@/components/common/card/title';

import { cn, formatDate } from '@/lib/utils';

type PollResultOption = {
  label: string;
  voteCount: number;
  percentage: number;
};

type PollDetailFields = {
  description?: string;
  proposer?: string;
};

const getOptionalPollText = (
  poll: object,
  key: keyof PollDetailFields,
): string | undefined => {
  const value = (poll as Record<string, unknown>)[key];

  return typeof value === 'string' && value.trim().length > 0
    ? value
    : undefined;
};

type ResultOptionItemProps = Readonly<{
  option: PollResultOption;
  checked: boolean;
}>;

function ResultOptionItem({ option, checked }: ResultOptionItemProps) {
  return (
    <div
      aria-label={`${option.label} ${option.percentage}%${checked ? ', 내가 투표한 항목' : ''}`}
      className={cn(
        'relative h-11 w-full overflow-hidden rounded-[10px] border',
        checked
          ? 'border-[color:var(--color-text-label-select)] bg-label-select'
          : 'border-[color:var(--color-text-label-not-select)] bg-label-not-select',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute -top-px -left-px h-11',
          checked
            ? 'bg-[color:color-mix(in_srgb,var(--color-text-label-select)_30%,transparent)]'
            : 'bg-[color:color-mix(in_srgb,var(--color-text-label-not-select)_30%,transparent)]',
        )}
        style={{ width: `calc(${option.percentage}% + 2px)` }}
      />

      <div className="absolute inset-0 flex h-11 w-full items-center gap-2 px-4 py-3">
        {checked ? (
          <span className="relative block size-3 shrink-0">
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[color:var(--color-label)]">
              <Image
                src="/icons/small_union.svg"
                alt=""
                width={6}
                height={6}
                aria-hidden="true"
              />
            </span>
          </span>
        ) : null}

        <Sans.T160
          as="span"
          weight="semi-bold"
          lineHeight="20px"
          color={checked ? 'label-select' : 'label-not-select'}
          className="truncate"
        >
          {option.label}
        </Sans.T160>

        <Sans.T160
          as="span"
          weight="semi-bold"
          lineHeight="20px"
          color={checked ? 'label-select' : 'label-not-select'}
          className="ml-auto shrink-0"
        >
          {option.percentage}%
        </Sans.T160>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const params = useParams<{ slug: string }>();
  const pollId = Number(params.slug);

  const { data: authUser, isLoading: isAuthLoading } = useCurrentUserQuery();
  const {
    data: pollResult,
    isLoading: isPollLoading,
    isError: isPollError,
    error: pollError,
  } = usePollResultsQuery(pollId);
  const { data: myVote, isLoading: isMyVoteLoading } = useMyVoteQuery(
    pollId,
    authUser?.id,
  );

  const userProfile = useMemo(() => {
    return authUser ? toUserProfile(authUser) : null;
  }, [authUser]);

  useEffect(() => {
    if (userProfile) setTheme(getThemeByUserProfile(userProfile));
  }, [userProfile, setTheme]);

  if (!Number.isFinite(pollId) || pollId <= 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Sans.T200
          as="p"
          color="heading-page"
        >
          올바르지 않은 투표입니다.
        </Sans.T200>
      </main>
    );
  }

  if (isPollError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 text-center">
        <Sans.T200
          as="p"
          color="heading-page"
        >
          {pollError instanceof Error
            ? pollError.message
            : '투표 결과를 불러오는 중 문제가 발생했습니다.'}
        </Sans.T200>
      </main>
    );
  }

  if (isAuthLoading || isPollLoading || isMyVoteLoading || !pollResult) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Sans.T200
          as="p"
          color="heading-page"
        >
          로딩 중...
        </Sans.T200>
      </main>
    );
  }

  const { poll, results } = pollResult;
  const pollDescription = getOptionalPollText(poll, 'description');
  const pollProposer = getOptionalPollText(poll, 'proposer');
  const totalVotes = results.reduce((total, result) => total + result.count, 0);
  const eligibleVoterCount = getEligibleVoterCount();
  const turnoutPercentage =
    eligibleVoterCount > 0
      ? Math.round((totalVotes / eligibleVoterCount) * 100)
      : 0;
  const resultCountByOption = new Map(
    results.map((result) => [result.selected, result.count]),
  );
  const options = poll.options.map((option) => {
    const voteCount = resultCountByOption.get(option) ?? 0;
    const percentage =
      totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

    return {
      label: option,
      voteCount,
      percentage,
    };
  });
  const currentVote = myVote?.selected ?? null;

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-15.5">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center"
          >
            <Image
              src="/icons/back.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              className={
                userProfile?.usesExecutiveTheme
                  ? 'brightness-0 invert'
                  : undefined
              }
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
            <Title content={poll.question} />

            <div className="flex flex-col gap-3">
              <Label
                name="마감 기한"
                content={
                  poll.ended_at ? `${formatDate(poll.ended_at)}에 종료` : '미정'
                }
              />
              <Label
                name="책임자"
                content={
                  pollProposer ??
                  getAdminPositionById(poll.created_by) ??
                  `사용자 #${poll.created_by}`
                }
              />
              <Label
                name="투표 현황"
                content={`${totalVotes} `}
                subContent={`/ ${eligibleVoterCount} (${turnoutPercentage}%)`}
              />
            </div>

            {pollDescription ? (
              <Sans.T140
                as="p"
                color="title-value"
                lineHeight="20px"
                className="whitespace-pre-line"
              >
                {pollDescription}
              </Sans.T140>
            ) : null}

            <div className="flex w-full flex-col gap-3">
              {options.map((option) => (
                <ResultOptionItem
                  key={option.label}
                  option={option}
                  checked={option.label === currentVote}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
