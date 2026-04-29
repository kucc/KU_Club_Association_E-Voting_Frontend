import { PollStatistics } from '@/types/poll';

import Link from 'next/link';

import { formatDate } from '@/lib/utils';

import Card from './card';
import Labels, { LabelType } from './card/labels';
import Title from './card/title';

type Props = Readonly<{
  title: string;
  deadline: string; // ISO 8601
  myVote: string;
  statistics: PollStatistics;
  results: string;

  isAgent?: boolean;
  badgeLabel?: string;
  href?: string;
}>;

export default function HistoryCard({
  title,
  deadline,
  myVote,
  statistics,
  results,
  isAgent,
  badgeLabel,
  href,
}: Props) {
  const attendanceRate =
    statistics.quota > 0
      ? Math.round((statistics.votes / statistics.quota) * 100)
      : 0;
  const labels: LabelType[] = [
    {
      name: '마감 기한',
      content: formatDate(deadline),
    },
    {
      name: '내 투표',
      content: myVote,
    },
    {
      name: '출석률',
      content: `${statistics.votes} `,
      subContent: `/ ${statistics.quota} (${attendanceRate}%)`,
    },
    {
      name: '결과',
      content: results,
    },
  ];

  const card = (
    <Card>
      <Title
        content={title}
        isAgent={isAgent}
        badgeLabel={badgeLabel}
      />

      <Labels labels={labels} />
    </Card>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="block"
    >
      {card}
    </Link>
  );
}
