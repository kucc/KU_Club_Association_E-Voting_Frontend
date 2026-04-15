'use client';

import { Sans } from '@/app/ui/sans';

import { useState } from 'react';

import Image from 'next/image';

export default function Home() {
  // 1. 로그인 상태를 관리하는 스위치 (true: 로그인 후, false: 로그인 전)
  const [isLogin] = useState(true);

  return (
    <div className="min-h-screen bg-voting-mint-high pb-[80px]">
      {/* --- 1. 상단 민트색 헤더 섹션 --- */}
      {/* 로그인 여부에 따라 높이가 526px 또는 752px로 변함 */}
      <section
        className={`relative flex ${isLogin ? 'h-[526px]' : 'h-[752px]'} w-full flex-col rounded-b-[20px] bg-voting-mint transition-all duration-300`}
      >
        {/* 아이콘 영역 */}
        {isLogin ? (
          // 로그인 후: 양옆 배치 (로고, 프로필)
          <div className="mt-[62px] flex h-[44px] w-full items-center justify-between gap-[12px] px-[20px]">
            <Image
              src="/icons/logo_poll.svg"
              alt="logo"
              width={28}
              height={28}
            />
            <Image
              src="/icons/profile.svg"
              alt="profile"
              width={28}
              height={28}
            />
          </div>
        ) : (
          // 로그인 전: 중앙 배치 (로고만)
          <div className="absolute top-[62px] left-1/2 -translate-x-1/2">
            <Image
              src="/icons/logo_poll.svg"
              alt="logo"
              width={28}
              height={28}
            />
          </div>
        )}

        {/* 타이틀 및 문구 영역 */}
        <div
          className={`${isLogin ? 'mt-[116px]' : 'absolute top-[277px]'} flex w-full flex-col items-start justify-center gap-[10px] px-[20px] py-[10px]`}
        >
          <Sans.T400
            as="h1"
            weight="bold"
            color="heading-page"
          >
            <span className="block leading-[48px] tracking-[-0.04em]">
              {'고려대학교\n동아리연합회\n온라인투표시스템'}
            </span>
          </Sans.T400>

          {/* 문구 조건부 렌더링 */}
          {isLogin ? (
            <div>
              <Sans.T200
                as="span"
                weight="bold"
                color="heading-page"
              >
                오승민
              </Sans.T200>
              <Sans.T200
                as="span"
                color="heading-page"
              >
                님 환영합니다
              </Sans.T200>
            </div>
          ) : (
            <Sans.T200
              as="p"
              color="heading-page"
            >
              어떤 문구가 좋을까요
            </Sans.T200>
          )}
        </div>

        {/* --- 로그인 전일 때만 보이는 [로그인 후 이용] 버튼  --- */}
        {!isLogin && (
          <div className="absolute top-[680px] w-full px-[20px]">
            <button className="flex h-[48px] w-full items-center justify-center rounded-[10px] bg-voting-black text-[20px] font-semibold text-voting-text-white transition-transform active:scale-[0.98]">
              로그인 후 이용
            </button>
          </div>
        )}
      </section>

      {/* --- 2. 로그인 했을 때만 보이는 [투표 리스트] --- */}
      {isLogin && (
        <main className="flex w-full flex-col gap-[40px] px-[20px] py-[24px]">
          {/* 지금 진행 중인 투표 섹션 */}
          <section className="flex flex-col gap-[16px]">
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="font-semibold tracking-[-0.02em]">
                지금 진행 중인 투표
              </span>
            </Sans.T240>
            <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
              <Sans.T200
                as="h3"
                weight="bold"
                color="heading-page"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
              <div className="flex flex-col gap-[12px]">
                <div className="flex gap-[16px]">
                  <Sans.T140
                    as="span"
                    color="input-placeholder"
                    className="w-[55px]"
                  >
                    기간
                  </Sans.T140>
                  <Sans.T140
                    as="span"
                    color="title-subvalue"
                  >
                    26.04.07 16:00에 종료
                  </Sans.T140>
                </div>
                <div className="flex gap-[16px]">
                  <Sans.T140
                    as="span"
                    color="input-placeholder"
                    className="w-[55px]"
                  >
                    투표 현황
                  </Sans.T140>
                  <Sans.T140
                    as="span"
                    color="title-subvalue"
                  >
                    투표하고 확인
                  </Sans.T140>
                </div>
              </div>
              <button className="flex h-[40px] w-full items-center justify-center rounded-[10px] bg-voting-black text-[14px] font-semibold text-voting-text-white active:scale-[0.98]">
                투표하기
              </button>
            </div>
          </section>

          {/* 예정된 투표 섹션 */}
          <section className="flex flex-col gap-[16px]">
            <Sans.T240
              as="h2"
              color="heading-page"
            >
              <span className="font-semibold tracking-[-0.02em]">
                예정된 투표
              </span>
            </Sans.T240>
            <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
              <Sans.T200
                as="h3"
                weight="bold"
                color="heading-page"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
              <div className="flex gap-[8px]">
                <div className="flex gap-[16px]">
                  <Sans.T140
                    as="span"
                    color="input-placeholder"
                    className="w-[55px] whitespace-nowrap"
                  >
                    기간
                  </Sans.T140>
                  <Sans.T140
                    as="span"
                    color="title-subvalue"
                  >
                    26.04.07 16:00에 시작
                  </Sans.T140>
                </div>
              </div>
              <button
                disabled
                className="flex h-[40px] w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-voting-disabled text-[14px] font-semibold text-voting-text-white"
              >
                투표하기
              </button>
            </div>
            <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
              <Sans.T200
                as="h3"
                weight="bold"
                color="heading-page"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
              <div className="flex gap-[8px]">
                <div className="flex gap-[16px]">
                  <Sans.T140
                    as="span"
                    color="input-placeholder"
                    className="w-[55px] whitespace-nowrap"
                  >
                    기간
                  </Sans.T140>
                  <Sans.T140
                    as="span"
                    color="title-subvalue"
                  >
                    26.04.07 16:00에 시작
                  </Sans.T140>
                </div>
              </div>
              <button
                disabled
                className="flex h-[40px] w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-voting-disabled text-[14px] font-semibold text-voting-text-white"
              >
                투표하기
              </button>
            </div>
            <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
              <Sans.T200
                as="h3"
                weight="bold"
                color="heading-page"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
              <div className="flex gap-[8px]">
                <div className="flex gap-[16px]">
                  <Sans.T140
                    as="span"
                    color="input-placeholder"
                    className="w-[55px] whitespace-nowrap"
                  >
                    기간
                  </Sans.T140>
                  <Sans.T140
                    as="span"
                    color="title-subvalue"
                  >
                    26.04.07 16:00에 시작
                  </Sans.T140>
                </div>
              </div>
              <button
                disabled
                className="flex h-[40px] w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-voting-disabled text-[14px] font-semibold text-voting-text-white"
              >
                투표하기
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
