import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Emprende — tu copiloto para montar tu negocio',
  description:
    'Valida tu idea, descubre qué negocio montar y lanza tu proyecto con IA. Para emprendedores jóvenes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
