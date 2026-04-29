import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  content: string;
  isAgent?: boolean;
  badgeLabel?: string;
}>;

export default function Title({ content, isAgent, badgeLabel }: Props) {
  const displayedBadgeLabel = badgeLabel ?? (isAgent ? '대리인' : undefined);
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
      {displayedBadgeLabel && (
        <div className="h-5.25 rounded-[4px] bg-badge px-1.5 py-0.5">
          <Sans.T120
            as="p"
            lineHeight="17px"
            letterSpacing="-0.1px"
            color="badge"
          >
            {displayedBadgeLabel}
          </Sans.T120>
        </div>
      )}
    </div>
  );
}
