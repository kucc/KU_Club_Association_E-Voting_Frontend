'use client';

import { useMyPageData } from '@/app/_hooks/use-my-page-data';
import { Sans } from '@/app/ui/sans';

import { useRouter } from 'next/navigation';

import ManagerMyPage from './_components/manager-my-page';

export default function Page() {
  const router = useRouter();
  const { error, isError, isLoading, pollRows, resultsByPollId, user } =
    useMyPageData();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Sans.T240
          as="p"
          color="heading-page"
        >
          로딩 중...
        </Sans.T240>
      </div>
    );
  }

  if (isError) {
    return (
      <Sans.T240 as="p">
        {error instanceof Error
          ? error.message
          : '사용자 정보를 불러오는 중 문제가 발생했습니다.'}
      </Sans.T240>
    );
  }

  return (
    <ManagerMyPage
      user={user}
      pollRows={pollRows}
      resultsByPollId={resultsByPollId}
      onBack={() => router.push('/')}
      onPollAction={(pollId) => router.push(`/dashboard/poll/${pollId}`)}
    />
  );
}
