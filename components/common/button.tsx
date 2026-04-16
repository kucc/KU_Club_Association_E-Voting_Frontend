import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  content: string;
  disabled?: boolean;
}>;

export default function Button({ content, disabled }: Props) {
  return (
    <button
      className="cursor-pointer rounded-[10px] bg-label py-3 disabled:cursor-not-allowed disabled:bg-label-unavailable"
      disabled={disabled}
    >
      <Sans.T160
        as="p"
        weight="semi-bold"
        lineHeight="20px"
        color={disabled ? 'label-unavailable' : 'label'}
      >
        {content}
      </Sans.T160>
    </button>
  );
}
