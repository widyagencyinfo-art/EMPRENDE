'use client';
/**
 * Render de resultados de cada módulo — compartido entre el runner (respuesta
 * en vivo) y el historial del panel (conversaciones guardadas).
 */
import { useState } from 'react';
import { gradCss, type ModuloSlug } from '@/lib/emprende/catalog';
import { Ic, type IconName } from './icons';

export function notaColor(n: number) {
  return n >= 7 ? '#22c55e' : n >= 5 ? '#f59e0b' : '#f43f5e';
}

function Ring({ n }: { n: number }) {
  return (
    <div className="emp-ring shrink-0" style={{ ['--ring-val' as string]: n * 10, ['--ring-color' as string]: notaColor(n) }}>
      <span className="text-center">
        <span className="block text-3xl font-black" style={{ color: notaColor(n) }}>
          {n}
        </span>
        <span className="block text-[10px] emp-dim -mt-1">/10</span>
      </span>
    </div>
  );
}

function Titulo({ icon, children }: { icon?: IconName; children: React.ReactNode }) {
  return (
    <h4 className="font-semibold text-sm mb-2 text-white flex items-center gap-1.5">
      {icon && <Ic name={icon} size={15} className="emp-dim" />}
      {children}
    </h4>
  );
}

function Lista({ titulo, icon, items }: { titulo: string; icon?: IconName; items: string[] }) {
  return (
    <div>
      <Titulo icon={icon}>{titulo}</Titulo>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-sm flex gap-2.5 text-white/85">
            <span className="emp-grad-text font-bold shrink-0">→</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bloque({ titulo, icon, children }: { titulo: string; icon?: IconName; children: React.ReactNode }) {
  return (
    <div>
      <Titulo icon={icon}>{titulo}</Titulo>
      <p className="text-sm emp-dim leading-relaxed -mt-1">{children}</p>
    </div>
  );
}

function ShareBtn({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  async function share() {
    const full = `${texto}\n\nHecho con Rumbo`;
    try {
      if (navigator.share) {
        await navigator.share({ text: full });
      } else {
        await navigator.clipboard.writeText(full);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }
    } catch {
      /* cancelado */
    }
  }
  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors shrink-0"
    >
      <Ic name={copiado ? 'check' : 'arrowUpRight'} size={13} />
      {copiado ? 'Copiado' : 'Compartir'}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="emp-inner p-3.5">
      <div className="text-xs emp-dim">{label}</div>
      <div className="font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}

export function Resultado({ slug, data }: { slug: ModuloSlug; data: any }) {
  if (slug === 'que-negocio') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-black text-white">{data.match}</h3>
            <ShareBtn texto={`Mi negocio ideal: ${data.match} (encaje ${data.encaje}%)`} />
          </div>
          <span className="emp-badge mt-3" style={{ borderColor: 'rgba(91,140,255,.4)', background: 'rgba(91,140,255,.16)', color: '#b8ccff' }}>
            <Ic name="target" size={13} /> Encaje contigo: {data.encaje}%
          </span>
        </div>
        <Bloque titulo="Por qué encaja contigo">{data.porQue}</Bloque>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Potencial mensual" value={data.potencialMensual} />
          <Stat label="Arranque" value={data.tiempoArranque} />
        </div>
        <Lista titulo="Primeros pasos" icon="flag" items={data.primerosPasos} />
        <div>
          <Titulo icon="compass">Alternativas</Titulo>
          <div className="space-y-2">
            {data.alternativas.map((a: any, i: number) => (
              <p key={i} className="text-sm emp-inner px-3.5 py-2.5">
                <span className="font-semibold text-white">{a.negocio}</span>{' '}
                <span className="emp-dim">— {a.motivo}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'validar') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-center gap-4">
          <Ring n={data.nota} />
          <div className="min-w-0">
            <h3 className="text-lg font-black leading-tight text-white">{data.veredicto}</h3>
            <div className="mt-2">
              <ShareBtn texto={`Mi idea sacó un ${data.nota}/10 — ${data.veredicto}`} />
            </div>
          </div>
        </div>
        <hr className="emp-hr" />
        <Bloque titulo="Mercado" icon="chart">{data.mercado}</Bloque>
        <Bloque titulo="Competencia" icon="target">{data.competencia}</Bloque>
        <Bloque titulo="A quién vendérselo primero" icon="user">{data.publicoIdeal}</Bloque>
        <Lista titulo="Riesgos" icon="zap" items={data.riesgos} />
        <Lista titulo="Primeros pasos para validarla" icon="flag" items={data.primerosPasos} />
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(34,211,238,.3)', background: 'linear-gradient(120deg, rgba(91,140,255,.16), rgba(34,211,238,.12))' }}>
          <Titulo icon="lightbulb">El giro que la haría mejor</Titulo>
          <p className="text-sm text-white/85 -mt-1">{data.comoMejorarla}</p>
        </div>
      </div>
    );
  }

  if (slug === 'roast') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-center gap-4">
          <Ring n={data.nota} />
          <ShareBtn texto={data.fraseCompartible} />
        </div>
        <p className="text-base italic border-l-4 pl-4 py-1 text-white/90" style={{ borderColor: '#f43f5e' }}>
          {data.roast}
        </p>
        <Lista titulo="Puntos débiles" icon="flame" items={data.puntosDebiles} />
        <div className="emp-inner p-4">
          <Titulo icon="lightbulb">Pero podría funcionar si...</Titulo>
          <p className="text-sm emp-dim -mt-1">{data.peroPodriaFuncionarSi}</p>
        </div>
        <div className="rounded-2xl p-4 text-center font-semibold text-white" style={{ background: gradCss(['#f43f5e', '#fb923c']), boxShadow: '0 16px 34px -14px rgba(244,63,94,.6)' }}>
          “{data.fraseCompartible}”
        </div>
      </div>
    );
  }

  if (slug === 'simulador') {
    const max = Math.max(...data.escenarios.map((e: any) => e.ingresosMes), 1);
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Ic name="coins" size={18} className="emp-dim" /> Proyección de ingresos
          </h3>
          <ShareBtn
            texto={`Mi negocio podría dar ${
              data.escenarios.find((e: any) => /real/i.test(e.nombre))?.beneficioMes ?? data.escenarios[0]?.beneficioMes
            }€/mes de beneficio`}
          />
        </div>
        <Lista titulo="Supuestos" icon="check" items={data.supuestos} />
        <div className="space-y-4">
          {data.escenarios.map((e: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-white">{e.nombre}</span>
                <span className="emp-dim">
                  {e.clientesMes} clientes ·{' '}
                  <span className="font-semibold text-emerald-400">{e.beneficioMes}€/mes</span>
                </span>
              </div>
              <div className="emp-bar">
                <i style={{ width: `${Math.round((e.ingresosMes / max) * 100)}%` }} />
              </div>
              <div className="text-xs emp-dim mt-1">
                Ingresos {e.ingresosMes}€ · Costes {e.costesMes}€
              </div>
            </div>
          ))}
        </div>
        <Bloque titulo="Recuperar la inversión" icon="clock">{data.mesesRecuperarInversion}</Bloque>
        <Lista titulo="Palancas para ganar más" icon="trending" items={data.palancas} />
      </div>
    );
  }

  if (slug === 'reto') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Ic name="target" size={18} className="emp-dim shrink-0 mt-0.5" /> {data.objetivo}
          </h3>
          <ShareBtn texto={`Mi reto de 30 días: ${data.objetivo}`} />
        </div>
        {data.semanas.map((s: any) => (
          <div key={s.semana} className="emp-inner p-4">
            <h4 className="font-semibold text-sm mb-2.5 flex items-center gap-2 text-white">
              <span className="inline-block rounded-lg px-2 py-0.5 text-xs text-white" style={{ background: gradCss(['#8b5cf6', '#6366f1']) }}>
                Semana {s.semana}
              </span>
              {s.foco}
            </h4>
            <ul className="space-y-2">
              {s.tareas.map((t: string, i: number) => (
                <li key={i} className="text-sm flex gap-2.5 text-white/85">
                  <span className="emp-dim mt-0.5 shrink-0">☐</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded-2xl p-4 text-white" style={{ background: gradCss(['#8b5cf6', '#6366f1']), boxShadow: '0 16px 34px -14px rgba(99,102,241,.6)' }}>
          <span className="font-semibold">Al día 30:</span> {data.hito}
        </div>
      </div>
    );
  }

  return null;
}
