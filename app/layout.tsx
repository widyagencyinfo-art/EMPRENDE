import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Rumbo — tu copiloto para emprender con foco',
  description:
    'Tu plan, tu foco y tu ruta hasta tu objetivo de ingresos. IA real para emprendedores jóvenes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
