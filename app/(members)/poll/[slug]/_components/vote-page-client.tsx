'use client';

import { Sans } from '@/app/ui/sans';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Labels, { type LabelType } from '@/components/common/card/labels';
import Title from '@/components/common/card/title';

import { cn, formatDate } from '@/lib/utils';

import VoteOptionItem from './vote-option-item';
import VoteSuccessModal from './vote-success-modal';

type Props = Readonly<{
  slug: string;
}>;

type MockPoll = {
  id: number;
  slug: string;
  question: string;
  description: string;
  proposer: string;
  endedAt: string;
  options: string[];
};

const MOCK_POLLS: MockPoll[] = [
  {
    id: 1,
    slug: 'chairman-election-1',
    question: '제1회 동아리연합회장 선거',
    description:
      '투표 설명 어쩌고 저쩌고...\n무슨 투표인지\n뭐시기뭐시기\n어쩌고저쩌고',
    proposer: '김땡땡',
    endedAt: '2026-04-08T10:00:00.000Z',
    options: ['찬성', '반대', '기권'],
  },
];

const MOCK_INITIAL_MY_VOTE: string | null = null;
// const MOCK_INITIAL_MY_VOTE: string | null = '찬성';

type SubmitButtonState = 'enabled' | 'soft-disabled' | 'done-disabled';

export default function VotePageClient({ slug }: Props) {
  const router = useRouter();

  const poll = useMemo(() => {
    return MOCK_POLLS.find((item) => item.slug === slug) ?? MOCK_POLLS[0];
  }, [slug]);

  const [currentVote, setCurrentVote] = useState<string | null>(
    MOCK_INITIAL_MY_VOTE,
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(
    MOCK_INITIAL_MY_VOTE,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmittedState, setIsSubmittedState] = useState(false);

  const labels = useMemo<LabelType[]>(
    () => [
      {
        name: '마감 기한',
        content: `${formatDate(poll.endedAt)}에 종료`,
      },
      {
        name: '발의자',
        content: poll.proposer,
      },
    ],
    [poll.endedAt, poll.proposer],
  );

  const hasExistingVote = currentVote !== null;
  const hasChangedSelection = selectedOption !== currentVote;
  const canSubmit =
    selectedOption !== null && !isSubmittedState && hasChangedSelection;

  const submitButtonState: SubmitButtonState = isSubmittedState
    ? 'done-disabled'
    : canSubmit
      ? 'enabled'
      : 'soft-disabled';

  const submitButtonLabel = isSubmittedState
    ? '투표 완료'
    : hasExistingVote
      ? '투표 수정'
      : '투표하기';

  const handleSelectOption = (option: string) => {
    if (isSubmittedState) {
      setIsSubmittedState(false);
    }

    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!canSubmit || selectedOption === null) {
      return;
    }

    setCurrentVote(selectedOption);
    setIsSubmittedState(true);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <main className="theme-default min-h-screen bg-background">
      <section className="mx-auto w-full max-w-[402px] pt-15.5">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex h-6 w-6 items-center justify-center opacity-50"
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
            투표하기
          </Sans.T200>
        </header>

        <div className="px-5 pt-6 pb-8">
          <Card>
            <div className="flex flex-col gap-5">
              <Title content={poll.question} />

              <Labels labels={labels} />

              <Sans.T140
                as="p"
                color="title-value"
                lineHeight="20px"
                className="whitespace-pre-line"
              >
                {poll.description}
              </Sans.T140>

              <div className="flex flex-col gap-3">
                {poll.options.map((option) => (
                  <VoteOptionItem
                    key={option}
                    label={option}
                    checked={selectedOption === option}
                    onSelect={() => handleSelectOption(option)}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={submitButtonState !== 'enabled'}
                onClick={handleSubmit}
                className={cn(
                  'flex h-11 w-full items-center justify-center rounded-[10px] px-2.5 py-3',
                  submitButtonState === 'enabled' && 'bg-label',
                  submitButtonState === 'soft-disabled' && 'bg-label-home',
                  submitButtonState === 'done-disabled' &&
                    'bg-label-unavailable',
                )}
              >
                <Sans.T160
                  as="span"
                  weight="semi-bold"
                  lineHeight="20px"
                  color="label"
                >
                  {submitButtonLabel}
                </Sans.T160>
              </button>
            </div>
          </Card>
        </div>
      </section>

      {showSuccessModal ? (
        <VoteSuccessModal onClose={handleCloseSuccessModal} />
      ) : null}
    </main>
  );
}
