import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  name: string;
  placeholder: string;
  title: string;
}>;

export default function Input({ name, placeholder, title }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Sans.T160
        as="h2"
        color="heading-section"
      >
        {title}
      </Sans.T160>
      <input
        type={name === 'password' ? 'password' : 'text'}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-text-label-not-select px-4 py-3 placeholder:text-[16px]/[20px] placeholder:tracking-[0px] focus:outline-label"
      />
    </div>
  );
}
