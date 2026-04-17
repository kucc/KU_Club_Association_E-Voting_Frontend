import Label from './label';

export type LabelType = {
  name: string;
  content: string;
  subContent?: string;
};

type Props = Readonly<{
  labels: LabelType[];
}>;

export default function Labels({ labels }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {labels.map((label, index) => (
        <Label
          key={index}
          name={label.name}
          content={label.content}
          subContent={label.subContent}
        />
      ))}
    </div>
  );
}
