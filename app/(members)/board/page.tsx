'use client';

import { useMyPageData } from '@/app/_hooks/use-my-page-data';
import { Sans } from '@/app/ui/sans';

import { useRouter } from 'next/navigation';

import ManagerMyPage from '../../(managers)/dashboard/_components/manager-my-page';
import MemberMyPage from './_components/member-my-page';

export default function Home() {
  const router = useRouter();
  const {
    authUser,
    error,
    isError,
    isLoading,
    isManagementAdmin,
    pollRows,
    resultsByPollId,
    user,
  } = useMyPageData();

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

  if (isError || !authUser) {
    return (
      <Sans.T240 as="p">
        {error instanceof Error
          ? error.message
          : '사용자 정보를 불러오는 중 문제가 발생했습니다.'}
      </Sans.T240>
    );
  }

  const handleBack = () => {
    router.push('/');
  };

  const handlePollAction = (pollId: number) => {
    if (isManagementAdmin) {
      router.push(`/dashboard/poll/${pollId}`);
      return;
    }

    router.push(`/poll/${pollId}`);
  };

  if (isManagementAdmin) {
    return (
      <ManagerMyPage
        user={user}
        pollRows={pollRows}
        resultsByPollId={resultsByPollId}
        onBack={handleBack}
        onPollAction={handlePollAction}
      />
    );
  }

  return (
    <MemberMyPage
      user={user}
      pollRows={pollRows}
      resultsByPollId={resultsByPollId}
      onBack={handleBack}
      onPollAction={handlePollAction}
    />
  );
}
