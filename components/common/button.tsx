import { Sans } from '@/app/ui/sans';

import { cn } from '@/lib/utils';

type Props = Readonly<{
  content: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium';
}>;

export default function Button({
  content,
  disabled,
  onClick,
  size = 'small',
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center justify-center rounded-[10px] bg-label disabled:cursor-not-allowed disabled:bg-label-unavailable',
        size === 'medium' ? 'h-[46px]' : 'h-11',
      )}
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
