'use client';

import { Sans } from '@/app/ui/sans';
import { usePollResultsQuery } from '@/hooks/queries/usePollQuery';
import { editPoll } from '@/services/polls';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { use, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

const MAX_DESCRIPTION_LENGTH = 500;

const getPollDescription = (poll: {
  descriptions?: string | null;
  description?: string | null;
}) => {
  return poll.descriptions ?? poll.description ?? '';
};

const splitPollText = (poll: {
  question: string;
  descriptions?: string | null;
  description?: string | null;
}) => {
  const apiDescription = getPollDescription(poll).trim();

  if (apiDescription) {
    return {
      question: poll.question,
      description: apiDescription,
    };
  }

  const [title, ...descriptionParts] = poll.question.split(/\n\s*\n/);

  return {
    question: title.trim(),
    description: descriptionParts.join('\n\n').trim(),
  };
};

export default function AdminPollEditPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const queryClient = useQueryClient();
  const pollDetailPath = `/dashboard/poll/${params.id}`;

  // 1. 기존 데이터 불러오기
  const { data, isPending: isFetchPending } = usePollResultsQuery(
    Number(params.id),
  );

  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');

  // 2. 데이터 로드 시 상태값 채워넣기
  useEffect(() => {
    if (data?.poll) {
      const pollText = splitPollText(data.poll);

      /* eslint-disable react-hooks/set-state-in-effect */
      setQuestion(pollText.question);
      setDescription(pollText.description.slice(0, MAX_DESCRIPTION_LENGTH));
    }
  }, [data]);

  // 3. 수정 Mutation 설정
  const { mutateAsync: updatePoll, isPending: isUpdatePending } = useMutation({
    mutationFn: (updates: {
      question: string;
      descriptions?: string;
      options?: string[];
    }) => editPoll(Number(params.id), updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['polls', Number(params.id)] });
      alert('투표가 수정되었습니다.');
      router.replace(pollDetailPath);
    },
    onError: (error) => {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    },
  });

  const handleEdit = async () => {
    const trimmedQuestion = question.trim();
    const trimmedDescription = description.trim();

    if (!trimmedQuestion) {
      alert('제목을 입력해주세요!');
      return;
    }

    try {
      await updatePoll({
        question: trimmedQuestion,
        descriptions: trimmedDescription,
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
    <main className="theme-executive min-h-screen bg-[#303030] pb-20 font-['Pretendard']">
      <div className="pt-15.5">
        <header className="flex h-11 items-center gap-4 px-5">
          <button
            type="button"
            onClick={() => router.replace(pollDetailPath)}
            className="flex size-6 items-center justify-center opacity-50 brightness-0 invert"
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
            투표 수정하기
          </Sans.T200>
        </header>

        <div className="flex flex-col px-5 pt-6 pb-8">
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full border-none bg-transparent text-[20px] leading-[24px] font-bold text-text-input-value outline-none placeholder:text-text-input-placeholder"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <textarea
            placeholder="내용을 입력해주세요"
            className="mt-6 min-h-[45vh] w-full resize-none border-none bg-transparent text-[14px] leading-[20px] font-medium text-text-input-value outline-none placeholder:text-background-section"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))
            }
          />

          <div className="mt-2 flex items-center justify-end gap-1">
            <Sans.T120
              as="span"
              lineHeight="17px"
              color={
                description.length >= MAX_DESCRIPTION_LENGTH
                  ? 'label-home'
                  : 'title-value'
              }
              className={cn('transition-colors')}
            >
              {description.length}
            </Sans.T120>
            <Sans.T120
              as="span"
              lineHeight="17px"
              color="input-placeholder"
            >
              / {MAX_DESCRIPTION_LENGTH}
            </Sans.T120>
          </div>

          <div className="mt-6 box-border flex w-full flex-col items-start justify-center gap-2.5 rounded-[16px] bg-[#52514E] p-4">
            <Sans.T140
              as="p"
              lineHeight="20px"
              color="title-value"
            >
              투표 작성 전 참고사항
            </Sans.T140>
            <Sans.T140
              as="p"
              lineHeight="20px"
              color="title-label"
              className="whitespace-pre-line"
            >
              공정한 투표 문화를 위해 내용을 신중히 작성해주세요. <br />
              부적절한 내용 포함 시 관리자에 의해 삭제될 수 있습니다.
            </Sans.T140>
          </div>

          <div className="mt-6 flex w-full gap-[8px]">
            <button
              type="button"
              onClick={() => router.replace(pollDetailPath)}
              className="h-[44px] flex-1 rounded-[10px] bg-[#848485] font-semibold text-[#FFFFFF]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleEdit}
              disabled={isUpdatePending}
              className="h-[44px] flex-[2.5] rounded-[10px] bg-[#A0191E] font-semibold text-[#FFFFFF] disabled:opacity-30"
            >
              {isUpdatePending ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
