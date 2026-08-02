'use client';
import { useEffect, useState } from 'react';
import { getModulo, gradCss, type ModuloSlug } from '@/lib/emprende/catalog';

type Fields = Record<string, string | number>;

const CONFIG: Record<
  ModuloSlug,
  { campos: { name: string; label: string; type: 'text' | 'textarea' | 'number'; placeholder: string }[]; cta: string }
> = {
  'que-negocio': {
    cta: 'Descubrir mi negocio',
    campos: [
      { name: 'skills', label: '¿Qué se te da bien?', type: 'textarea', placeholder: 'Diseño, hablar con gente, programar, redes sociales...' },
      { name: 'horasSemana', label: 'Horas por semana que puedes dedicar', type: 'number', placeholder: '10' },
      { name: 'presupuesto', label: 'Presupuesto para empezar (€)', type: 'number', placeholder: '300' },
      { name: 'intereses', label: '¿Qué te interesa o te gusta?', type: 'textarea', placeholder: 'Moda, fitness, tecnología, ayudar a negocios locales...' },
    ],
  },
  validar: {
    cta: 'Validar mi idea',
    campos: [{ name: 'idea', label: 'Tu idea de negocio', type: 'textarea', placeholder: 'Una app que conecta dueños de perros con paseadores de confianza...' }],
  },
  roast: {
    cta: 'Que me destrocen 💀',
    campos: [{ name: 'idea', label: 'Suelta tu idea (sin miedo)', type: 'textarea', placeholder: 'Vender cubitos de hielo premium para gente ocupada...' }],
  },
  simulador: {
    cta: 'Calcular lo que puedo ganar',
    campos: [
      { name: 'negocio', label: 'Tu negocio', type: 'textarea', placeholder: 'Agencia de gestión de redes sociales para restaurantes locales' },
      { name: 'precio', label: '¿Cuánto vas a cobrar?', type: 'text', placeholder: '400€/mes por cliente' },
    ],
  },
  reto: {
    cta: 'Generar mi reto de 30 días',
    campos: [{ name: 'negocio', label: 'Tu negocio', type: 'textarea', placeholder: 'Tienda online de camisetas con diseños propios' }],
  },
};

const FRASES_PENSANDO = [
  'Analizando tu idea...',
  'Mirando el mercado...',
  'Buscando el ángulo ganador...',
  'Echando cuentas...',
  'Casi está 🔥',
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
      <div className="flex items-center gap-3 mb-6 emp-in">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl text-2xl text-white shrink-0"
          style={{ background: gradCss(modulo.grad) }}
        >
          {modulo.emoji}
        </span>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{modulo.nombre}</h1>
          <p className="text-muted-foreground text-sm">{modulo.tagline}</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="emp-card p-5 md:p-6 space-y-4 emp-in">
        {config.campos.map((c) => (
          <div key={c.name}>
            <label className="text-sm font-semibold mb-1.5 block">{c.label}</label>
            {c.type === 'textarea' ? (
              <textarea
                className="emp-input min-h-[84px] resize-none"
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
        <button type="submit" disabled={loading} className="emp-btn w-full py-3 text-sm">
          {loading ? <Pensando /> : config.cta}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !resultado && <LoadingCard />}

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

function LoadingCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FRASES_PENSANDO.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="mt-6 emp-card p-8 text-center emp-in">
      <div className="emp-thinking justify-center mb-3">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <p className="text-sm text-muted-foreground">{FRASES_PENSANDO[i]}</p>
    </div>
  );
}

/* ---------------- Render de resultados ---------------- */

function notaColor(n: number) {
  return n >= 7 ? '#16a34a' : n >= 5 ? '#f59e0b' : '#ef4444';
}

function Ring({ n }: { n: number }) {
  return (
    <div
      className="emp-ring"
      style={{ ['--ring-val' as string]: n * 10, ['--ring-color' as string]: notaColor(n) }}
    >
      <span className="text-center">
        <span className="block text-3xl font-black" style={{ color: notaColor(n) }}>
          {n}
        </span>
        <span className="block text-[10px] text-muted-foreground -mt-1">/10</span>
      </span>
    </div>
  );
}

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-1.5">{titulo}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm flex gap-2">
            <span className="emp-grad-text font-bold">→</span>
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
      <h4 className="font-semibold text-sm mb-1">{titulo}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
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
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
    >
      {copiado ? '✓ Copiado' : '📤 Compartir'}
    </button>
  );
}

function Resultado({ slug, data }: { slug: ModuloSlug; data: any }) {
  if (slug === 'que-negocio') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-black">{data.match}</h3>
            <ShareBtn texto={`Mi negocio ideal: ${data.match} (encaje ${data.encaje}%)`} />
          </div>
          <span className="emp-badge mt-2" style={{ background: '#7c3aed15', color: '#7c3aed' }}>
            Encaje contigo: {data.encaje}%
          </span>
        </div>
        <Bloque titulo="Por qué encaja contigo">{data.porQue}</Bloque>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-accent/50 p-3">
            <div className="text-xs text-muted-foreground">Potencial mensual</div>
            <div className="font-bold">{data.potencialMensual}</div>
          </div>
          <div className="rounded-xl bg-accent/50 p-3">
            <div className="text-xs text-muted-foreground">Arranque</div>
            <div className="font-bold">{data.tiempoArranque}</div>
          </div>
        </div>
        <Lista titulo="Primeros pasos" items={data.primerosPasos} />
        <div>
          <h4 className="font-semibold text-sm mb-1.5">Alternativas</h4>
          {data.alternativas.map((a: any, i: number) => (
            <p key={i} className="text-sm mb-1">
              <span className="font-medium">{a.negocio}</span>{' '}
              <span className="text-muted-foreground">— {a.motivo}</span>
            </p>
          ))}
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
            <h3 className="text-lg font-black leading-tight">{data.veredicto}</h3>
            <div className="mt-2">
              <ShareBtn texto={`Mi idea sacó un ${data.nota}/10 — ${data.veredicto}`} />
            </div>
          </div>
        </div>
        <Bloque titulo="Mercado">{data.mercado}</Bloque>
        <Bloque titulo="Competencia">{data.competencia}</Bloque>
        <Bloque titulo="A quién vendérselo primero">{data.publicoIdeal}</Bloque>
        <Lista titulo="Riesgos" items={data.riesgos} />
        <Lista titulo="Primeros pasos para validarla" items={data.primerosPasos} />
        <div className="rounded-xl p-4" style={{ background: 'linear-gradient(120deg,#7c3aed10,#d946ef10)' }}>
          <h4 className="font-semibold text-sm mb-1">✨ El giro que la haría mejor</h4>
          <p className="text-sm">{data.comoMejorarla}</p>
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
        <p className="text-base italic border-l-4 pl-4 py-1" style={{ borderColor: '#d946ef' }}>
          {data.roast}
        </p>
        <Lista titulo="Puntos débiles" items={data.puntosDebiles} />
        <div className="rounded-xl bg-accent/50 p-4">
          <h4 className="font-semibold text-sm mb-1">Pero podría funcionar si...</h4>
          <p className="text-sm text-muted-foreground">{data.peroPodriaFuncionarSi}</p>
        </div>
        <div
          className="rounded-xl p-4 text-center font-semibold text-white"
          style={{ background: gradCss(['#d946ef', '#f43f5e']) }}
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Proyección de ingresos</h3>
          <ShareBtn
            texto={`Mi negocio podría dar ${
              data.escenarios.find((e: any) => /real/i.test(e.nombre))?.beneficioMes ??
              data.escenarios[0]?.beneficioMes
            }€/mes de beneficio`}
          />
        </div>
        <Lista titulo="Supuestos" items={data.supuestos} />
        <div className="space-y-3">
          {data.escenarios.map((e: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{e.nombre}</span>
                <span className="text-muted-foreground">
                  {e.clientesMes} clientes ·{' '}
                  <span className="font-semibold text-green-600">{e.beneficioMes}€/mes</span>
                </span>
              </div>
              <div className="emp-bar">
                <i style={{ width: `${Math.round((e.ingresosMes / max) * 100)}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Ingresos {e.ingresosMes}€ · Costes {e.costesMes}€
              </div>
            </div>
          ))}
        </div>
        <Bloque titulo="Recuperar la inversión">{data.mesesRecuperarInversion}</Bloque>
        <Lista titulo="Palancas para ganar más" items={data.palancas} />
      </div>
    );
  }

  if (slug === 'reto') {
    return (
      <div className="emp-card p-6 space-y-5 emp-stagger">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black">🎯 {data.objetivo}</h3>
          <ShareBtn texto={`Mi reto de 30 días: ${data.objetivo}`} />
        </div>
        {data.semanas.map((s: any) => (
          <div key={s.semana} className="rounded-xl border p-4">
            <h4 className="font-semibold text-sm mb-2">
              <span
                className="inline-block rounded-md px-2 py-0.5 text-xs text-white mr-2"
                style={{ background: gradCss(['#8b5cf6', '#d946ef']) }}
              >
                Semana {s.semana}
              </span>
              {s.foco}
            </h4>
            <ul className="space-y-1.5">
              {s.tareas.map((t: string, i: number) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-muted-foreground mt-0.5">☐</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded-xl p-4 text-white" style={{ background: gradCss(['#8b5cf6', '#d946ef']) }}>
          <span className="font-semibold">Al día 30:</span> {data.hito}
        </div>
      </div>
    );
  }

  return null;
}
