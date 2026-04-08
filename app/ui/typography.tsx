// TODO: 디자인 확정 후 글자 크기 변경
import { HTMLAttributes } from 'react';

type TextColor =
  | 'high'
  | 'medium'
  | 'low'
  | 'gold'
  | 'black'
  | 'primary'
  | 'primary-accent';

export type TypoProps = Readonly<{
  children: React.ReactNode;
  as: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: HTMLAttributes<HTMLParagraphElement>['className'];
  color?: TextColor;
  bold?: boolean;
}>;

function Base({ children, as: Tag, color, bold, className }: TypoProps) {
  let colorClass = '';
  switch (color) {
    case 'high':
      colorClass = 'text-arcana-text-high';
      break;
    case 'medium':
      colorClass = 'text-arcana-text-medium';
      break;
    case 'low':
      colorClass = 'text-arcana-text-low';
      break;
    case 'gold':
      colorClass = 'text-arcana-gold';
      break;
    case 'black':
      colorClass = 'text-arcana-text-black';
      break;
    case 'primary':
      colorClass = 'text-arcana-primary';
      break;
    case 'primary-accent':
      colorClass = 'text-arcana-primary-accent';
      break;
    default:
      colorClass = 'text-inherit';
      break;
  }

  const _className = `${colorClass || ''} ${className || ''} whitespace-pre-wrap`;

  return (
    <Tag
      className={_className}
      style={{
        fontWeight: bold ? 'bold' : 'normal',
      }}
    >
      {children}
    </Tag>
  );
}

const T200 = (props: TypoProps) => {
  const className = `text-[20px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T180 = (props: TypoProps) => {
  const className = `text-[18px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T160 = (props: TypoProps) => {
  const className = `text-[16px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T140 = (props: TypoProps) => {
  const className = `text-[14px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T120 = (props: TypoProps) => {
  const className = `text-[12px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T100 = (props: TypoProps) => {
  const className = `text-[10px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

export const Typography = {
  T200,
  T180,
  T160,
  T140,
  T120,
  T100,
};
