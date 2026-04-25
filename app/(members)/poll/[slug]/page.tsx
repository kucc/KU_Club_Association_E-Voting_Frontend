'use client';

import { Sans } from '@/app/ui/sans';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Labels, { type LabelType } from '@/components/common/card/labels';
import Title from '@/components/common/card/title';

import { cn, formatDate } from '@/lib/utils';

import VoteSuccessModal from './_components/vote-success-modal';

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
    proposer: '홍길동',
    endedAt: '2026-04-08T10:00:00.000Z',
    options: ['찬성', '반대', '기권'],
  },
];

const MOCK_INITIAL_MY_VOTE: string | null = null;

type VoteOptionItemProps = Readonly<{
  label: string;
  checked: boolean;
  onSelect: () => void;
}>;

function VoteOptionItem({ label, checked, onSelect }: VoteOptionItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        'flex h-11 w-full items-center gap-2 rounded-[10px] border bg-background-section px-4 py-3 text-left',
        checked ? 'border-text-label-select' : 'border-text-label-not-select',
      )}
    >
      <span className="relative block size-3 shrink-0">
        {checked ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-text-label-select">
            <Image
              src="/icons/small_union.svg"
              alt="투표 선택됨"
              width={8}
              height={7}
              aria-hidden="true"
            />
          </span>
        ) : (
          <span className="absolute inset-0 rounded-full border border-text-label-not-select" />
        )}
      </span>

      <Sans.T160
        as="span"
        weight="semi-bold"
        lineHeight="20px"
        color={checked ? 'label-select' : 'label-not-select'}
      >
        {label}
      </Sans.T160>
    </button>
  );
}

type SubmitButtonState = 'enabled' | 'soft-disabled' | 'done-disabled';

/* api 사용 시 Props 타입 정의
  type Props = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default function Page({ params }: Props) {  */
export default function Page() {
  const router = useRouter();
  const poll = MOCK_POLLS[0];

  const [currentVote, setCurrentVote] = useState<string | null>(
    MOCK_INITIAL_MY_VOTE,
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(
    MOCK_INITIAL_MY_VOTE,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmittedState, setIsSubmittedState] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const labels = useMemo<LabelType[]>(
    () => [
      { name: '마감 기한', content: `${formatDate(poll.endedAt)}에 종료` },
      { name: '발의자', content: poll.proposer },
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
    if (isSubmittedState) setIsSubmittedState(false);
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!canSubmit || selectedOption === null) return;
    // API 연결 시:
    //   최초 투표 → POST /api/votes/vote { poll_id, selected }
    //   수정 투표 → PATCH /api/votes/edit-vote { poll_id, selected }
    setIsEditMode(hasExistingVote);
    setCurrentVote(selectedOption);
    setIsSubmittedState(true);
    setShowSuccessModal(true);
  };

  return (
    <main className="theme-default min-h-screen bg-background">
      <div className="pt-4">
        <header className="flex h-11 items-center gap-3 px-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center opacity-50"
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

        {/* 카드 컨테이너 */}
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

              {/* 투표 옵션 목록 */}
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

              {/* 제출 버튼 */}
              <button
                type="button"
                disabled={submitButtonState !== 'enabled'}
                onClick={handleSubmit}
                className={cn(
                  'flex h-11 w-full items-center justify-center rounded-[10px] px-2.5 py-3',
                  submitButtonState === 'enabled' && 'bg-label',
                  submitButtonState === 'soft-disabled' && 'bg-label-home',
                  submitButtonState === 'done-disabled' && 'bg-label-success',
                )}
              >
                <Sans.T160
                  as="span"
                  weight="semi-bold"
                  lineHeight="20px"
                  color={
                    submitButtonState === 'done-disabled'
                      ? 'label' // 흰색 텍스트
                      : 'label'
                  }
                >
                  {submitButtonLabel}
                </Sans.T160>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* VoteSuccessModal 렌더링 */}
      {showSuccessModal ? (
        <VoteSuccessModal
          onClose={() => setShowSuccessModal(false)}
          isEdit={isEditMode}
        />
      ) : null}
    </main>
  );
}
