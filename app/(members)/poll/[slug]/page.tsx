'use client';

import { getAdminPositionById } from '@/app/(members)/_data/user-directory';
import {
  getThemeByUserProfile,
  toUserProfile,
} from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';
import { usePollResultsQuery } from '@/hooks/queries/usePollQuery';
import {
  useCastVoteMutation,
  useEditVoteMutation,
  useMyVoteQuery,
} from '@/hooks/queries/useVoteQuery';
import { useTheme } from '@/providers/theme-provider';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import Card from '@/components/common/card';
import Label from '@/components/common/card/label';
import Title from '@/components/common/card/title';

import { cn, formatDate } from '@/lib/utils';

import VoteSuccessModal from './_components/vote-success-modal';

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
        checked
          ? 'border-[color:var(--color-text-label-select)]'
          : 'border-[color:var(--color-text-label-not-select)]',
      )}
    >
      <span className="relative block size-3 shrink-0">
        {checked ? (
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-full',
              'bg-[color:var(--color-label)]',
            )}
          >
            <Image
              src="/icons/small_union.svg"
              alt="투표 선택됨"
              width={6}
              height={6}
              aria-hidden="true"
            />
          </span>
        ) : (
          <span
            className={cn(
              'absolute inset-0 rounded-full border',
              'border-[color:var(--color-text-label-not-select)]',
            )}
          />
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

type SubmitButtonState =
  | 'enabled'
  | 'soft-disabled'
  | 'unchanged-disabled'
  | 'done-disabled';

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

export default function Page() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const params = useParams<{ slug: string }>();
  const pollId = Number(params.slug);

  const { data: authUser, isLoading: isAuthLoading } = useCurrentUserQuery();
  const { data: pollResult, isLoading: isPollLoading } =
    usePollResultsQuery(pollId);
  const { data: myVote, isLoading: isMyVoteLoading } = useMyVoteQuery(pollId);
  const castVoteMutation = useCastVoteMutation(pollId);
  const editVoteMutation = useEditVoteMutation(pollId);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const [isSubmittedState, setIsSubmittedState] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const userProfile = useMemo(() => {
    return authUser ? toUserProfile(authUser) : null;
  }, [authUser]);

  useEffect(() => {
    if (userProfile) setTheme(getThemeByUserProfile(userProfile));
  }, [userProfile, setTheme]);

  const poll = pollResult?.poll;
  const isCurrentUserSubstitute = Boolean(
    authUser?.isSubstitute || authUser?.username.endsWith('_sub'),
  );
  const isSubmitting = castVoteMutation.isPending || editVoteMutation.isPending;
  const pollDescription = poll
    ? getOptionalPollText(poll, 'description')
    : undefined;
  const pollProposer = poll ? getOptionalPollText(poll, 'proposer') : undefined;

  const currentVote = myVote?.selected ?? null;
  const displayedSelection = selectedOption ?? currentVote;
  const hasExistingVote = currentVote !== null;
  const isUnchangedExistingSelection =
    hasExistingVote &&
    (selectedOption === null || selectedOption === currentVote);
  const hasChangedSelection =
    selectedOption !== null && selectedOption !== currentVote;
  const canSubmit =
    selectedOption !== null &&
    !isSubmittedState &&
    hasChangedSelection &&
    !isSubmitting;

  const submitButtonState: SubmitButtonState = isSubmittedState
    ? 'done-disabled'
    : canSubmit
      ? 'enabled'
      : isUnchangedExistingSelection
        ? 'unchanged-disabled'
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

  const handleSubmit = async () => {
    if (!canSubmit || selectedOption === null) return;

    setIsEditMode(hasExistingVote);
    setSubmitErrorMessage(null);

    try {
      if (hasExistingVote) {
        await editVoteMutation.mutateAsync(selectedOption);
      } else {
        await castVoteMutation.mutateAsync(selectedOption);
      }

      setIsSubmittedState(true);
      setShowSuccessModal(true);
    } catch (error) {
      const isSubstituteVoteError =
        error instanceof Error &&
        (error.message.includes('Counterpart account') ||
          error.message.toLowerCase().includes('poll is not available'));
      const message = isSubstituteVoteError
        ? isCurrentUserSubstitute
          ? '대표자 계정으로 투표 완료'
          : '대리인 계정으로 투표 완료'
        : error instanceof Error
          ? error.message
          : '투표 처리 중 문제가 발생했습니다';

      setSubmitErrorMessage(message);
      setShowSuccessModal(true);
    }
  };

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

  if (isAuthLoading || isPollLoading || isMyVoteLoading || !poll) {
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

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-4">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className={cn(
              'flex size-6 items-center justify-center',
              userProfile?.usesExecutiveTheme
                ? 'brightness-0 invert'
                : 'opacity-50',
            )}
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

              <div className="flex flex-col gap-2">
                <Label
                  name="마감 기한"
                  content={
                    poll.ended_at
                      ? `${formatDate(poll.ended_at)}에 종료`
                      : '미정'
                  }
                />
                <Label
                  name="발의자"
                  content={
                    pollProposer ??
                    getAdminPositionById(poll.created_by) ??
                    `사용자 #${poll.created_by}`
                  }
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

              <div className="flex flex-col gap-3">
                {poll.options.map((option) => (
                  <VoteOptionItem
                    key={option}
                    label={option}
                    checked={displayedSelection === option}
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
                  submitButtonState === 'unchanged-disabled' &&
                    'bg-[var(--voting-crimson-300)]',
                  submitButtonState === 'done-disabled' && 'bg-label-success',
                )}
              >
                <Sans.T160
                  as="span"
                  weight="semi-bold"
                  lineHeight="20px"
                  color="label"
                >
                  {isSubmitting ? '처리 중...' : submitButtonLabel}
                </Sans.T160>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {showSuccessModal ? (
        <VoteSuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            setSubmitErrorMessage(null);
          }}
          isEdit={isEditMode}
          variant={submitErrorMessage ? 'error' : 'success'}
          message={submitErrorMessage ?? undefined}
        />
      ) : null}
    </main>
  );
}
