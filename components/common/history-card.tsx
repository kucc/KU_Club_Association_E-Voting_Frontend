import { PollStatistics } from '@/types/poll';

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
}>;

export default function HistoryCard({
  title,
  deadline,
  myVote,
  statistics,
  results,
  isAgent,
}: Props) {
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
      subContent: `/ ${statistics.quota} (${Math.round((statistics.votes / statistics.quota) * 100)}%)`,
    },
    {
      name: '결과',
      content: results,
    },
  ];

  return (
    <Card>
      <Title
        content={title}
        isAgent={isAgent}
      />

      <Labels labels={labels} />
    </Card>
  );
}
