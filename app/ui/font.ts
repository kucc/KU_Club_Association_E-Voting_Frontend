// TODO: 디자인 확정 후 폰트 변경 + font.css 수정
import { Geist, Geist_Mono, Noto_Serif_KR, Roboto } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
