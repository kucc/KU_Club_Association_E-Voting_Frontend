import { Sans } from '@/app/ui/sans';

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-voting-mint-high pb-[80px]">
      {/* --- 1. 상단 민트색 헤더 섹션 --- */}
      <section className="flex h-[526px] w-full flex-col rounded-b-[20px] bg-voting-mint">
        {/* 아이콘 영역 */}
        <div className="mt-[62px] flex h-[44px] w-full items-center justify-between gap-[12px] px-[20px]">
          {/* 로고 아이콘 자리 (왼쪽 투표 모양) */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.5 14.8349H20.7067L18.3733 17.1682H20.6017L22.6667 19.5016H6.33333L8.41 17.1682H10.8017L8.46833 14.8349H7.5L4 18.3349V23.0016C4 23.6204 4.24583 24.2139 4.68342 24.6515C5.121 25.0891 5.71449 25.3349 6.33333 25.3349H22.6667C23.2855 25.3349 23.879 25.0891 24.3166 24.6515C24.7542 24.2139 25 23.6204 25 23.0016V18.3349L21.5 14.8349ZM20.3333 8.94323L14.5583 14.7182L10.4167 10.5882L16.2033 4.81323L20.3333 8.94323ZM15.3867 2.3399L7.955 9.77157C7.84685 9.8795 7.76104 10.0077 7.7025 10.1488C7.64395 10.29 7.61382 10.4413 7.61382 10.5941C7.61382 10.7469 7.64395 10.8982 7.7025 11.0393C7.76104 11.1804 7.84685 11.3086 7.955 11.4166L13.73 17.1682C14.185 17.6466 14.92 17.6466 15.375 17.1682L22.795 9.77157C22.9032 9.66363 22.989 9.53543 23.0475 9.39429C23.1061 9.25316 23.1362 9.10186 23.1362 8.94907C23.1362 8.79627 23.1061 8.64497 23.0475 8.50384C22.989 8.3627 22.9032 8.2345 22.795 8.12657L17.02 2.35157C16.9147 2.24143 16.7884 2.15357 16.6486 2.09318C16.5087 2.03279 16.3581 2.00112 16.2058 2.00003C16.0535 1.99894 15.9025 2.02846 15.7617 2.08685C15.621 2.14523 15.4935 2.23128 15.3867 2.3399Z"
              fill="black"
            />
          </svg>

          {/* 프로필 아이콘 자리 (오른쪽 프로필 이미지) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.1304 4.08602C14.1304 6.34267 12.2812 8.17204 10 8.17204C7.71882 8.17204 5.86957 6.34267 5.86957 4.08602C5.86957 1.82937 7.71882 0 10 0C12.2812 0 14.1304 1.82937 14.1304 4.08602Z"
              fill="black"
            />
            <path
              d="M20 16.129C20 19.0847 13.9404 20 10.1557 20C6.3711 20 0 19.0847 0 16.129C0 13.1734 3.32174 10.1075 10 10.1075C16.6783 10.1075 20 13.1734 20 16.129Z"
              fill="black"
            />
          </svg>
        </div>

        {/* 타이틀 및 환영문구 영역 */}
        <div className="mt-[116px] flex h-[198px] w-full flex-col items-start justify-center gap-[10px] px-[20px] py-[10px]">
          <Sans.T400
            as="h1"
            bold
            color="black"
          >
            <span className="block leading-[48px] tracking-[-0.04em]">
              {'고려대학교\n동아리연합회\n온라인투표시스템'}
            </span>
          </Sans.T400>

          <div>
            <Sans.T200
              as="span"
              bold
              color="black"
            >
              오승민
            </Sans.T200>
            <Sans.T200
              as="span"
              color="black"
            >
              님 환영합니다
            </Sans.T200>
          </div>
        </div>
      </section>

      <main className="flex w-full flex-col gap-[40px] px-[20px] py-[24px]">
        {/* --- 2. 지금 진행 중인 투표 섹션 --- */}
        <section className="flex flex-col gap-[16px]">
          <Sans.T240
            as="h2"
            color="black"
          >
            <span className="font-semibold tracking-[-0.02em]">
              지금 진행 중인 투표
            </span>
          </Sans.T240>

          <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
            <div className="flex items-center justify-between">
              <Sans.T200
                as="h3"
                bold
                color="black"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
            </div>

            <div className="flex flex-col gap-[12px]">
              <div className="flex gap-[16px]">
                <Sans.T140
                  as="span"
                  color="medium"
                  className="w-[55px]"
                >
                  기간
                </Sans.T140>
                <Sans.T140
                  as="span"
                  color="low"
                >
                  26.04.07 16:00에 종료
                </Sans.T140>
              </div>
              <div className="flex gap-[16px]">
                <Sans.T140
                  as="span"
                  color="medium"
                  className="w-[55px]"
                >
                  투표 현황
                </Sans.T140>
                <Sans.T140
                  as="span"
                  color="low"
                >
                  투표하고 확인
                </Sans.T140>
              </div>
            </div>

            <button className="flex h-[40px] w-full items-center justify-center rounded-[10px] bg-voting-black text-[14px] font-semibold text-voting-text-white transition-transform active:scale-[0.98]">
              투표하기
            </button>
          </div>
        </section>

        {/* --- 3. 예정된 투표 섹션 --- */}
        <section className="flex flex-col gap-[16px]">
          <Sans.T240
            as="h2"
            color="black"
          >
            <span className="font-semibold tracking-[-0.02em]">
              예정된 투표
            </span>
          </Sans.T240>

          <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[24px] shadow-sm">
            <div className="flex items-center justify-between">
              <Sans.T200
                as="h3"
                bold
                color="black"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <Sans.T140
                  as="span"
                  color="medium"
                  className="w-[55px] whitespace-nowrap"
                >
                  기간
                </Sans.T140>
                <Sans.T140
                  as="span"
                  color="low"
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
            <div className="flex items-center justify-between">
              <Sans.T200
                as="h3"
                bold
                color="black"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <Sans.T140
                  as="span"
                  color="medium"
                  className="w-[55px] whitespace-nowrap"
                >
                  기간
                </Sans.T140>
                <Sans.T140
                  as="span"
                  color="low"
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
            <div className="flex items-center justify-between">
              <Sans.T200
                as="h3"
                bold
                color="black"
              >
                제1회 동아리연합회장 선거
              </Sans.T200>
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[16px]">
                <Sans.T140
                  as="span"
                  color="medium"
                  className="w-[55px] whitespace-nowrap"
                >
                  기간
                </Sans.T140>
                <Sans.T140
                  as="span"
                  color="low"
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
    </div>
  );
}
