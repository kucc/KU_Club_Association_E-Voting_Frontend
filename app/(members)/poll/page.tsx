'use client';

import { CompletedPollItem, createMockCompletedPolls } from '@/app/lib/mocks';
import { Sans } from '@/app/ui/sans';
import { ArrowLeft, Mic, Search } from 'lucide-react';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import HistoryCard from '@/components/common/history-card';

import SemesterTabs from './components/SemesterTabs';

export default function Page() {
  const router = useRouter();

  const [polls, setPolls] = useState<CompletedPollItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    createMockCompletedPolls().then((data) => {
      setPolls(data);
      if (data.length > 0) {
        setSelectedSemester(data[0].semester);
      }
    });
  }, []);

  if (!polls) {
    return <Sans.T140 as="p">로딩중...</Sans.T140>;
  }

  const semesters = [...new Set(polls.map((p) => p.semester))];

  const filteredPolls = polls.filter(
    (poll) =>
      poll.semester === selectedSemester && poll.title.includes(searchQuery),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="-ml-1 p-1"
          aria-label="뒤로가기"
        >
          <ArrowLeft
            size={24}
            className="text-text-heading-page"
          />
        </button>
        <Sans.T200
          as="h1"
          weight="bold"
          lineHeight="28px"
          color="heading-page"
        >
          완료된 투표
        </Sans.T200>
      </header>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-xl bg-background-search px-4 py-2.5">
          <Search
            size={18}
            className="shrink-0 text-text-input-placeholder"
          />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-text-input-value outline-none placeholder:text-text-input-placeholder"
          />
          <Mic
            size={18}
            className="shrink-0 text-text-input-placeholder"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <SemesterTabs
          semesters={semesters}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
      </div>

      <main className="flex flex-col gap-3 px-4 pb-8">
        {filteredPolls.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Sans.T140
              as="p"
              color="title-label"
            >
              표시할 투표가 없습니다.
            </Sans.T140>
          </div>
        ) : (
          filteredPolls.map((poll) => (
            <HistoryCard
              key={poll.id}
              title={poll.title}
              deadline={poll.deadline}
              myVote={poll.myVote}
              statistics={{
                votes: poll.attendanceCount!,
                quota: poll.attendanceTotal!,
              }}
              results={`${poll.resultStatus} (${poll.resultRate}%)`}
              isAgent={poll.isAgentVote}
            />
          ))
        )}
      </main>
    </div>
  );
}
