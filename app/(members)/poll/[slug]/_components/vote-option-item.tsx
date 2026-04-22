import { Sans } from '@/app/ui/sans';

import { cn } from '@/lib/utils';

type Props = Readonly<{
  label: string;
  checked: boolean;
  onSelect: () => void;
}>;

export default function VoteOptionItem({ label, checked, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        'flex h-11 w-full items-center gap-2 rounded-[10px] border bg-background-section px-4 py-3 text-left',
        checked
          ? 'border-[var(--voting-crimson-main)]'
          : 'border-[var(--voting-gray-300)]',
      )}
    >
      <span className="relative block h-3 w-3 shrink-0">
        {checked ? (
          <>
            <span className="absolute inset-0 rounded-full bg-label" />
            <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background-section" />
          </>
        ) : (
          <span className="absolute inset-0 rounded-full border border-[var(--voting-gray-300)] bg-transparent" />
        )}
      </span>

      <Sans.T160
        as="span"
        weight="semi-bold"
        lineHeight="20px"
        color={checked ? 'label-select' : 'label-not-select'}
      >
        {label}
      </Sans.T160>
    </button>
  );
}
