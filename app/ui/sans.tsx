import { TypoProps, Typography } from './typography';

const T400 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T400
      {...props}
      className={className}
    />
  );
};

const T240 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T240
      {...props}
      className={className}
    />
  );
};

const T200 = (props: TypoProps) => {
  const className = `font-sans ${props.className || ''}`;

  return (
    <Typography.T200
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

export const Sans = {
  T400,
  T240,
  T200,
  T160,
  T140,
  T120,
};
