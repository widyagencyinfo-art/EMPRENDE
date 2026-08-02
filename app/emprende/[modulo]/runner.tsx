'use client';
import { useEffect, useState } from 'react';
import { getModulo, gradCss, type ModuloSlug } from '@/lib/emprende/catalog';

type Fields = Record<string, string | number>;

type Campo = { name: string; label: string; type: 'text' | 'textarea' | 'number'; placeholder: string };
type Ejemplo = { label: string; values: Fields };

const CONFIG: Record<
  ModuloSlug,
  { campos: Campo[]; cta: string; ejemplos: Ejemplo[] }
> = {
  'que-negocio': {
    cta: 'Descubrir mi negocio',
    campos: [
      { name: 'skills', label: '¿Qué se te da bien?', type: 'textarea', placeholder: 'Diseño, hablar con gente, programar, redes sociales...' },
      { name: 'horasSemana', label: 'Horas por semana que puedes dedicar', type: 'number', placeholder: '10' },
      { name: 'presupuesto', label: 'Presupuesto para empezar (€)', type: 'number', placeholder: '300' },
      { name: 'intereses', label: '¿Qué te interesa o te gusta?', type: 'textarea', placeholder: 'Moda, fitness, tecnología, ayudar a negocios locales...' },
    ],
    ejemplos: [
      { label: '🎨 Creativo con redes', values: { skills: 'Diseño gráfico, edición de vídeo y redes sociales', horasSemana: 15, presupuesto: 300, intereses: 'Moda, marcas locales y contenido' } },
      { label: '💻 Perfil técnico', values: { skills: 'Programar webs y automatizaciones', horasSemana: 20, presupuesto: 500, intereses: 'Ayudar a negocios locales con tecnología' } },
    ],
  },
  validar: {
    cta: 'Validar mi idea',
    campos: [{ name: 'idea', label: 'Tu idea de negocio', type: 'textarea', placeholder: 'Una app que conecta dueños de perros con paseadores de confianza...' }],
    ejemplos: [
      { label: '🐕 App de paseadores', values: { idea: 'Una app que conecta dueños de perros con paseadores de confianza cerca de casa' } },
      { label: '🥗 Meal prep saludable', values: { idea: 'Servicio de comida saludable semanal preparada para oficinistas ocupados' } },
      { label: '👕 Ropa con diseños propios', values: { idea: 'Tienda online de camisetas con diseños propios sobre cultura urbana' } },
    ],
  },
  roast: {
    cta: 'Que me destrocen 💀',
    campos: [{ name: 'idea', label: 'Suelta tu idea (sin miedo)', type: 'textarea', placeholder: 'Vender cubitos de hielo premium para gente ocupada...' }],
    ejemplos: [
      { label: '🧊 Hielo premium', values: { idea: 'Vender cubitos de hielo premium para gente ocupada' } },
      { label: '🐱 Red social de gatos', values: { idea: 'Una red social solo para gatos' } },
    ],
  },
  simulador: {
    cta: 'Calcular lo que puedo ganar',
    campos: [
      { name: 'negocio', label: 'Tu negocio', type: 'textarea', placeholder: 'Agencia de gestión de redes sociales para restaurantes locales' },
      { name: 'precio', label: '¿Cuánto vas a cobrar?', type: 'text', placeholder: '400€/mes por cliente' },
    ],
    ejemplos: [
      { label: '📱 Agencia de redes', values: { negocio: 'Agencia de gestión de redes sociales para restaurantes locales', precio: '400€/mes por cliente' } },
      { label: '🌐 Webs para negocios', values: { negocio: 'Diseño de webs para negocios locales sin presencia online', precio: '50€ la web + 50€/mes de mantenimiento' } },
    ],
  },
  reto: {
    cta: 'Generar mi reto de 30 días',
    campos: [{ name: 'negocio', label: 'Tu negocio', type: 'textarea', placeholder: 'Tienda online de camisetas con diseños propios' }],
    ejemplos: [
      { label: '👕 Tienda de camisetas', values: { negocio: 'Tienda online de camisetas con diseños propios' } },
      { label: '☕ Cafetería de especialidad', values: { negocio: 'Cafetería de especialidad para llevar en zona de oficinas' } },
    ],
  },
};

const FRASES_PENSANDO = [
  'Analizando tu idea a fondo...',
  'Mirando el tamaño del mercado...',
  'Estudiando a la competencia...',
  'Buscando el ángulo ganador...',
  'Echando las cuentas reales...',
  'Puliendo los últimos detalles 🔥',
];

export function Runner({ slug }: { slug: ModuloSlug }) {
  const modulo = getModulo(slug)!;
  const config = CONFIG[slug];
  const [fields, setFields] = useState<Fields>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const body: Fields = {};
      for (const c of config.campos) {
        body[c.name] = c.type === 'number' ? Number(fields[c.name] || 0) : (fields[c.name] ?? '');
      }
      const res = await fetch(`/api/emprende/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setResultado(data.resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-5 md:p-10">
      {/* Cabecera */}
      <div className="emp-in">
        <div
          className="rounded-3xl p-6 md:p-7 relative overflow-hidden border"
          style={{
            borderColor: 'rgba(255,255,255,.1)',
            background: `radial-gradient(120% 140% at 100% 0%, ${modulo.grad[1]}2e, transparent 55%), radial-gradient(120% 140% at 0% 100%, ${modulo.grad[0]}26, transparent 55%), rgba(255,255,255,.03)`,
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-3xl text-white shrink-0"
              style={{ background: gradCss(modulo.grad), boxShadow: '0 12px 26px -8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.35)' }}
            >
              {modulo.emoji}
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{modulo.nombre}</h1>
              <p className="emp-dim text-sm mt-0.5">{modulo.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="emp-card p-5 md:p-6 space-y-5 mt-5 emp-in">
        {config.campos.map((c) => (
          <div key={c.name}>
            <label className="text-sm font-semibold mb-1.5 block text-white">{c.label}</label>
            {c.type === 'textarea' ? (
              <textarea
                className="emp-input min-h-[92px] resize-none"
                placeholder={c.placeholder}
                value={(fields[c.name] as string) ?? ''}
                onChange={(e) => setFields((f) => ({ ...f, [c.name]: e.target.value }))}
                required
              />
            ) : (
              <input
                type={c.type}
                className="emp-input"
                placeholder={c.placeholder}
                value={(fields[c.name] as string) ?? ''}
                onChange={(e) => setFields((f) => ({ ...f, [c.name]: e.target.value }))}
                required
              />
            )}
          </div>
        ))}

        {/* Chips de ejemplo */}
        {config.ejemplos.length > 0 && (
          <div>
            <div className="text-xs emp-dim mb-2">¿Sin inspiración? Prueba con un ejemplo:</div>
            <div className="flex flex-wrap gap-2">
              {config.ejemplos.map((ej) => (
                <button
                  key={ej.label}
                  type="button"
                  className="emp-pill"
                  onClick={() => setFields(ej.values)}
                >
                  {ej.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="emp-btn w-full text-sm">
          {loading ? <Pensando /> : config.cta}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.12)', color: '#fda4af' }}>
          {error}
        </div>
      )}

      {loading && !resultado && <LoadingCard grad={modulo.grad} />}

      {resultado && (
        <div className="mt-6 emp-in">
          <Resultado slug={slug} data={resultado} />
        </div>
      )}
    </div>
  );
}

function Pensando() {
  return (
    <span className="emp-thinking text-white">
      Pensando
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </span>
  );
}

function LoadingCard({ grad }: { grad: readonly [string, string] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FRASES_PENSANDO.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-6 emp-card p-6 emp-in">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl text-lg shrink-0"
          style={{ background: gradCss(grad) }}
        >
          🤖
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{FRASES_PENSANDO[i]}</p>
          <div className="emp-progress mt-2"><i /></div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <div className="emp-skeleton h-3 w-3/4" />
        <div className="emp-skeleton h-3 w-full" />
        <div className="emp-skeleton h-3 w-5/6" />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="emp-skeleton h-16" />
          <div className="emp-skeleton h-16" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Render de resultados ---------------- */

function notaColor(n: number) {
  return n >= 7 ? '#22c55e' : n >= 5 ? '#f59e0b' : '#f43f5e';
}

function Ring({ n }: { n: number }) {
  return (
    <div
      className="emp-ring shrink-0"
      style={{ ['--ring-val' as string]: n * 10, ['--ring-color' as string]: notaColor(n) }}
    >
      <span className="text-center">
        <span className="block text-3xl font-black" style={{ color: notaColor(n) }}>
          {n}
        </span>
        <span className="block text-[10px] emp-dim -mt-1">/10</span>
      </span>
    </div>
  );
}

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-2 text-white">{titulo}</h4>
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

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-1 text-white">{titulo}</h4>
      <p className="text-sm emp-dim leading-relaxed">{children}</p>
    </div>
  );
}

function ShareBtn({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  async function share() {
    const full = `${texto}\n\nHecho con Emprende 🚀`;
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
      {copiado ? '✓ Copiado' : '📤 Compartir'}
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

function Resultado({ slug, data }: { slug: ModuloSlug; data: any }) {
  if (slug === 'que-negocio') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-black text-white">{data.match}</h3>
            <ShareBtn texto={`Mi negocio ideal: ${data.match} (encaje ${data.encaje}%)`} />
          </div>
          <span className="emp-badge mt-3" style={{ borderColor: 'rgba(139,92,246,.4)', background: 'rgba(139,92,246,.16)', color: '#c4b5fd' }}>
            🎯 Encaje contigo: {data.encaje}%
          </span>
        </div>
        <Bloque titulo="Por qué encaja contigo">{data.porQue}</Bloque>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Potencial mensual" value={data.potencialMensual} />
          <Stat label="Arranque" value={data.tiempoArranque} />
        </div>
        <Lista titulo="Primeros pasos" items={data.primerosPasos} />
        <div>
          <h4 className="font-semibold text-sm mb-2 text-white">Alternativas</h4>
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
        <Bloque titulo="📊 Mercado">{data.mercado}</Bloque>
        <Bloque titulo="⚔️ Competencia">{data.competencia}</Bloque>
        <Bloque titulo="🎯 A quién vendérselo primero">{data.publicoIdeal}</Bloque>
        <Lista titulo="⚠️ Riesgos" items={data.riesgos} />
        <Lista titulo="✅ Primeros pasos para validarla" items={data.primerosPasos} />
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgba(217,70,239,.3)', background: 'linear-gradient(120deg, rgba(139,92,246,.16), rgba(217,70,239,.14))' }}>
          <h4 className="font-semibold text-sm mb-1 text-white">✨ El giro que la haría mejor</h4>
          <p className="text-sm text-white/85">{data.comoMejorarla}</p>
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
        <p className="text-base italic border-l-4 pl-4 py-1 text-white/90" style={{ borderColor: '#d946ef' }}>
          {data.roast}
        </p>
        <Lista titulo="Puntos débiles" items={data.puntosDebiles} />
        <div className="emp-inner p-4">
          <h4 className="font-semibold text-sm mb-1 text-white">🛟 Pero podría funcionar si...</h4>
          <p className="text-sm emp-dim">{data.peroPodriaFuncionarSi}</p>
        </div>
        <div
          className="rounded-2xl p-4 text-center font-semibold text-white"
          style={{ background: gradCss(['#d946ef', '#f43f5e']), boxShadow: '0 16px 34px -14px rgba(217,70,239,.6)' }}
        >
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
          <h3 className="text-lg font-black text-white">💰 Proyección de ingresos</h3>
          <ShareBtn
            texto={`Mi negocio podría dar ${
              data.escenarios.find((e: any) => /real/i.test(e.nombre))?.beneficioMes ??
              data.escenarios[0]?.beneficioMes
            }€/mes de beneficio`}
          />
        </div>
        <Lista titulo="Supuestos" items={data.supuestos} />
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
        <Bloque titulo="⏳ Recuperar la inversión">{data.mesesRecuperarInversion}</Bloque>
        <Lista titulo="🚀 Palancas para ganar más" items={data.palancas} />
      </div>
    );
  }

  if (slug === 'reto') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-white">🎯 {data.objetivo}</h3>
          <ShareBtn texto={`Mi reto de 30 días: ${data.objetivo}`} />
        </div>
        {data.semanas.map((s: any) => (
          <div key={s.semana} className="emp-inner p-4">
            <h4 className="font-semibold text-sm mb-2.5 flex items-center gap-2 text-white">
              <span
                className="inline-block rounded-lg px-2 py-0.5 text-xs text-white"
                style={{ background: gradCss(['#8b5cf6', '#d946ef']) }}
              >
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
        <div className="rounded-2xl p-4 text-white" style={{ background: gradCss(['#8b5cf6', '#d946ef']), boxShadow: '0 16px 34px -14px rgba(139,92,246,.6)' }}>
          <span className="font-semibold">🏁 Al día 30:</span> {data.hito}
        </div>
      </div>
    );
  }

  return null;
}
