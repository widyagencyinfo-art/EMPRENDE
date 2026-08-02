import type { Metadata } from 'next';
import { EmprendeSidebar, EmprendeMobileNav } from './sidebar';
import { RequireCuenta } from './require-cuenta';

export const metadata: Metadata = {
  title: 'emprendIA — la app de IA para emprendedores',
  description:
    'Valida tu idea, descubre qué negocio montar y sigue tu ruta hasta tu objetivo de ingresos. La IA que ayuda a los emprendedores a facturar.',
};

// Panel público del producto Emprende. Independiente del panel interno de Widy.
export default function EmprendeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen emp-app">
      <RequireCuenta />
      <EmprendeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmprendeMobileNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
