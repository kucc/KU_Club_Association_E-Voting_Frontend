import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  content: string;
  disabled?: boolean;
  bigText?: boolean;
}>;

export default function Button({ content, disabled, bigText }: Props) {
  return (
    <button
      className="w-full cursor-pointer rounded-[10px] bg-label py-3 transition-all duration-300 disabled:cursor-not-allowed disabled:bg-label-unavailable"
      disabled={disabled}
    >
      {bigText ? (
        <Sans.T200
          as="p"
          weight="semi-bold"
          lineHeight="28px"
          color={disabled ? 'label-unavailable' : 'label'}
        >
          {content}
        </Sans.T200>
      ) : (
        <Sans.T160
          as="p"
          weight="semi-bold"
          lineHeight="20px"
          color={disabled ? 'label-unavailable' : 'label'}
        >
          {content}
        </Sans.T160>
      )}
    </button>
  );
}
