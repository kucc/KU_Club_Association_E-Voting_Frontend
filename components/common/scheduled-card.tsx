import { formatDate } from '@/lib/utils';

import Button from './button';
import Card from './card';
import Labels, { LabelType } from './card/labels';
import Title from './card/title';

type Props = Readonly<{
  title: string;
  openingTime: string; // ISO 8601
}>;

export default function ScheduledCard({ title, openingTime }: Props) {
  const labels: LabelType[] = [
    {
      name: '시작 시간',
      content: formatDate(openingTime),
    },
  ];

  return (
    <Card>
      <Title content={title} />

      <Labels labels={labels} />

      <Button
        disabled
        content="투표하기"
      />
    </Card>
  );
}
