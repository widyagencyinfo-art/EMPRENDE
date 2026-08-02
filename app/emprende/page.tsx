import Link from 'next/link';
import { ModuleTiles } from './module-tiles';
import { Dashboard } from './dashboard';

export default function RumboHome() {
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      {/* Panel: onboarding la primera vez, centro de mando después */}
      <Dashboard />

      {/* Herramientas */}
      <div className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Herramientas</h2>
            <p className="text-sm emp-dim mt-0.5">
              Cada una resuelve una duda distinta. Empieza por donde te pique.
            </p>
          </div>
        </div>
        <ModuleTiles />
      </div>

      {/* Banner Pro */}
      <div className="mt-12 emp-hero emp-in !p-8 md:!p-10">
        <div className="flex flex-wrap items-center justify-between gap-5 relative z-[1]">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Deja de darle vueltas. <span className="emp-grad-text">Empieza hoy.</span>
            </h2>
            <p className="text-white/60 mt-2 text-sm">
              Tu primer análisis es gratis y tarda menos que hacerte un café.
              Cuando vayas en serio, Pro te quita todos los límites.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/emprende/validar" className="emp-btn text-sm">
              Validar mi idea →
            </Link>
            <Link href="/emprende/pro" className="emp-btn-ghost text-sm">
              Ver planes
            </Link>
          </div>
        </div>
      </div>

      <p className="text-center text-xs emp-dim mt-10">
        Hecho para que dejes de darle vueltas y empieces de una vez.
      </p>
    </div>
  );
}
