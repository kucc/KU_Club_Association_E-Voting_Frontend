import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  content: string;
  isAgent?: boolean;
}>;

export default function Title({ content, isAgent }: Props) {
  return (
    <div className="flex justify-between">
      <Sans.T200
        as="h3"
        weight="bold"
        lineHeight="24px"
        color="title-card"
      >
        {content}
      </Sans.T200>
      {isAgent && (
        <div className="h-5.25 rounded-[4px] bg-badge px-1.5 py-0.5">
          <Sans.T120
            as="p"
            lineHeight="17px"
            letterSpacing="-0.1px"
            color="badge"
          >
            대리인
          </Sans.T120>
        </div>
      )}
    </div>
  );
}
