import { formatDate } from '@/lib/utils';

import Button from './button';
import Card from './card';
import Labels, { LabelType } from './card/labels';
import Title from './card/title';

type Props = Readonly<{
  title: string;
  openingTime: string; // ISO 8601
  isAdmin?: boolean;
  isStarting?: boolean;
  onStart?: () => void;
}>;

export default function ScheduledCard({
  title,
  openingTime,
  isAdmin,
  isStarting,
  onStart,
}: Props) {
  const labels: LabelType[] = [
    {
      name: '마감 기한',
      content: formatDate(openingTime),
    },
  ];

  return (
    <Card>
      <Title content={title} />

      <Labels labels={labels} />

      <Button
        disabled={!isAdmin || isStarting}
        content={
          isAdmin ? (isStarting ? '시작 중...' : '시작하기') : '투표하기'
        }
        onClick={onStart}
      />
    </Card>
  );
}
