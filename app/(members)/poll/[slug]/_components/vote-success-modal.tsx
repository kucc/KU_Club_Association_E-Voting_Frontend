'use client';

import { Sans } from '@/app/ui/sans';

import { useEffect } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

type Props = Readonly<{
  onClose: () => void;
  isEdit?: boolean;
  variant?: 'success' | 'error';
  message?: string;
}>;

export default function VoteSuccessModal({
  onClose,
  isEdit = false,
  variant = 'success',
  message,
}: Props) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onClose]);

  const isError = variant === 'error';
  const label = message ?? (isEdit ? '수정 완료!' : '투표 완료!');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className={cn(
          'flex items-center justify-center bg-background-popup shadow-[0px_12px_74px_rgba(0,0,0,0.22)]',
          isError
            ? 'h-[132px] w-[300px] rounded-[32px] px-6'
            : 'size-[173px] rounded-[40px]',
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Image
            src={isError ? '/icons/x.svg' : '/icons/union.svg'}
            alt={isError ? '투표 불가 안내 아이콘' : '투표 완료 체크 아이콘'}
            width={46}
            height={44}
            priority
          />

          <Sans.T200
            as="p"
            weight="bold"
            lineHeight="24px"
            color="title-card"
            className="text-center"
          >
            {label}
          </Sans.T200>
        </div>
      </div>
    </div>
  );
}
