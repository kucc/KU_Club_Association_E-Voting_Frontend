import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  name: string;
  placeholder: string;
  title: string;
}>;

export default function Input({ name, placeholder, title }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Sans.T200
        as="h2"
        color="heading-section"
        lineHeight="24px"
        letterSpacing="0px"
        weight="bold"
      >
        {title}
      </Sans.T200>
      <input
        type={name === 'password' ? 'password' : 'text'}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-[12px] bg-background-search px-4 py-3 placeholder:text-[16px]/[22px] placeholder:tracking-[0px] focus:outline-label"
      />
    </div>
  );
}
