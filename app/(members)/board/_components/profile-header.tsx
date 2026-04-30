import { Sans } from '@/app/ui/sans';
import type { UserProfile } from '@/types/user';

import Image from 'next/image';

type Props = Readonly<{
  user: UserProfile;
  onBack: () => void;
}>;

export default function ProfileHeader({ user, onBack }: Props) {
  return (
    <header className="relative h-[320px] w-full rounded-b-[20px] bg-profile shadow-[0_0_60px_rgba(0,0,0,0.04)]">
      <div className="absolute top-15.5 flex h-11 w-full items-center gap-3 px-5">
        <div className="flex h-7 items-center gap-4">
          <button
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
          </button>
          <Sans.T200
            as="h2"
            color="profile-name"
          >
            <span className="leading-[140%] font-semibold tracking-[-0.02em]">
              내 투표
            </span>
          </Sans.T200>
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
