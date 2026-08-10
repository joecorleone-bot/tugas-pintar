import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Tugas Pintar', description: 'Simple and elegant todo list' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ms"><body>{children}</body></html>;
}