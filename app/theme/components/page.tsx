import { Sans } from '@/app/ui/sans';

import HistoryCard from '@/components/common/history-card';
import PollCard from '@/components/common/poll-card';
import ScheduledCard from '@/components/common/scheduled-card';

import { ThemeSwitcher } from '../theme-preview';

export default function Page() {
  return (
    <div className="px-16 py-10">
      <Sans.T400
        as="h1"
        color="title-card"
      >
        COMPONENTS
      </Sans.T400>

      <ThemeSwitcher />

      <div className="mt-8">
        <Sans.T240
          as="h2"
          color="title-card"
        >
          지금 진행 중인 투표
        </Sans.T240>
      </div>
      <div className="mt-2 flex flex-col gap-4">
        <PollCard
          title="제1회 동아리연합회장 선거"
          deadline="2023-12-31T23:59:59Z"
          statistics={{
            quota: 60,
            votes: 40,
          }}
        />
        <PollCard
          title="제1회 동아리연합회장 선거"
          deadline="2023-12-31T23:59:59Z"
          statistics={{
            quota: 60,
            votes: 40,
          }}
          myVote="찬성"
        />
        <PollCard
          title="제1회 동아리연합회장 선거"
          deadline="2023-12-31T23:59:59Z"
          statistics={{
            quota: 60,
            votes: 40,
          }}
          myVote="찬성"
          isAdmin={true}
        />
      </div>

      <div className="mt-8">
        <Sans.T240
          as="h2"
          color="title-card"
        >
          완료된 투표(투표 기록)
        </Sans.T240>
      </div>
      <div className="mt-2 flex flex-col gap-4">
        <HistoryCard
          title="제1회 동아리연합회장 선거"
          deadline="2023-12-31T23:59:59Z"
          statistics={{
            quota: 60,
            votes: 40,
          }}
          myVote="찬성"
          results="부결(45%)"
        />
        <HistoryCard
          title="제1회 동아리연합회장 선거"
          deadline="2023-12-31T23:59:59Z"
          statistics={{
            quota: 60,
            votes: 40,
          }}
          myVote="찬성"
          results="부결(45%)"
          isAgent
        />
      </div>

      <div className="mt-8">
        <Sans.T240
          as="h2"
          color="title-card"
        >
          예정된 투표
        </Sans.T240>
      </div>
      <div className="mt-2 flex flex-col gap-4">
        <ScheduledCard
          title="제1회 동아리연합회장 선거"
          openingTime="2023-12-31T23:59:59Z"
        />
      </div>
    </div>
  );
}
