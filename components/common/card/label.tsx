import { Sans } from '@/app/ui/sans';

type Props = Readonly<{
  name: string;
  content: string;
  subContent?: string;
}>;

export default function Label({ name, content, subContent }: Props) {
  return (
    <div className="flex gap-4">
      <span className="w-13.75">
        <Sans.T140
          as="p"
          weight="medium"
          lineHeight="17px"
          color="title-label"
        >
          {name}
        </Sans.T140>
      </span>
      <span className="flex">
        <Sans.T140
          as="p"
          weight="medium"
          lineHeight="17px"
          color="title-value"
        >
          {content}
        </Sans.T140>
        {subContent && (
          <Sans.T140
            as="p"
            weight="medium"
            lineHeight="17px"
            color="title-subvalue"
          >
            {subContent}
          </Sans.T140>
        )}
      </span>
    </div>
  );
}
