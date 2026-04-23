'use client';

import { Sans } from '@/app/ui/sans';

import { useEffect } from 'react';

import Image from 'next/image';

type Props = Readonly<{
  onClose: () => void;
}>;

export default function VoteSuccessModal({ onClose }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="투표 완료"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
    >
      <div className="flex size-[173px] items-center justify-center rounded-[40px] bg-background-popup shadow-[0px_12px_74px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/icons/check_vote.svg"
            alt="투표 완료 체크 아이콘"
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
            투표 완료!
          </Sans.T200>
        </div>
      </div>
    </div>
  );
}
