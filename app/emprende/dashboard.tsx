'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getModulo, gradCss, type ModuloSlug } from '@/lib/emprende/catalog';
import { computeStats, getRuns, haceCuanto, type RunLog } from './stats';
import { getPerfil, updatePerfil, type Perfil } from './perfil';
import { Resultado, notaColor } from './resultado';
import { Ic, type IconName } from './icons';

export function Dashboard() {
  // Todo se monta en cliente (localStorage) sin romper la hidratación.
  const [cargado, setCargado] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [runs, setRuns] = useState<RunLog[]>([]);

  function refresh() {
    setPerfil(getPerfil());
    setRuns(getRuns());
    setCargado(true);
  }
  useEffect(refresh, []);

  if (!cargado) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="emp-skeleton h-10 w-2/3" />
        <div className="emp-skeleton h-40 w-full" />
      </div>
    );
  }

  // Sin perfil → RequireCuenta (en el layout) redirige a /entrar; mientras, esqueleto
  if (!perfil) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="emp-skeleton h-10 w-2/3" />
        <div className="emp-skeleton h-40 w-full" />
      </div>
    );
  }

  return <Panel perfil={perfil} runs={runs} onChange={refresh} />;
}

/* ================= Panel ================= */

function Panel({ perfil, runs, onChange }: { perfil: Perfil; runs: RunLog[]; onChange: () => void }) {
  const s = computeStats(runs);
  const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const hoy = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return (
    <section className="emp-in">
      {/* Saludo */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs emp-dim">{hoy}</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
            Hola, <span className="emp-grad-text">{perfil.nombre}</span>
          </h1>
        </div>
        <span className="emp-badge" style={{ borderColor: 'rgba(91,140,255,.4)', background: 'rgba(91,140,255,.14)' }}>
          <Ic name="medal" size={14} /> Nivel {s.nivelIdx + 1} · {s.nivel.nombre}
        </span>
      </div>

      {/* Rumbo al objetivo (capital) */}
      <CapitalCard perfil={perfil} onChange={onChange} />

      {/* Plan día a día */}
      {perfil.brief && <PlanCard perfil={perfil} onChange={onChange} />}

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-4 emp-stagger">
        <Kpi c="linear-gradient(90deg,#5b8cff,#22d3ee)" icon="brain" label="Análisis hechos" num={String(s.total)} sub="guardados en tu panel" />
        <Kpi c="linear-gradient(90deg,#f59e0b,#fbbf24)" icon="star" label="Nota media" num={s.notaMedia !== null ? `${s.notaMedia}` : '—'} sub="de tus ideas" extra={s.notaMedia !== null ? '/10' : ''} />
        <Kpi c="linear-gradient(90deg,#f43f5e,#fb923c)" icon="flame" label="Racha" num={String(s.racha)} sub="seguidos dándole" extra={s.racha === 1 ? ' día' : ' días'} />
        <div className="emp-kpi" style={{ ['--kpi-c' as string]: 'linear-gradient(90deg,#22c55e,#14b8a6)' }}>
          <div className="text-xs emp-dim mb-1.5 flex items-center gap-1.5"><Ic name="medal" size={13} /> Nivel {s.nivelIdx + 1}</div>
          <div className="text-lg font-black text-white leading-tight">{s.nivel.nombre}</div>
          <div className="emp-bar mt-2" style={{ height: 6 }}>
            <i style={{ width: `${s.pctNivel}%` }} />
          </div>
          <div className="text-[11px] emp-dim mt-1">
            {s.siguiente ? `${s.xp} XP · ${s.siguiente.xp - s.xp} para ${s.siguiente.nombre}` : `${s.xp} XP · nivel máximo`}
          </div>
        </div>
      </div>

      {/* Notas + historial de conversaciones */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <NotasCard s={s} />
        <HistorialCard runs={runs} />
      </div>

      {/* Tu perfil (lo que contaste al registrarte) */}
      <PerfilCard perfil={perfil} />
    </section>
  );
}

function Kpi({ c, icon, label, num, sub, extra }: { c: string; icon: IconName; label: string; num: string; sub: string; extra?: string }) {
  return (
    <div className="emp-kpi" style={{ ['--kpi-c' as string]: c }}>
      <div className="text-xs emp-dim mb-1.5 flex items-center gap-1.5"><Ic name={icon} size={13} /> {label}</div>
      <div className="emp-kpi-num">
        {num}
        {extra && <span className="text-sm font-bold emp-dim">{extra}</span>}
      </div>
      <div className="text-[11px] emp-dim mt-1">{sub}</div>
    </div>
  );
}

/* ---------- Rumbo al objetivo ---------- */

function CapitalCard({ perfil, onChange }: { perfil: Perfil; onChange: () => void }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(String(perfil.ingresosActuales || ''));
  const pct = Math.min(100, Math.round((perfil.ingresosActuales / perfil.objetivoMensual) * 100));

  function guardar() {
    const n = Math.max(0, Number(valor) || 0);
    updatePerfil({ ingresosActuales: n });
    setEditando(false);
    onChange();
  }

  return (
    <div className="emp-card p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40" style={{ background: 'radial-gradient(80% 120% at 0% 0%, rgba(91,140,255,.2), transparent 60%)' }} />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Ic name="route" size={17} className="emp-dim" /> Rumbo a tu objetivo
        </h3>
        <span className="text-xs emp-dim">{pct}% del camino</span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          {editando ? (
            <span className="inline-flex items-center gap-2">
              <input
                autoFocus
                type="number"
                className="emp-input !py-1.5 !px-3 w-32 text-lg font-black"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && guardar()}
              />
              <button onClick={guardar} className="emp-btn text-xs px-3 py-2"><Ic name="check" size={14} /></button>
            </span>
          ) : (
            <button onClick={() => setEditando(true)} className="group text-left" title="Actualizar mis ingresos">
              <span className="text-3xl md:text-4xl font-black text-white">{perfil.ingresosActuales.toLocaleString('es-ES')} €</span>
              <span className="emp-dim text-sm">/mes ahora</span>
              <Ic name="pen" size={13} className="inline-block ml-2 emp-dim opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-black emp-grad-text">{perfil.objetivoMensual.toLocaleString('es-ES')} €/mes</div>
          <div className="text-[11px] emp-dim">tu objetivo</div>
        </div>
      </div>

      <div className="emp-bar" style={{ height: 12 }}>
        <i style={{ width: `${Math.max(2, pct)}%` }} />
      </div>

      {/* Hitos de la ruta */}
      {perfil.brief?.ruta && perfil.brief.ruta.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          {perfil.brief.ruta.map((h, i) => (
            <div key={i} className="emp-inner p-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Ic name="flag" size={12} className="emp-dim" /> {h.hito}
              </div>
              <div className="text-[11px] emp-dim mt-1 leading-snug">{h.como}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] emp-dim mt-3">Toca la cifra para actualizar lo que facturas — la barra avanza contigo.</p>
    </div>
  );
}

/* ---------- Plan día a día ---------- */

function PlanCard({ perfil, onChange }: { perfil: Perfil; onChange: () => void }) {
  const brief = perfil.brief!;
  const hechas = new Set(perfil.accionesHechas);
  const [verDiagnostico, setVerDiagnostico] = useState(false);
  const [regenerando, setRegenerando] = useState(false);

  const pendientes = brief.acciones.map((a, i) => ({ a, i })).filter(({ i }) => !hechas.has(i));
  const completadas = brief.acciones.length - pendientes.length;
  const hoy = pendientes[0] ?? null;
  const siguientes = pendientes.slice(1);
  const fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });

  function toggle(idx: number) {
    const esHecha = hechas.has(idx);
    const nuevas = esHecha ? perfil.accionesHechas.filter((x) => x !== idx) : [...perfil.accionesHechas, idx];
    const fechas = { ...(perfil.accionesFechas ?? {}) };
    if (esHecha) delete fechas[idx];
    else fechas[idx] = Date.now();
    updatePerfil({ accionesHechas: nuevas, accionesFechas: fechas });
    onChange();
  }

  async function regenerar() {
    setRegenerando(true);
    try {
      const res = await fetch('/api/emprende/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: perfil.nombre,
          area: perfil.area,
          experiencia: `${perfil.experiencia}. Ya completó su plan anterior (foco: ${brief.focoSemana}) y factura ${perfil.ingresosActuales}€/mes.`,
          dineroDisponible: perfil.dineroDisponible,
          objetivoMensual: perfil.objetivoMensual,
          horasSemana: perfil.horasSemana,
          bloqueo: perfil.bloqueo,
        }),
      });
      const j = await res.json();
      if (res.ok) {
        updatePerfil({ brief: j.resultado, accionesHechas: [], accionesFechas: {} });
        onChange();
      }
    } finally {
      setRegenerando(false);
    }
  }

  return (
    <div className="emp-card p-6 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Ic name="target" size={17} className="emp-dim" /> Tu plan, día a día
        </h3>
        <span className="text-xs emp-dim">{completadas}/{brief.acciones.length} hechas</span>
      </div>

      <p className="text-base md:text-lg font-bold emp-grad-text leading-snug">{brief.focoSemana}</p>

      {hoy ? (
        <>
          {/* Objetivo de HOY */}
          <div
            className="mt-4 rounded-2xl p-4 border relative overflow-hidden"
            style={{ borderColor: 'rgba(34,211,238,.35)', background: 'linear-gradient(120deg, rgba(91,140,255,.14), rgba(34,211,238,.10))' }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Ic name="zap" size={12} /> Objetivo de hoy · {fechaHoy}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggle(hoy.i)}
                className="grid h-6 w-6 place-items-center rounded-lg border shrink-0 mt-0.5 transition-colors hover:border-cyan-300"
                style={{ borderColor: 'rgba(255,255,255,.3)' }}
                title="Marcar como hecho"
              />
              <p className="text-[15px] font-semibold text-white leading-snug">{hoy.a}</p>
            </div>
            <button onClick={() => toggle(hoy.i)} className="emp-btn text-xs px-4 py-2 mt-3">
              <Ic name="check" size={13} /> Hecho
            </button>
          </div>

          {/* Los siguientes días */}
          {siguientes.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] emp-dim mb-2 font-semibold uppercase tracking-wider">Después</div>
              <div className="space-y-2">
                {siguientes.map(({ a, i }) => (
                  <button key={i} onClick={() => toggle(i)} className="w-full text-left emp-inner px-3.5 py-2.5 flex items-start gap-3 hover:border-white/20 transition-colors opacity-80">
                    <span className="grid h-5 w-5 place-items-center rounded-md border shrink-0 mt-0.5" style={{ borderColor: 'rgba(255,255,255,.2)' }} />
                    <span className="text-sm text-white/75">{a}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] emp-dim mt-3">
            Lo que no termines hoy pasa a mañana automáticamente — sin dramas, pero sin escaparse.
          </p>
        </>
      ) : (
        /* Plan completado → generar el siguiente */
        <div className="mt-4 rounded-2xl p-5 border text-center" style={{ borderColor: 'rgba(34,197,94,.35)', background: 'rgba(34,197,94,.08)' }}>
          <Ic name="medal" size={26} className="text-emerald-400 mx-auto mb-2" />
          <p className="font-bold text-white">Plan completado. Enorme.</p>
          <p className="text-sm emp-dim mt-1">Toca subir el listón: pide a la IA tu siguiente plan.</p>
          <button onClick={regenerar} disabled={regenerando} className="emp-btn text-sm mt-4 px-6">
            {regenerando ? 'Creando tu siguiente plan...' : 'Generar mi siguiente plan'}
          </button>
        </div>
      )}

      {/* Completadas (colapsadas) */}
      {completadas > 0 && hoy && (
        <details className="mt-3">
          <summary className="text-xs emp-dim cursor-pointer hover:text-white transition-colors">
            ✓ {completadas} completada{completadas === 1 ? '' : 's'}
          </summary>
          <div className="mt-2 space-y-1.5">
            {brief.acciones.map((a, i) =>
              hechas.has(i) ? (
                <button key={i} onClick={() => toggle(i)} className="w-full text-left text-xs emp-dim line-through px-3 py-1.5 hover:text-white/70">
                  {a}
                </button>
              ) : null
            )}
          </div>
        </details>
      )}

      <div className="mt-4 rounded-2xl p-4 border" style={{ borderColor: 'rgba(34,211,238,.25)', background: 'linear-gradient(120deg, rgba(91,140,255,.12), rgba(34,211,238,.08))' }}>
        <p className="text-sm text-white/85 italic">"{brief.consejo}"</p>
      </div>

      <button onClick={() => setVerDiagnostico(!verDiagnostico)} className="text-xs emp-dim mt-3 hover:text-white transition-colors">
        {verDiagnostico ? '− Ocultar mi diagnóstico' : '+ Ver mi diagnóstico'}
      </button>
      {verDiagnostico && <p className="text-sm emp-dim mt-2 leading-relaxed emp-step-in">{brief.diagnostico}</p>}
    </div>
  );
}

/* ---------- Últimas notas ---------- */

function NotasCard({ s }: { s: ReturnType<typeof computeStats> }) {
  return (
    <div className="emp-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Ic name="chart" size={15} className="emp-dim" /> Tus últimas notas
        </h3>
        {s.notaMedia !== null && <span className="text-xs emp-dim">media {s.notaMedia}/10</span>}
      </div>
      {s.ultimasNotas.length > 0 ? (
        <>
          <div className="emp-chart">
            {s.ultimasNotas.map((r, i) => (
              <div
                key={i}
                title={`${r.nota}/10`}
                style={{ height: `${(r.nota! / 10) * 100}%`, ['--bar-c' as string]: notaColor(r.nota!), animationDelay: `${i * 70}ms` }}
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
          <Ic name="target" size={28} className="emp-dim mx-auto mb-2" />
          <p className="text-sm emp-dim">Valida tu primera idea y aquí verás la evolución de tus notas.</p>
          <Link href="/emprende/validar" className="emp-btn-ghost text-xs px-4 py-2 mt-3 inline-flex">
            Validar una idea →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------- Historial de conversaciones ---------- */

function HistorialCard({ runs }: { runs: RunLog[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const convos = [...runs].reverse(); // más recientes primero

  return (
    <div className="emp-card p-5">
      <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
        <Ic name="history" size={15} className="emp-dim" /> Tus conversaciones con la IA
      </h3>
      {convos.length > 0 ? (
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
          {convos.map((r, i) => {
            const m = getModulo(r.slug);
            if (!m) return null;
            const abiertaEsta = abierta === i;
            const tieneDetalle = r.output !== undefined;
            return (
              <div key={i}>
                <button
                  onClick={() => tieneDetalle && setAbierta(abiertaEsta ? null : i)}
                  className="w-full flex items-center gap-3 emp-inner px-3.5 py-2.5 hover:border-white/20 transition-colors text-left"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg text-white shrink-0" style={{ background: gradCss(m.grad) }}>
                    <Ic name={m.icon as IconName} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white truncate">{m.nombre}</span>
                    <span className="block text-[11px] emp-dim truncate">
                      {haceCuanto(r.t)}
                      {r.input && ` · ${resumenInput(r.input)}`}
                    </span>
                  </span>
                  {typeof r.nota === 'number' && (
                    <span className="text-sm font-black shrink-0" style={{ color: notaColor(r.nota) }}>
                      {r.nota}/10
                    </span>
                  )}
                  {tieneDetalle && (
                    <Ic name="arrowRight" size={14} className={`emp-dim shrink-0 transition-transform ${abiertaEsta ? 'rotate-90' : ''}`} />
                  )}
                </button>
                {abiertaEsta && tieneDetalle && (
                  <div className="mt-2 emp-step-in">
                    <Resultado slug={r.slug as ModuloSlug} data={r.output} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center">
          <Ic name="history" size={28} className="emp-dim mx-auto mb-2" />
          <p className="text-sm emp-dim">Cada análisis que hagas se guardará aquí, con su conversación completa.</p>
          <Link href="/emprende/que-negocio" className="emp-btn text-xs px-4 py-2 mt-3 inline-flex">
            Hacer el primero →
          </Link>
        </div>
      )}
    </div>
  );
}

function PerfilCard({ perfil }: { perfil: Perfil }) {
  const [abierto, setAbierto] = useState(false);
  const filas: { icon: IconName; k: string; v: string }[] = [
    { icon: 'briefcase', k: 'Área', v: perfil.area },
    { icon: 'flag', k: 'Punto de partida', v: perfil.experiencia },
    { icon: 'wallet', k: 'Capital para invertir', v: `${perfil.dineroDisponible.toLocaleString('es-ES')} €` },
    { icon: 'trending', k: 'Objetivo', v: `${perfil.objetivoMensual.toLocaleString('es-ES')} €/mes` },
    { icon: 'clock', k: 'Tiempo disponible', v: `${perfil.horasSemana} h/semana` },
    { icon: 'zap', k: 'Lo que más te frena', v: perfil.bloqueo },
  ];
  return (
    <div className="emp-card p-5 mt-4">
      <button onClick={() => setAbierto(!abierto)} className="w-full flex items-center justify-between gap-3 text-left">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Ic name="user" size={15} className="emp-dim" /> Tu perfil
          <span className="emp-dim font-normal">— lo que me contaste al crear tu cuenta</span>
        </h3>
        <Ic name="arrowRight" size={14} className={`emp-dim shrink-0 transition-transform ${abierto ? 'rotate-90' : ''}`} />
      </button>
      {abierto && (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 mt-4 emp-step-in">
          {filas.map((f) => (
            <div key={f.k} className="emp-inner p-3">
              <div className="text-[11px] emp-dim flex items-center gap-1.5">
                <Ic name={f.icon} size={11} /> {f.k}
              </div>
              <div className="text-sm font-semibold text-white mt-1 leading-snug">{f.v}</div>
            </div>
          ))}
        </div>
      )}
      {abierto && (
        <p className="text-[11px] emp-dim mt-3">
          Tu plan y tu ruta se generaron con estos datos. Para cambiarlos, crea una cuenta nueva desde la pantalla de entrada.
        </p>
      )}
    </div>
  );
}

function resumenInput(input: Record<string, unknown>): string {
  const texto = (input.idea ?? input.negocio ?? input.skills ?? Object.values(input)[0] ?? '') as string;
  const s = String(texto);
  return s.length > 42 ? s.slice(0, 42) + '…' : s;
}
