import { HTMLAttributes } from 'react';

type TextColor =
  | 'hero'
  | 'popup'
  | 'badge'
  // heading
  | 'heading-page'
  | 'heading-page-light'
  | 'heading-section'
  // label
  | 'label'
  | 'label-click'
  | 'label-unavailable'
  | 'label-success'
  | 'label-home'
  | 'label-select'
  | 'label-not-select'
  // chip
  | 'chip-on'
  | 'chip-off'
  // input
  | 'input-placeholder'
  | 'input-value'
  // title
  | 'title-card'
  | 'title-value'
  | 'title-subvalue'
  | 'title-label'
  // profile
  | 'profile-name'
  | 'profile-support'
  | 'profile-value'
  | 'profile-label';

type TextWeight = 'medium' | 'semi-bold' | 'bold';

export type TypoProps = Readonly<{
  children: React.ReactNode;
  as: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: HTMLAttributes<HTMLParagraphElement>['className'];
  color?: TextColor;
  weight?: TextWeight;
  lineHeight?: string;
  letterSpacing?: string;
}>;

function Base({
  children,
  as: Tag,
  className,
  color,
  weight = 'medium',
  lineHeight = '100%',
  letterSpacing = '0',
}: TypoProps) {
  const colorClass = color ? `text-text-${color}` : 'text-inherit';

  let weightClass = '';
  switch (weight) {
    case 'medium':
      weightClass = 'font-medium';
      break;
    case 'semi-bold':
      weightClass = 'font-semibold';
      break;
    case 'bold':
      weightClass = 'font-bold';
      break;
    default:
      weightClass = 'font-normal';
      break;
  }

  const _className = `${colorClass} ${weightClass} ${className || ''} whitespace-pre-wrap`;

  return (
    <Tag
      className={_className}
      style={{
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
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
