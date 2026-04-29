'use client';

import { Sans } from '@/app/ui/sans';
import { usePollResultsQuery } from '@/hooks/queries/usePollQuery';
import { editPoll } from '@/services/polls';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { use, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminPollEditPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. 기존 데이터 불러오기
  const { data, isPending: isFetchPending } = usePollResultsQuery(
    Number(params.id),
  );

  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endedAt, setEndedAt] = useState('');

  // 2. 데이터 로드 시 상태값 채워넣기 (Plan B 파싱 포함)
  useEffect(() => {
    if (data?.poll) {
      const fullQuestion = data.poll.question;
      const parts = fullQuestion.split('\n\n');

      /* eslint-disable react-hooks/set-state-in-effect */
      setQuestion(parts[0]);
      setDescription(parts[1] || '');

      if (data.poll.ended_at) {
        // datetime-local input 형식에 맞게 변환 (YYYY-MM-DDTHH:mm)
        setEndedAt(new Date(data.poll.ended_at).toISOString().slice(0, 16));
      }
    }
  }, [data]);

  // 3. 수정 Mutation 설정
  const { mutateAsync: updatePoll, isPending: isUpdatePending } = useMutation({
    mutationFn: (updates: { question: string; options?: string[] }) =>
      editPoll(Number(params.id), updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['polls', Number(params.id)] });
      alert('투표가 수정되었습니다.');
      router.push(`/dashboard/poll/${params.id}`);
    },
    onError: (error) => {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    },
  });

  const handleEdit = async () => {
    if (!question) {
      alert('제목을 입력해주세요!');
      return;
    }

    try {
      await updatePoll({
        // 설명이 있다면 다시 제목에 합쳐서 전송 (Plan B 유지)
        question: description ? `${question}\n\n${description}` : question,
        // 현재 API 명세상 옵션 수정이 필요 없다면 기존 값 유지 (생략 가능)
        options: data?.poll.options,
      });
    } catch {
      // 에러 처리는 Mutation의 onError에서 수행
    }
  };

  if (isFetchPending)
    return (
      <div className="p-10 text-center text-white">데이터를 가져오는 중...</div>
    );

  return (
    <main className="theme-executive flex min-h-screen justify-center bg-[#303030] font-['Pretendard'] text-white">
      <div className="relative flex w-full max-w-[402px] flex-col px-[20px]">
        <header className="flex h-[106px] items-center gap-[16px] pt-[62px]">
          <button
            onClick={() => router.back()}
            className="opacity-50 brightness-0 invert"
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
          >
            투표 수정하기
          </Sans.T200>
        </header>

        <div className="flex flex-1 flex-col gap-[32px] pt-[24px]">
          <input
            type="text"
            placeholder="투표 제목을 입력해주세요"
            className="bg-transparent text-[20px] font-bold outline-none placeholder:text-[#848485]"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            placeholder="투표 설명을 작성하세요 (선택 사항)"
            className="h-[200px] resize-none bg-transparent text-[14px] outline-none placeholder:text-[#52514E]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col gap-3">
            <Sans.T140
              as="p"
              color="profile-label"
            >
              종료 기한 설정
            </Sans.T140>
            <input
              type="datetime-local"
              className="h-11 w-full rounded-lg bg-[#52514E] px-4 text-[14px] [color-scheme:dark] opacity-50 outline-none"
              value={endedAt}
              readOnly // 현재 시스템상 마감 기한 수정은 지원되지 않으므로 읽기 전용으로 설정
            />
            <p className="text-[12px] text-[#848485]">
              ※ 현재 시스템상 마감 기한 수정은 지원되지 않습니다.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 flex w-full gap-[8px] p-[20px] pb-[40px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-[46px] w-[87px] rounded-lg bg-[#848485] font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleEdit}
            disabled={isUpdatePending}
            className="h-[46px] flex-1 rounded-lg bg-[#A0191E] font-semibold disabled:opacity-30"
          >
            {isUpdatePending ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </main>
  );
}
