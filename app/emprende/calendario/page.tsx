'use client';
/**
 * Calendario del emprendedor: en cada día se ve lo que hiciste (análisis,
 * acciones del plan completadas) y lo que apuntas tú (notas/citas propias).
 */
import { useEffect, useMemo, useState } from 'react';
import { getModulo, gradCss } from '@/lib/emprende/catalog';
import { Ic, type IconName } from '../icons';
import { getRuns, type RunLog } from '../stats';
import { getPerfil, type Perfil } from '../perfil';
import { getEventos, addEvento, delEvento, type Evento } from '../eventos';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarioPage() {
  const [hoy] = useState(() => new Date());
  const [mes, setMes] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [sel, setSel] = useState<string>(() => ymd(new Date()));
  const [runs, setRuns] = useState<RunLog[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [nuevo, setNuevo] = useState('');

  useEffect(() => {
    setRuns(getRuns());
    setPerfil(getPerfil());
    setEventos(getEventos());
  }, []);

  // índices por día
  const porDia = useMemo(() => {
    const m = new Map<string, { runs: RunLog[]; acciones: string[]; eventos: Evento[] }>();
    const get = (k: string) => {
      if (!m.has(k)) m.set(k, { runs: [], acciones: [], eventos: [] });
      return m.get(k)!;
    };
    for (const r of runs) get(ymd(new Date(r.t))).runs.push(r);
    const fechas = perfil?.accionesFechas ?? {};
    for (const [idx, t] of Object.entries(fechas)) {
      const texto = perfil?.brief?.acciones[Number(idx)];
      if (texto) get(ymd(new Date(t))).acciones.push(texto);
    }
    for (const ev of eventos) get(ev.fecha).eventos.push(ev);
    return m;
  }, [runs, perfil, eventos]);

  // rejilla del mes (lunes primero)
  const celdas = useMemo(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const offset = (primero.getDay() + 6) % 7; // lunes = 0
    const nDias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= nDias; d++) arr.push(new Date(mes.getFullYear(), mes.getMonth(), d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [mes]);

  const detalle = porDia.get(sel) ?? { runs: [], acciones: [], eventos: [] };
  const selDate = new Date(sel + 'T12:00:00');
  const tituloSel = selDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  function apuntar() {
    const t = nuevo.trim();
    if (!t) return;
    setEventos(addEvento(sel, t));
    setNuevo('');
  }

  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6 emp-in">
        <div>
          <div className="text-xs emp-dim flex items-center gap-1.5">
            <Ic name="calendar" size={13} /> Tu organización
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">Calendario</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} className="emp-btn-ghost !p-2.5" title="Mes anterior">
            <Ic name="arrowRight" size={15} className="rotate-180" />
          </button>
          <span className="font-bold text-white min-w-36 text-center">
            {MESES[mes.getMonth()]} {mes.getFullYear()}
          </span>
          <button onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} className="emp-btn-ghost !p-2.5" title="Mes siguiente">
            <Ic name="arrowRight" size={15} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* Rejilla del mes */}
        <div className="emp-card p-4 md:p-5 emp-in">
          <div className="grid grid-cols-7 mb-2">
            {DIAS.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider emp-dim py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {celdas.map((d, i) => {
              if (!d) return <div key={i} />;
              const k = ymd(d);
              const info = porDia.get(k);
              const esHoy = ymd(hoy) === k;
              const esSel = sel === k;
              return (
                <button
                  key={i}
                  onClick={() => setSel(k)}
                  className="aspect-square rounded-xl border text-sm relative transition-all hover:border-white/30"
                  style={{
                    borderColor: esSel ? 'rgba(34,211,238,.7)' : 'rgba(255,255,255,.08)',
                    background: esSel
                      ? 'linear-gradient(135deg, rgba(91,140,255,.2), rgba(34,211,238,.14))'
                      : esHoy
                        ? 'rgba(91,140,255,.10)'
                        : 'rgba(255,255,255,.02)',
                  }}
                >
                  <span className={`absolute top-1.5 left-0 right-0 text-center font-semibold ${esHoy ? 'emp-grad-text' : esSel ? 'text-white' : 'text-white/70'}`}>
                    {d.getDate()}
                  </span>
                  {info && (
                    <span className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
                      {info.runs.length > 0 && <i className="h-1.5 w-1.5 rounded-full" style={{ background: '#22d3ee' }} />}
                      {info.acciones.length > 0 && <i className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />}
                      {info.eventos.length > 0 && <i className="h-1.5 w-1.5 rounded-full" style={{ background: '#f59e0b' }} />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-[11px] emp-dim">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full inline-block" style={{ background: '#22d3ee' }} /> Análisis con la IA</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full inline-block" style={{ background: '#22c55e' }} /> Objetivos completados</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full inline-block" style={{ background: '#f59e0b' }} /> Tus notas</span>
          </div>
        </div>

        {/* Detalle del día */}
        <div className="emp-card p-5 emp-in">
          <h2 className="font-bold text-white capitalize">{tituloSel}</h2>

          {/* Añadir nota */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              className="emp-input !py-2.5 text-sm flex-1"
              placeholder="Apunta algo para este día..."
              value={nuevo}
              onChange={(e) => setNuevo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apuntar()}
            />
            <button onClick={apuntar} disabled={!nuevo.trim()} className="emp-btn text-sm px-4">
              <Ic name="check" size={15} />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {detalle.eventos.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider emp-dim mb-2 flex items-center gap-1.5">
                  <Ic name="pen" size={11} /> Tus notas
                </div>
                <div className="space-y-2">
                  {detalle.eventos.map((ev) => (
                    <div key={ev.id} className="emp-inner px-3.5 py-2.5 flex items-start gap-2.5 group">
                      <i className="h-2 w-2 rounded-full shrink-0 mt-1.5" style={{ background: '#f59e0b' }} />
                      <span className="text-sm text-white/90 flex-1">{ev.texto}</span>
                      <button onClick={() => setEventos(delEvento(ev.id))} className="emp-dim opacity-0 group-hover:opacity-100 hover:text-white transition-all" title="Borrar">
                        <Ic name="x" size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detalle.acciones.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider emp-dim mb-2 flex items-center gap-1.5">
                  <Ic name="check" size={11} /> Objetivos completados
                </div>
                <div className="space-y-2">
                  {detalle.acciones.map((a, i) => (
                    <div key={i} className="emp-inner px-3.5 py-2.5 flex items-start gap-2.5">
                      <Ic name="check" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-white/85">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detalle.runs.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider emp-dim mb-2 flex items-center gap-1.5">
                  <Ic name="brain" size={11} /> Análisis con la IA
                </div>
                <div className="space-y-2">
                  {detalle.runs.map((r, i) => {
                    const m = getModulo(r.slug);
                    if (!m) return null;
                    return (
                      <div key={i} className="emp-inner px-3.5 py-2.5 flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-lg text-white shrink-0" style={{ background: gradCss(m.grad) }}>
                          <Ic name={m.icon as IconName} size={13} />
                        </span>
                        <span className="text-sm text-white/90 flex-1 truncate">{m.nombre}</span>
                        {typeof r.nota === 'number' && (
                          <span className="text-xs font-black shrink-0" style={{ color: r.nota >= 7 ? '#22c55e' : r.nota >= 5 ? '#f59e0b' : '#f43f5e' }}>
                            {r.nota}/10
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {detalle.eventos.length === 0 && detalle.acciones.length === 0 && detalle.runs.length === 0 && (
              <p className="text-sm emp-dim text-center py-4">
                Nada en este día todavía. Apunta algo arriba o dale caña al plan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
