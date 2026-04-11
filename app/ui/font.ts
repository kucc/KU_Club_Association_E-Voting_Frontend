import { Noto_Serif_KR, Roboto } from 'next/font/google';
import localfont from 'next/font/local';

export const Pretendard = localfont({
  src: '../../public/fonts/PretendardVariable.woff2',
});

export const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
});

export const notoSerifKR = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  subsets: ['latin'],
  fallback: ['AppleMyungjo', 'Batang', 'Georgia', 'serif'],
  display: 'swap',
});
