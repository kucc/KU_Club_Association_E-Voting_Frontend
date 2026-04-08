import { TypoProps, Typography } from './typography';

const T200 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T200
      {...props}
      className={className}
    />
  );
};

const T180 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T180
      {...props}
      className={className}
    />
  );
};

const T160 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T160
      {...props}
      className={className}
    />
  );
};

const T140 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T140
      {...props}
      className={className}
    />
  );
};

const T120 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T120
      {...props}
      className={className}
    />
  );
};

const T100 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T100
      {...props}
      className={className}
    />
  );
};

export const Sans = {
  T200,
  T180,
  T160,
  T140,
  T120,
  T100,
};
