import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'emprendIA — la app de IA para emprendedores',
  description:
    'Valida tu idea, descubre qué negocio montar y sigue tu ruta hasta tu objetivo de ingresos. La IA que ayuda a los emprendedores a facturar.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
