'use client';

import {
  getThemeByUserProfile,
  toUserProfile,
} from '@/app/(members)/_utils/poll-display';
import { Sans } from '@/app/ui/sans';
import { useSignInMutation } from '@/hooks/queries/useAuthQuery';
import { useTheme } from '@/providers/theme-provider';
import { User } from '@/types/user';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/common/button';

import Input from './_components/input';

export default function Page() {
  const router = useRouter();
  const { mutate, isPending, error } = useSignInMutation();
  const [canSubmit, setCanSubmit] = useState(false);

  const { setTheme } = useTheme();

  const onSuccess = (user: User) => {
    setTheme(getThemeByUserProfile(toUserProfile(user)));
    router.push('/');
  };

  return (
    <div className="w-full pt-15.5">
      <div className="flex h-11 items-center gap-4 pl-5">
        <Link href="/">
          <Image
            src="/icons/back.svg"
            width={24}
            height={24}
            alt="back"
          />
        </Link>
        <Sans.T200
          as="h1"
          weight="semi-bold"
          lineHeight="140%"
          letterSpacing="-2%"
        >
          로그인
        </Sans.T200>
      </div>

      <form
        className="flex flex-col gap-8 px-5 pt-10"
        onChange={(e) => {
          const data = new FormData(e.currentTarget);
          setCanSubmit(
            !!data.get('username')?.toString().trim() &&
              !!data.get('password')?.toString().trim(),
          );
        }}
        action={(formData) => {
          mutate(
            {
              username: formData.get('username') as string,
              password: formData.get('password') as string,
            },
            { onSuccess },
          );
        }}
      >
        <Input
          placeholder="아이디를 입력해주세요."
          title="아이디"
          name="username"
        />
        <Input
          placeholder="비밀번호를 입력해주세요."
          title="비밀번호"
          name="password"
        />

        <div className="flex w-full flex-col gap-2">
          {error && (
            <Sans.T160
              as="p"
              color="label-home"
            >
              아이디 또는 비밀번호가 잘못 되었습니다
            </Sans.T160>
          )}
          <Button
            content="로그인하기"
            disabled={!canSubmit || isPending}
            submit
          />
        </div>
      </form>
      {/* <div className="w-full">
        <Card>
          <form
            className="flex w-full flex-col gap-5"
            action={(formData) => {
              mutate(
                {
                  username: formData.get('username') as string,
                  password: formData.get('password') as string,
                },
                { onSuccess },
              );
            }}
          >
            <Sans.T240
              as="h1"
              color="heading-section"
              weight="bold"
            >
              로그인
            </Sans.T240>

            <div className="flex flex-col gap-4">
              <Input
                placeholder="아이디를 입력해주세요"
                title="아이디"
                name="username"
              />
              <Input
                placeholder="비밀번호를 입력해주세요"
                title="비밀번호"
                name="password"
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              {error && (
                <Sans.T160
                  as="p"
                  color="label-home"
                >
                  아이디 또는 비밀번호가 잘못 되었습니다
                </Sans.T160>
              )}
              <Button
                content="로그인하기"
                disabled={isPending}
              />
            </div>
          </form>
        </Card>
      </div> */}
    </div>
  );
}
