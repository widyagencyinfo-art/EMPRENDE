import Link from 'next/link';
import { ModuleTiles } from './module-tiles';

const STATS = [
  { n: '5', l: 'herramientas de IA' },
  { n: '~30s', l: 'para tu primer análisis' },
  { n: '0€', l: 'para empezar' },
];

const PASOS = [
  {
    n: '01',
    emoji: '💡',
    t: 'Suelta tu idea',
    d: 'Escribe lo que tienes en la cabeza. Sin formularios eternos: una frase basta.',
  },
  {
    n: '02',
    emoji: '⚡',
    t: 'La IA la analiza',
    d: 'Mercado, competencia, riesgos y números reales en segundos. Sin humo.',
  },
  {
    n: '03',
    emoji: '🚀',
    t: 'Pasa a la acción',
    d: 'Te llevas primeros pasos concretos y un plan de 30 días para arrancar ya.',
  },
];

export default function EmprendeHome() {
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      {/* Hero */}
      <section className="emp-hero emp-in">
        <span className="emp-badge mb-5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
          </span>
          Para emprendedores jóvenes
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02] max-w-3xl">
          De la idea al negocio,
          <br />
          <span className="emp-grad-text">con IA a tu lado.</span>
        </h1>

        <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
          Valida tu idea, descubre qué montar y lanza tu proyecto en semanas.
          Sin humo, sin excusas, sin gastarte un euro para empezar.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/emprende/que-negocio" className="emp-btn text-sm">
            Descubrir mi negocio →
          </Link>
          <Link href="/emprende/validar" className="emp-btn-ghost text-sm">
            Validar mi idea
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4 relative z-[1]">
          {STATS.map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-black text-white">{s.n}</div>
              <div className="text-xs text-white/55 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos */}
      <div className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Elige tu herramienta</h2>
            <p className="text-sm emp-dim mt-0.5">Cada una resuelve una duda distinta. Empieza por donde te pique.</p>
          </div>
        </div>
        <ModuleTiles />
      </div>

      {/* Cómo funciona */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-white mb-5">Cómo funciona</h2>
        <div className="grid gap-4 md:grid-cols-3 emp-stagger">
          {PASOS.map((p) => (
            <div key={p.n} className="emp-card p-6 relative overflow-hidden">
              <span className="absolute -top-3 -right-2 text-7xl font-black text-white/[.04] select-none">
                {p.n}
              </span>
              <div className="text-3xl mb-3">{p.emoji}</div>
              <h3 className="font-semibold text-white">{p.t}</h3>
              <p className="text-sm emp-dim mt-1.5 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-14 emp-card p-8 md:p-10 text-center relative overflow-hidden emp-in">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(217,70,239,.25), transparent 70%)' }}
        />
        <h2 className="text-2xl md:text-3xl font-black text-white max-w-xl mx-auto leading-tight">
          Deja de darle vueltas. <span className="emp-grad-text">Empieza hoy.</span>
        </h2>
        <p className="emp-dim mt-3 max-w-md mx-auto">
          Tu primera validación es gratis y tarda menos que hacerte un café.
        </p>
        <Link href="/emprende/validar" className="emp-btn mt-6 text-sm">
          Validar mi idea gratis →
        </Link>
      </div>

      <p className="text-center text-xs emp-dim mt-10">
        Hecho para que dejes de darle vueltas y empieces de una vez. 🚀
      </p>
    </div>
  );
}
