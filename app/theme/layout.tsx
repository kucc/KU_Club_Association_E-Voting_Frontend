import { notFound } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 배포 환경에서 접근 제한
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <>{children}</>;
}
