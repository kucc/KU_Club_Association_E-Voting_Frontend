'use client';

import { Sans } from '@/app/ui/sans';
import { useSignOutMutation } from '@/hooks/queries/useAuthQuery';
import { useTheme } from '@/providers/theme-provider';
import type { UserProfile } from '@/types/user';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/button';

type Props = Readonly<{
  user: UserProfile;
  onBack: () => void;
}>;

export default function ProfileHeader({ user }: Props) {
  const { mutate: _signOut } = useSignOutMutation();
  const { setTheme } = useTheme();

  const router = useRouter();

  const signOut = () => {
    setTheme('theme-default');
    _signOut();
    router.push('/signin');
  };

  return (
    <header
      className="relative h-[380px] w-full rounded-b-[20px] bg-profile shadow-[0_0_60px_rgba(0,0,0,0.04)]"
      style={{
        height: user.role === 'EXECUTIVE' ? '380px' : '320px',
      }}
    >
      <div className="absolute top-15.5 flex h-11 w-full items-center gap-3 px-5">
        <div className="flex h-7 w-full items-center justify-between gap-4">
          {/* <button
            type="button"
            aria-label="홈으로 이동"
            onClick={onBack}
            className="flex size-6 cursor-pointer items-center justify-center"
          >
            <Image
              src="/icons/back.svg"
              alt="back"
              width={24}
              height={24}
              className={
                user.usesExecutiveTheme || user.role === 'REPRESENTATIVE'
                  ? 'brightness-0 invert'
                  : 'opacity-100'
              }
            />
          </button> */}
          <Sans.T200
            as="h2"
            color="profile-name"
          >
            <span className="leading-[140%] font-semibold tracking-[-0.02em]">
              내 투표
            </span>
          </Sans.T200>
          <div
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            <Sans.T160
              as="h2"
              color="profile-name"
            >
              로그아웃
            </Sans.T160>
          </div>
        </div>
      </div>
      <div className="absolute top-[134px] right-5 left-5 flex flex-col gap-4">
        <div className="flex h-13 w-full items-center gap-4 px-2">
          <div className="flex flex-grow flex-col gap-2">
            <div className="flex items-center justify-between">
              <Sans.T240
                as="h1"
                weight="bold"
                color="profile-name"
                className="leading-[29px]"
              >
                {user.name}
              </Sans.T240>

              {(user.role === 'AGENT' || user.showsExecutiveBadge) && (
                <div className="flex items-center justify-center rounded bg-badge px-1.5 py-0.5">
                  <Sans.T120
                    as="span"
                    weight="medium"
                    color="badge"
                    lineHeight="17px"
                    letterSpacing="-0.1px"
                  >
                    {user.showsExecutiveBadge ? '임원진' : '대리인'}
                  </Sans.T120>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Sans.T160
                as="span"
                color="profile-support"
                className="font-medium"
              >
                {user.club}
              </Sans.T160>
              <Sans.T160
                as="span"
                color="profile-support"
                className="font-medium"
              >
                ·
              </Sans.T160>
              <Sans.T160
                as="span"
                color="profile-support"
                className="font-medium"
              >
                {user.position}
              </Sans.T160>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-5 rounded-[16px] bg-background-profile-section p-6">
          <div className="flex flex-col gap-3">
            <ProfileRow
              label="분과"
              value={user.department}
            />
            <ProfileRow
              label={user.showsExecutiveBadge ? '권한' : '소속'}
              value={user.studentId}
            />
            {/* <ProfileRow
              label="재휴학"
              value={user.status}
            /> */}
          </div>
        </div>
        {user.role === 'EXECUTIVE' && (
          <Link
            href="/dashboard/poll/create"
            className="mt-2 block w-full"
          >
            <Button content="투표 만들기" />
          </Link>
        )}
      </div>
    </header>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-13.75">
        <Sans.T140
          as="p"
          weight="medium"
          lineHeight="17px"
          color="profile-label"
        >
          {label}
        </Sans.T140>
      </span>
      <Sans.T140
        as="p"
        weight="medium"
        lineHeight="17px"
        color="profile-value"
      >
        {value}
      </Sans.T140>
    </div>
  );
}
