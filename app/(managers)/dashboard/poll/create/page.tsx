'use client';

import { Sans } from '@/app/ui/sans';
import { useCreatePollMutation } from '@/hooks/queries/usePollQuery';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export default function AdminPollCreatePage() {
  const router = useRouter();

  const { mutateAsync: createPoll, isPending } = useCreatePollMutation();

  // [상태] 입력값 관리

  const [question, setQuestion] = useState('');

  const [description, setDescription] = useState('');

  const [endedAt, setEndedAt] = useState('');

  const MAX_LENGTH = 500;

  const handleCreate = async () => {
    if (!question || !description || !endedAt) {
      alert('모든 항목을 입력해주세요!');

      return;
    }

    try {
      await createPoll({
        question, // 제목

        options: ['찬성', '반대'], // 우선 기본값 (나중에 UI 추가 가능)

        sort_order: 1, // 정렬 순서

        ended_at: new Date(endedAt).toISOString(),
      });

      alert('투표가 성공적으로 생성되었습니다! 목록 페이지로 이동합니다.');

      router.push('/dashboard'); // 성공 시 목록 페이지로 이동
    } catch (error) {
      console.error('생성 실패:', error);

      alert('투표 생성에 실패했습니다. 권한이나 서버 상태를 확인해주세요.');
    }
  };

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

        {/* --- 스크롤 가능한 메인 영역 --- */}

        <div className="scrollbar-hide flex flex-1 flex-col gap-[32px] overflow-y-auto px-[20px] py-[24px]">
          {/* 1. 제목 및 설명 입력 (정석 키값: question) */}

          <div className="flex shrink-0 flex-col gap-[24px]">
            <input
              type="text"
              placeholder="투표 제목을 입력해주세요"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border-none bg-transparent text-[20px] leading-[24px] font-bold text-[#FFFFFF] outline-none placeholder:text-[#848485]"
            />

            <div className="flex flex-col gap-2">
              <textarea
                placeholder="투표 설명을 작성하세요 (최대 500자)
                ※ 현재 설명 저장은 지원되지 않습니다."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, MAX_LENGTH))
                }
                className="h-[250px] w-full resize-none border-none bg-transparent text-[14px] leading-[20px] font-normal text-[#FFFFFF] outline-none placeholder:text-[#52514E]"
              />

              {/* 실시간 카운터 */}

              <div className="flex h-[17px] w-full items-center justify-end gap-[2px]">
                <span
                  className={cn(
                    'text-[12px] leading-[17px] font-medium transition-colors',

                    description.length >= MAX_LENGTH
                      ? 'text-[#A0191E]'
                      : 'text-[#D2D8DB]',
                  )}
                >
                  {description.length}
                </span>

                <span className="text-[12px] leading-[17px] font-medium text-[#848485]">
                  / {MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* 2. 종료 기한 설정 */}

          <div className="flex shrink-0 flex-col gap-3">
            <Sans.T140
              as="p"
              color="profile-label"
            >
              종료 기한 설정
            </Sans.T140>

            <input
              type="datetime-local"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-transparent bg-[#52514E] px-4 text-[14px] text-white [color-scheme:dark] transition-all outline-none focus:border-[#A0191E]"
            />
          </div>

          {/* 3. 하단 주의사항 */}

          <div className="flex flex-col gap-[24px] pb-[120px]">
            <div className="box-border flex min-h-[122px] w-full flex-col items-start justify-center gap-[10px] rounded-[16px] bg-[#52514E] p-[16px]">
              <p className="m-0 text-[14px] leading-[20px] font-medium text-[#D2D8DB]">
                투표 작성 전 주의사항
              </p>

              <p className="m-0 text-[14px] leading-[20px] font-medium whitespace-pre-line text-[#A9ABAD]">
                공정한 투표 문화를 위해 내용을 신중히 작성해주세요. <br />
                부적절한 내용 포함 시 관리자에 의해 삭제될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* --- 하단 고정 버튼 영역 --- */}

        <div className="absolute bottom-0 left-0 box-border flex w-full gap-[8px] bg-gradient-to-t from-[#303030] via-[#303030] to-transparent px-[20px] pt-[20px] pb-[40px]">
          <button
            type="button"
            className="flex h-[46px] w-[87px] items-center justify-center rounded-[8px] bg-[#848485] text-[16px] font-semibold text-[#FFFFFF] transition-transform active:scale-95"
          >
            임시저장
          </button>

          <button
            type="button"
            disabled={!question || !description || !endedAt || isPending}
            onClick={handleCreate}
            className="flex h-[46px] flex-1 items-center justify-center rounded-[8px] bg-[#A0191E] text-[16px] font-semibold text-[#FFFFFF] transition-transform active:scale-95 disabled:opacity-30"
          >
            {isPending ? '처리 중...' : '작성 완료'}
          </button>
        </div>
      </div>
    </main>
  );
}
