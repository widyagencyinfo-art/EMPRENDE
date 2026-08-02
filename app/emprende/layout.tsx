import type { Metadata } from 'next';
import { EmprendeSidebar, EmprendeMobileNav } from './sidebar';

export const metadata: Metadata = {
  title: 'Rumbo — tu copiloto para emprender con foco',
  description:
    'Tu plan, tu foco y tu ruta hasta tu objetivo de ingresos. IA real para emprendedores jóvenes.',
};

// Panel público del producto Emprende. Independiente del panel interno de Widy.
export default function EmprendeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen emp-app">
      <EmprendeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmprendeMobileNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
