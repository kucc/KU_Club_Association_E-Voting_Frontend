'use client';

import { getAdminAccountByUsername } from '@/app/(members)/_data/user-directory';
import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Label from '@/components/common/card/label';
import Title from '@/components/common/card/title';

import { cn, formatDate } from '@/lib/utils';

type PollResultOption = {
  label: string;
  voteCount: number;
  percentage: number;
};

type MockPollResult = {
  id: number;
  slug: string;
  question: string;
  description: string;
  manager: string;
  ended_at: string;
  totalVoters: number;
  votedCount: number;
  myVote: string;
  options: PollResultOption[];
};

const MOCK_POLL_RESULT: MockPollResult = {
  id: 1,
  slug: 'chairman-election-1',
  question: '제1회 동아리연합회장 선거',
  description:
    '투표 설명 어쩌고 저쩌고..\n무슨 투표인지\n뭐시기뭐시기\n어쩌고저쩌고',
  manager: '홍길동',
  ended_at: '2026-04-07T16:00:00.000Z',
  totalVoters: 24,
  votedCount: 12,
  myVote: '찬성',
  options: [
    { label: '찬성', voteCount: 10, percentage: 40 },
    { label: '반대', voteCount: 7, percentage: 30 },
    { label: '기권', voteCount: 7, percentage: 30 },
  ],
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
  const { data: authUser } = useCurrentUserQuery();
  const adminAccount = authUser
    ? getAdminAccountByUsername(authUser.username)
    : undefined;
  const usesExecutiveTheme = Boolean(
    authUser?.isAdmin || adminAccount?.usesExecutiveTheme,
  );
  const poll = MOCK_POLL_RESULT;
  const turnoutPercentage = Math.round(
    (poll.votedCount / poll.totalVoters) * 100,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-4">
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
              className={usesExecutiveTheme ? 'brightness-0 invert' : undefined}
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
              className="whitespace-pre-line"
            >
              {poll.description}
            </Sans.T140>

            <div className="flex w-full flex-col gap-3">
              {poll.options.map((option) => (
                <ResultOptionItem
                  key={option.label}
                  option={option}
                  checked={option.label === poll.myVote}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
