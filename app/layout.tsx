import { Pretendard, notoSerifKR, roboto } from '@/app/ui/font';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '고려대학교 동아리연합회 온라인투표시스템',
  description: '고려대 중앙동아리연합 투표 시스템입니다',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${Pretendard.className} ${notoSerifKR.variable} ${roboto.variable} h-full antialiased`}
    >
      <ThemeProvider>
        <body className="flex min-h-full flex-col">{children}</body>
      </ThemeProvider>
    </html>
  );
}
