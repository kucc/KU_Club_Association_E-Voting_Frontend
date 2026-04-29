'use client';

import { Sans } from '@/app/ui/sans';
import { useSignInMutation } from '@/hooks/queries/useAuthQuery';
import { useTheme } from '@/providers/theme-provider';
import { User } from '@/types/user';

import { useRouter } from 'next/navigation';

import Button from '@/components/common/button';
import Card from '@/components/common/card';

import Input from './_components/input';

export default function Page() {
  const router = useRouter();
  const { mutate, isPending, error } = useSignInMutation();

  const { setTheme } = useTheme();

  const onSuccess = (user: User) => {
    if (user.isAdmin) {
      setTheme('theme-executive');
    }

    if (user.isSubstitute) {
      setTheme('theme-agent');
    }

    router.push('/');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-5">
      <div className="w-full">
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
      </div>
    </div>
  );
}
