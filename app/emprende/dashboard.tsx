'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getModulo, gradCss } from '@/lib/emprende/catalog';
import { computeStats, getRuns, haceCuanto, type RunLog } from './stats';

function notaColor(n: number) {
  return n >= 7 ? '#22c55e' : n >= 5 ? '#f59e0b' : '#f43f5e';
}

export function Dashboard() {
  // Se monta en cliente para leer localStorage sin romper la hidratación.
  const [runs, setRuns] = useState<RunLog[] | null>(null);
  useEffect(() => setRuns(getRuns()), []);

  const s = computeStats(runs ?? []);
  const cargado = runs !== null;
  const fecha = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const hoy = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return (
    <section className="emp-in">
      {/* Saludo */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs emp-dim">{hoy}</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
            Tu centro de mando <span className="emp-grad-text">⌁</span>
          </h1>
        </div>
        <span className="emp-badge" style={{ borderColor: 'rgba(139,92,246,.4)', background: 'rgba(139,92,246,.14)' }}>
          {s.nivel.emoji} Nivel {s.nivelIdx + 1} · {s.nivel.nombre}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 emp-stagger">
        <div className="emp-kpi" style={{ ['--kpi-c' as string]: 'linear-gradient(90deg,#8b5cf6,#d946ef)' }}>
          <div className="text-xs emp-dim mb-1.5">🧠 Análisis hechos</div>
          <div className="emp-kpi-num">{cargado ? s.total : '—'}</div>
          <div className="text-[11px] emp-dim mt-1">con IA, gratis</div>
        </div>

        <div className="emp-kpi" style={{ ['--kpi-c' as string]: 'linear-gradient(90deg,#f59e0b,#fb923c)' }}>
          <div className="text-xs emp-dim mb-1.5">⭐ Nota media</div>
          <div className="emp-kpi-num">
            {cargado && s.notaMedia !== null ? s.notaMedia : '—'}
            {cargado && s.notaMedia !== null && <span className="text-sm font-bold emp-dim">/10</span>}
          </div>
          <div className="text-[11px] emp-dim mt-1">de tus ideas</div>
        </div>

        <div className="emp-kpi" style={{ ['--kpi-c' as string]: 'linear-gradient(90deg,#f43f5e,#fb923c)' }}>
          <div className="text-xs emp-dim mb-1.5">🔥 Racha</div>
          <div className="emp-kpi-num">
            {cargado ? s.racha : '—'}
            <span className="text-sm font-bold emp-dim"> {s.racha === 1 ? 'día' : 'días'}</span>
          </div>
          <div className="text-[11px] emp-dim mt-1">seguidos dándole</div>
        </div>

        <div className="emp-kpi" style={{ ['--kpi-c' as string]: 'linear-gradient(90deg,#22c55e,#14b8a6)' }}>
          <div className="text-xs emp-dim mb-1.5">{s.nivel.emoji} Nivel {s.nivelIdx + 1}</div>
          <div className="text-lg font-black text-white leading-tight">{s.nivel.nombre}</div>
          <div className="emp-bar mt-2" style={{ height: 6 }}>
            <i style={{ width: `${s.pctNivel}%` }} />
          </div>
          <div className="text-[11px] emp-dim mt-1">
            {s.siguiente ? `${s.xp} XP · ${s.siguiente.xp - s.xp} para ${s.siguiente.nombre}` : `${s.xp} XP · nivel máximo`}
          </div>
        </div>
      </div>

      {/* Rendimiento + actividad */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {/* Últimas notas */}
        <div className="emp-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">📈 Tus últimas notas</h3>
            {s.notaMedia !== null && (
              <span className="text-xs emp-dim">media {s.notaMedia}/10</span>
            )}
          </div>
          {cargado && s.ultimasNotas.length > 0 ? (
            <>
              <div className="emp-chart">
                {s.ultimasNotas.map((r, i) => (
                  <div
                    key={i}
                    title={`${r.nota}/10`}
                    style={{
                      height: `${(r.nota! / 10) * 100}%`,
                      ['--bar-c' as string]: notaColor(r.nota!),
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] emp-dim mt-2">
                <span>más antigua</span>
                <span>última</span>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm emp-dim">
                Valida tu primera idea y aquí verás la evolución de tus notas.
              </p>
              <Link href="/emprende/validar" className="emp-btn-ghost text-xs px-4 py-2 mt-3 inline-flex">
                Validar una idea →
              </Link>
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="emp-card p-5">
          <h3 className="font-bold text-white text-sm mb-4">🕒 Actividad reciente</h3>
          {cargado && s.recientes.length > 0 ? (
            <div className="space-y-2.5">
              {s.recientes.map((r, i) => {
                const m = getModulo(r.slug);
                if (!m) return null;
                return (
                  <Link key={i} href={`/emprende/${m.slug}`} className="flex items-center gap-3 emp-inner px-3.5 py-2.5 hover:border-white/20 transition-colors">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg text-sm shrink-0"
                      style={{ background: gradCss(m.grad) }}
                    >
                      {m.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-white truncate">{m.nombre}</span>
                      <span className="block text-[11px] emp-dim">{haceCuanto(r.t)}</span>
                    </span>
                    {typeof r.nota === 'number' && (
                      <span className="text-sm font-black shrink-0" style={{ color: notaColor(r.nota) }}>
                        {r.nota}/10
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <p className="text-sm emp-dim">
                Aún no has hecho ningún análisis. Tu actividad aparecerá aquí.
              </p>
              <Link href="/emprende/que-negocio" className="emp-btn text-xs px-4 py-2 mt-3 inline-flex">
                Hacer el primero →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
