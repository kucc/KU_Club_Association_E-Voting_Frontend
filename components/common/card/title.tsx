import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  content: string;
}>;

export default function Title({ content }: Props) {
  return (
    <Sans.T200
      as="h3"
      weight="bold"
      lineHeight="24px"
    >
      {content}
    </Sans.T200>
  );
}
