import { Sans } from '@/app/ui/sans';
import { useStartPollMutation } from '@/hooks/queries/usePollQuery';
import type { UserProfile } from '@/types/user';

import HistoryCard from '@/components/common/history-card';
import PollCard from '@/components/common/poll-card';
import ScheduledCard from '@/components/common/scheduled-card';

import {
  getEligibleVoterCount,
  getPollDeadline,
  getResultText,
  getThemeByUserProfile,
  isPollStatus,
  sumVotes,
} from '../../../(members)/_utils/poll-display';
import ProfileHeader from '../../../(members)/board/_components/profile-header';
import type { MyPagePollRow, PollResultsById } from '../../../_types/my-page';

type Props = Readonly<{
  user: UserProfile;
  pollRows: MyPagePollRow[];
  resultsByPollId: PollResultsById;
  onBack: () => void;
  onPollAction: (pollId: number) => void;
}>;

export default function ManagerMyPage({
  user,
  pollRows,
  resultsByPollId,
  onBack,
  onPollAction,
}: Props) {
  const ongoingVotes = pollRows.filter(({ poll }) =>
    isPollStatus(poll, 'continuing'),
  );
  const completedVotes = pollRows.filter(({ poll }) =>
    isPollStatus(poll, 'completed'),
  );
  const scheduledVotes = pollRows.filter((v) => v.poll.status === 'pending');
  const displayedCompletedVotes = completedVotes;
  const eligibleVoterCount = getEligibleVoterCount();

  const startPollMutation = useStartPollMutation();

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
            ongoingVotes.map(({ poll }) => {
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
                  isAdmin
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

        {scheduledVotes.length > 0 && (
          <section className="flex flex-col gap-4">
            <Sans.T240
              as="h2"
              color="heading-page"
              weight="bold"
            >
              예정된 투표
            </Sans.T240>
            <div className="flex flex-col gap-4">
              {scheduledVotes.map((vote) => (
                <ScheduledCard
                  key={vote.poll.id}
                  title={vote.poll.question}
                  openingTime={vote.poll.ended_at || ''}
                  isAdmin={user.role === 'EXECUTIVE'}
                  isStarting={
                    startPollMutation.isPending &&
                    startPollMutation.variables === vote.poll.id
                  }
                  onStart={() => startPollMutation.mutate(vote.poll.id)}
                />
              ))}
            </div>
          </section>
        )}

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
            <div></div>
            {/* <Link href="/completed-votes">
              <Image
                src="/icons/arrow.svg"
                alt="more"
                width={32}
                height={32}
                className="cursor-pointer brightness-0 invert"
              />
            </Link> */}
          </div>
          {displayedCompletedVotes.length > 0 ? (
            displayedCompletedVotes.map(({ poll }) => {
              const results = resultsByPollId.get(poll.id);
              const voteCount = sumVotes(results);

              return (
                <HistoryCard
                  key={poll.id}
                  title={poll.question}
                  deadline={getPollDeadline(poll)}
                  myVote="-"
                  statistics={{
                    quota: eligibleVoterCount,
                    votes: voteCount,
                  }}
                  results={getResultText(results)}
                  badgeLabel="임원진"
                  hideMyVote
                  href={`/dashboard/poll/${poll.id}`}
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
          {/* {completedVotes.length >= 3 && (
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
          )} */}

          {/* {scheduledVotes.length > 0 && (
            <section className="flex flex-col gap-4">
              <Sans.T240
                as="h2"
                color="heading-page"
                weight="bold"
              >
                예정된 투표
              </Sans.T240>
              <div className="flex flex-col gap-4">
                {scheduledVotes.map((vote) => (
                  <ScheduledCard
                    key={vote.poll.id}
                    title={vote.poll.question}
                    openingTime={vote.poll.ended_at || ''}
                    isAdmin={user.role === 'EXECUTIVE'}
                    isStarting={
                      startPollMutation.isPending &&
                      startPollMutation.variables === vote.poll.id
                    }
                    onStart={() => startPollMutation.mutate(vote.poll.id)}
                  />
                ))}
              </div>
            </section>
          )} */}
        </section>
      </main>
    </div>
  );
}
