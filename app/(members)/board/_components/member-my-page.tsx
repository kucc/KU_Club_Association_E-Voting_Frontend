'use client';

import { Sans } from '@/app/ui/sans';
import type { UserProfile } from '@/types/user';

import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/common/button';
import HistoryCard from '@/components/common/history-card';
import PollCard from '@/components/common/poll-card';

import type { MyPagePollRow, PollResultsById } from '../../../_types/my-page';
import {
  getEligibleVoterCount,
  getPollDeadline,
  getResultText,
  getThemeByUserProfile,
  isPollStatus,
  sumVotes,
} from '../../_utils/poll-display';
import ProfileHeader from './profile-header';

type Props = Readonly<{
  user: UserProfile;
  pollRows: MyPagePollRow[];
  resultsByPollId: PollResultsById;
  onBack: () => void;
  onPollAction: (pollId: number) => void;
}>;

export default function MemberMyPage({
  user,
  pollRows,
  resultsByPollId,
  onBack,
  onPollAction,
}: Props) {
  const ongoingVotes = pollRows.filter(({ poll }) =>
    isPollStatus(poll, 'continuing'),
  );
  // TODO: 대표자 화면에 대리인 투표까지 합치려면 백엔드에서
  // original_user_id 기준 대리인 vote 조회 API를 제공해야 함.
  const completedVotes = pollRows.filter(
    ({ poll, myVote }) => isPollStatus(poll, 'completed') && myVote !== null,
  );
  const displayedCompletedVotes = completedVotes.slice(0, 3);
  const eligibleVoterCount = getEligibleVoterCount();

  return (
    <div
      className={`${getThemeByUserProfile(user)} min-h-screen w-full bg-background`}
    >
      <ProfileHeader
        user={user}
        onBack={onBack}
      />

      <main className="flex w-full flex-col gap-10 px-5 py-6">
        <section className="flex flex-col gap-4">
          <div className="flex h-10 items-center">
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="leading-[140%] font-semibold tracking-[-0.02em]">
                지금 진행 중인 투표
              </span>
            </Sans.T240>
          </div>
          {ongoingVotes.length > 0 ? (
            ongoingVotes.map(({ poll, myVote }) => {
              const results = resultsByPollId.get(poll.id);
              const voteCount = sumVotes(results);

              return (
                <PollCard
                  key={poll.id}
                  title={poll.question}
                  deadline={getPollDeadline(poll)}
                  statistics={{
                    quota: eligibleVoterCount,
                    votes: voteCount,
                  }}
                  myVote={myVote?.selected}
                  onAction={() => onPollAction(poll.id)}
                />
              );
            })
          ) : (
            <Sans.T160
              as="p"
              color="title-subvalue"
            >
              진행 중인 내 투표가 없습니다.
            </Sans.T160>
          )}
        </section>
        <section className="flex flex-col gap-4 pb-10">
          <div className="flex h-10 items-center justify-between">
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
                className={
                  user.usesExecutiveTheme
                    ? 'cursor-pointer brightness-0 invert'
                    : 'cursor-pointer'
                }
              />
            </Link>
          </div>
          {displayedCompletedVotes.length > 0 ? (
            displayedCompletedVotes.map(({ poll, myVote }) => {
              const results = resultsByPollId.get(poll.id);
              const voteCount = sumVotes(results);

              return (
                <HistoryCard
                  key={poll.id}
                  title={poll.question}
                  deadline={getPollDeadline(poll)}
                  myVote={myVote?.selected ?? '-'}
                  statistics={{
                    quota: eligibleVoterCount,
                    votes: voteCount,
                  }}
                  results={getResultText(results)}
                  isAgent={user.role === 'AGENT'}
                  badgeLabel={user.showsExecutiveBadge ? '임원진' : undefined}
                  href={`/poll/${poll.id}/result`}
                />
              );
            })
          ) : (
            <Sans.T160
              as="p"
              color="title-subvalue"
            >
              완료된 내 투표가 없습니다.
            </Sans.T160>
          )}
          {completedVotes.length >= 3 && (
            <Link
              href="/completed-votes"
              className="w-full"
            >
              <div className="mt-1 flex flex-col">
                <Button
                  content="완료된 투표 더보기"
                  size="medium"
                />
              </div>
            </Link>
          )}
        </section>
      </main>
    </div>
  );
}
