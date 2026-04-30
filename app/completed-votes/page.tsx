'use client';

import {
  getThemeByUserProfile,
  toUserProfile,
} from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import { useCurrentUserQuery } from '@/hooks/queries/useAuthQuery';

import { useMemo } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CompletedVotesPage() {
  const router = useRouter();
  const { data: authUser } = useCurrentUserQuery();

  const userProfile = useMemo(() => {
    return authUser ? toUserProfile(authUser) : null;
  }, [authUser]);

  const themeClass = userProfile ? getThemeByUserProfile(userProfile) : '';
  const shouldInvertIcon = themeClass === 'theme-executive';

  return (
    <main
      className={`${themeClass} relative min-h-screen bg-background pb-20 font-['Pretendard'] before:fixed before:inset-0 before:-z-10 before:bg-background`}
    >
      <div className="pt-15.5">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            aria-label="이전 화면으로 이동"
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center"
          >
            <Image
              src="/icons/back.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              className={shouldInvertIcon ? 'brightness-0 invert' : undefined}
            />
          </button>
          <Sans.T200
            as="h1"
            weight="semi-bold"
            color="heading-page"
          >
            완료된 투표
          </Sans.T200>
        </header>

        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 text-center">
          <Sans.T200
            as="p"
            weight="semi-bold"
            color="heading-page"
            lineHeight="28px"
          >
            완료된 투표 목록을 준비 중입니다.
          </Sans.T200>
          <Sans.T140
            as="p"
            color="title-subvalue"
            lineHeight="20px"
          >
            지금은 마이페이지의 완료된 투표 카드에서 결과를 확인해주세요.
          </Sans.T140>
        </section>
      </div>
    </main>
  );
}
