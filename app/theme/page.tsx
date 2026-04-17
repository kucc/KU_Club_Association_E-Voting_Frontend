import { Sans } from '../ui/sans';
import { ThemePreview } from './theme-preview';

export default function Page() {
  return (
    <div>
      <Sans.T400
        as="p"
        weight="bold"
      >
        Pretendard 40px bold 다람쥐 헌 쳇바퀴에 타고파
      </Sans.T400>
      <Sans.T400 as="p">Pretendard 40px 다람쥐 헌 쳇바퀴에 타고파</Sans.T400>

      <br />

      <Sans.T240
        as="p"
        weight="bold"
      >
        Pretendard 24px bold 다람쥐 헌 쳇바퀴에 타고파
      </Sans.T240>
      <Sans.T240 as="p">Pretendard 24px 다람쥐 헌 쳇바퀴에 타고파</Sans.T240>

      <br />

      <Sans.T200
        as="p"
        weight="bold"
      >
        Pretendard 20px bold 다람쥐 헌 쳇바퀴에 타고파
      </Sans.T200>
      <Sans.T200 as="p">Pretendard 20px 다람쥐 헌 쳇바퀴에 타고파</Sans.T200>

      <br />

      <Sans.T160
        as="p"
        weight="bold"
      >
        Pretendard 16px bold 다람쥐 헌 쳇바퀴에 타고파
      </Sans.T160>
      <Sans.T160 as="p">Pretendard 16px 다람쥐 헌 쳇바퀴에 타고파</Sans.T160>

      <br />

      <Sans.T140
        as="p"
        weight="bold"
      >
        Pretendard 14px bold 다람쥐 헌 쳇바퀴에 타고파
      </Sans.T140>
      <Sans.T140 as="p">Pretendard 14px 다람쥐 헌 쳇바퀴에 타고파</Sans.T140>

      <br />

      <div className="bg-voting-mint">
        <Sans.T240
          as="p"
          color="heading-page-light"
          className="bg-voting-black"
        >
          text-white
        </Sans.T240>
        <Sans.T240
          as="p"
          color="chip-off"
          className="bg-voting-black"
        >
          text-high
        </Sans.T240>
        <Sans.T240
          as="p"
          color="input-placeholder"
        >
          text-medium
        </Sans.T240>
        <Sans.T240
          as="p"
          color="title-subvalue"
        >
          text-low
        </Sans.T240>
        <Sans.T240
          as="p"
          color="heading-page"
        >
          text-black
        </Sans.T240>
      </div>

      <br />

      <div className="flex">
        <div>
          <Sans.T200 as="p">mint</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-mint"></div>
        </div>
        <div>
          <Sans.T200 as="p">mint-high</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-mint-high"></div>
        </div>
        <div>
          <Sans.T200 as="p">black</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-black"></div>
        </div>
        <div>
          <Sans.T200 as="p">background</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-background"></div>
        </div>
        <div>
          <Sans.T200 as="p">gray</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-gray"></div>
        </div>
        <div>
          <Sans.T200 as="p">disabled</Sans.T200>
          <div className="flex h-30 w-30 items-center justify-center bg-voting-disabled"></div>
        </div>
      </div>

      <hr className="my-8" />

      <ThemePreview />
    </div>
  );
}
