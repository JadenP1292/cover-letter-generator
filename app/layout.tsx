import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cover Letter Generator',
  description: 'Generate tailored cover letters instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
