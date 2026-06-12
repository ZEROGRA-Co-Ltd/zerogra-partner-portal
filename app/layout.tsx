import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZEROGRA RA Alliance Partner Portal',
  description: 'ZEROGRAパートナー企業向けポータル',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-zerogra-navy">{children}</body>
    </html>
  );
}
