import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroNumerology AI',
  description: 'Натальная карта, нумерология и персональный AI-отчет'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
