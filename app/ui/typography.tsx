import { HTMLAttributes } from 'react';

type TextColor = 'high' | 'medium' | 'low' | 'black' | 'white';

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
      colorClass = 'text-voting-text-high';
      break;
    case 'medium':
      colorClass = 'text-voting-text-medium';
      break;
    case 'low':
      colorClass = 'text-voting-text-low';
      break;
    case 'black':
      colorClass = 'text-voting-text-black';
      break;
    case 'white':
      colorClass = 'text-voting-text-white';
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
        lineHeight: '100%',
        letterSpacing: 0,
      }}
    >
      {children}
    </Tag>
  );
}

const T400 = (props: TypoProps) => {
  const className = `text-[40px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T240 = (props: TypoProps) => {
  const className = `text-[24px] ${props.className || ''}`;

  return (
    <Base
      {...props}
      className={className}
    />
  );
};

const T200 = (props: TypoProps) => {
  const className = `text-[20px] ${props.className || ''}`;

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

export const Typography = {
  T400,
  T240,
  T200,
  T160,
  T140,
  T120,
};
