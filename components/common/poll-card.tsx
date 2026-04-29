import { PollStatistics } from '@/types/poll';

import { formatDate } from '@/lib/utils';

import Button from './button';
import Card from './card';
import Labels, { LabelType } from './card/labels';
import Title from './card/title';

type Props = Readonly<{
  title: string;
  deadline: string; // ISO 8601
  statistics: PollStatistics;

  myVote?: string;

  isAdmin?: boolean;
  isAgent?: boolean;
  onAction?: () => void;
}>;

export default function PollCard({
  title,
  deadline,
  statistics,
  myVote,
  isAdmin,
  isAgent,
  onAction,
}: Props) {
  const votingRate =
    statistics.quota > 0
      ? Math.round((statistics.votes / statistics.quota) * 100)
      : 0;
  const labels: LabelType[] = [
    {
      name: '마감 기한',
      content: formatDate(deadline),
    },
    {
      name: '투표 현황',
      content: '투표하고 확인',
    },
  ];

  if (myVote) {
    labels[1].content = `${statistics.votes} `;
    labels[1].subContent = `/ ${statistics.quota} (${votingRate}%)`;

    labels.push({
      name: '내 투표',
      content: myVote,
    });
  }

  return (
    <Card>
      <Title
        content={title}
        isAgent={isAgent}
      />

      <Labels labels={labels} />

      <Button
        content={isAdmin ? '상세보기' : myVote ? '투표 수정하기' : '투표하기'}
        onClick={onAction}
      />
    </Card>
  );
}
