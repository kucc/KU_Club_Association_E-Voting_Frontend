'use client';

import { Sans } from '@/app/ui/sans';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export default function AdminPollCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const MAX_LENGTH = 500;

  return (
    <main className="theme-executive flex min-h-screen justify-center bg-[#303030] font-['Pretendard']">
      <div className="relative flex min-h-screen w-full max-w-[402px] flex-col">
        {/* --- 헤더 영역 --- */}
        <header className="flex shrink-0 items-center gap-[16px] px-[20px] pt-[62px] pb-[10px]">
          <button
            onClick={() => router.back()}
            className="flex size-6 items-center justify-center opacity-50 brightness-0 invert transition-transform active:scale-95"
          >
            <Image
              src="/icons/back.svg"
              alt="back"
              width={24}
              height={24}
            />
          </button>
          <Sans.T200
            as="h1"
            weight="semi-bold"
            color="heading-page"
          >
            투표 작성하기
          </Sans.T200>
        </header>

        <div className="scrollbar-hide flex flex-1 flex-col gap-[24px] overflow-y-auto px-[20px] py-[24px]">
          {/* 상단: 입력 영역 */}
          <div className="flex shrink-0 flex-col gap-[24px]">
            <input
              type="text"
              placeholder="투표 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-none bg-transparent text-[20px] leading-[24px] font-bold text-[#FFFFFF] outline-none placeholder:text-[#848485]"
            />

            <textarea
              placeholder="투표 설명을 작성하세요 (최대 500자)"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, MAX_LENGTH))
              }
              className="h-[200px] w-full resize-none border-none bg-transparent text-[14px] leading-[20px] font-normal text-[#FFFFFF] outline-none placeholder:text-[#52514E]"
            />
          </div>

          {/* 하단: 카운터 + 참고사항 영역 */}
          <div className="mt-auto flex flex-col gap-[24px] pb-[120px]">
            {/* 글자 수 카운터 */}
            <div className="flex h-[17px] w-full items-center justify-end">
              <span
                className={cn(
                  'text-[14px] leading-[17px] font-medium transition-colors',
                  description.length >= MAX_LENGTH
                    ? 'text-[#A0191E]'
                    : 'text-[#D2D8DB]',
                )}
              >
                {description.length}
              </span>
              <span className="text-[14px] leading-[17px] font-medium text-[#848485]">
                / {MAX_LENGTH}
              </span>
            </div>

            {/* 참고사항 박스 */}
            <div className="box-border flex min-h-[122px] w-full flex-col items-start justify-center gap-[10px] rounded-[16px] bg-[#52514E] p-[16px]">
              <p className="m-0 text-[14px] leading-[20px] font-medium text-[#D2D8DB]">
                투표 작성 전 주의사항
              </p>
              <p className="m-0 text-[14px] leading-[20px] font-medium whitespace-pre-line text-[#A9ABAD]">
                어쩌고저쩌고한 글은 안 됩니다 <br />
                어쩌고저쩌고 하게 쓰게요 <br /> 뭐뭐뭐에 위반되는 건
                어쩌고저쩌고 <br /> 윤리 뭐시기
              </p>
            </div>
          </div>
        </div>

        {/* --- 하단 고정 버튼 영역 (absolute로 띄워서 스크롤과 독립적으로 배치) --- */}
        <div className="absolute bottom-0 left-0 box-border flex w-full gap-[8px] bg-gradient-to-t from-[#303030] via-[#303030] to-transparent px-[20px] pt-[20px] pb-[40px]">
          <button
            type="button"
            className="flex h-[46px] w-[87px] items-center justify-center rounded-[8px] bg-[#848485] text-[16px] font-semibold text-[#FFFFFF] transition-transform active:scale-95"
          >
            임시저장
          </button>
          <button
            type="button"
            disabled={!title || !description}
            className="flex h-[46px] flex-1 items-center justify-center rounded-[8px] bg-[#A0191E] text-[16px] font-semibold text-[#FFFFFF] transition-transform active:scale-95 disabled:opacity-30"
          >
            작성 완료
          </button>
        </div>
      </div>
    </main>
  );
}
