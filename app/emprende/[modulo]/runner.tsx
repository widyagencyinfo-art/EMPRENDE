'use client';
import { useEffect, useRef, useState } from 'react';
import { getModulo, gradCss, type ModuloSlug } from '@/lib/emprende/catalog';

type Val = string | number;
type Answers = Record<string, Val>;

type Step =
  | {
      field: string;
      kind: 'text' | 'textarea';
      pregunta: string;
      sub?: string;
      placeholder: string;
      sugerencias?: string[];
    }
  | {
      field: string;
      kind: 'choice';
      pregunta: string;
      sub?: string;
      opciones: { emoji?: string; label: string; hint?: string; value: Val }[];
    };

// Cada módulo se convierte en una conversación de N preguntas.
const FLOWS: Record<ModuloSlug, { steps: Step[]; cta: string }> = {
  'que-negocio': {
    cta: 'Descubrir mi negocio',
    steps: [
      {
        field: 'skills',
        kind: 'textarea',
        pregunta: '¿Qué se te da bien?',
        sub: 'Tus habilidades, lo que la gente te pide o lo que disfrutas haciendo.',
        placeholder: 'Diseño, hablar con gente, programar, redes sociales...',
        sugerencias: ['Diseño y redes', 'Programar', 'Hablar y vender', 'Manualidades', 'Cocinar'],
      },
      {
        field: 'horasSemana',
        kind: 'choice',
        pregunta: '¿Cuánto tiempo puedes dedicarle?',
        sub: 'Sé realista: es mejor poco y constante.',
        opciones: [
          { emoji: '🌙', label: 'Ratos sueltos', hint: '~5 h/semana', value: 5 },
          { emoji: '⏰', label: 'Unas horas', hint: '~10 h/semana', value: 10 },
          { emoji: '🔥', label: 'En serio', hint: '~20 h/semana', value: 20 },
          { emoji: '🚀', label: 'A tope', hint: '40+ h/semana', value: 40 },
        ],
      },
      {
        field: 'presupuesto',
        kind: 'choice',
        pregunta: '¿Cuánto puedes invertir para arrancar?',
        sub: 'Hay negocios geniales a coste casi cero.',
        opciones: [
          { emoji: '🪙', label: 'A coste cero', hint: '0 €', value: 0 },
          { emoji: '💵', label: 'Poquito', hint: 'hasta 100 €', value: 100 },
          { emoji: '💶', label: 'Algo tengo', hint: '~300 €', value: 300 },
          { emoji: '💰', label: 'Voy en serio', hint: '500 € o más', value: 500 },
        ],
      },
      {
        field: 'intereses',
        kind: 'textarea',
        pregunta: '¿Qué temas te tiran?',
        sub: 'El sector donde te apetece trabajar. Vale más de uno.',
        placeholder: 'Moda, fitness, tecnología, ayudar a negocios locales...',
        sugerencias: ['Moda', 'Fitness y salud', 'Tecnología', 'Negocios locales', 'Comida', 'Gaming'],
      },
    ],
  },
  validar: {
    cta: 'Validar mi idea',
    steps: [
      {
        field: 'idea',
        kind: 'textarea',
        pregunta: '¿Cuál es tu idea?',
        sub: 'Descríbela en una o dos frases. Sin tecnicismos.',
        placeholder: 'Una app que conecta dueños de perros con paseadores de confianza...',
        sugerencias: ['🐕 App de paseadores', '🥗 Meal prep saludable', '👕 Ropa con diseños propios'],
      },
    ],
  },
  roast: {
    cta: 'Que me destrocen 💀',
    steps: [
      {
        field: 'idea',
        kind: 'textarea',
        pregunta: 'Suéltala. Sin miedo. 💀',
        sub: 'Cuanto más honesto seas, más duro (y útil) será el roast.',
        placeholder: 'Vender cubitos de hielo premium para gente ocupada...',
        sugerencias: ['🧊 Hielo premium', '🐱 Red social de gatos'],
      },
    ],
  },
  simulador: {
    cta: 'Calcular lo que puedo ganar',
    steps: [
      {
        field: 'negocio',
        kind: 'textarea',
        pregunta: '¿Qué negocio quieres simular?',
        sub: 'Cuéntame qué vendes y a quién.',
        placeholder: 'Agencia de gestión de redes sociales para restaurantes locales',
        sugerencias: ['📱 Agencia de redes', '🌐 Webs para negocios'],
      },
      {
        field: 'precio',
        kind: 'text',
        pregunta: '¿Cuánto vas a cobrar?',
        sub: 'Tu precio por cliente o por proyecto.',
        placeholder: '400€/mes por cliente',
        sugerencias: ['20€/mes', '50€ + 50€/mes', '400€/mes por cliente', '500€ el proyecto'],
      },
    ],
  },
  reto: {
    cta: 'Generar mi reto de 30 días',
    steps: [
      {
        field: 'negocio',
        kind: 'textarea',
        pregunta: '¿Qué negocio vas a lanzar?',
        sub: 'Te montaré un plan semana a semana para conseguir tus primeros clientes.',
        placeholder: 'Tienda online de camisetas con diseños propios',
        sugerencias: ['👕 Tienda de camisetas', '☕ Cafetería de especialidad'],
      },
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
  const flow = FLOWS[slug];
  const total = flow.steps.length;

  const [i, setI] = useState(0); // paso actual
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);

  const step = flow.steps[i];
  const isLast = i === total - 1;
  const current = answers[step.field];
  const filled = current !== undefined && String(current).trim() !== '';

  function set(field: string, value: Val) {
    setAnswers((a) => ({ ...a, [field]: value }));
  }

  function back() {
    if (i > 0) setI(i - 1);
  }

  async function next() {
    if (!filled) return;
    if (!isLast) {
      setI(i + 1);
      return;
    }
    await submit();
  }

  // Para opciones: seleccionar avanza (o envía) automáticamente.
  function pick(field: string, value: Val) {
    const nextAnswers = { ...answers, [field]: value };
    setAnswers(nextAnswers);
    setTimeout(() => {
      if (i < total - 1) setI(i + 1);
      else submit(nextAnswers);
    }, 260);
  }

  async function submit(over?: Answers) {
    const data = over ?? answers;
    setLoading(true);
    setError(null);
    setResultado(null);
    try {
      const res = await fetch(`/api/emprende/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error');
      setResultado(j.resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResultado(null);
    setError(null);
    setAnswers({});
    setI(0);
  }

  return (
    <div className="max-w-3xl mx-auto p-5 md:p-10">
      {/* Cabecera del módulo */}
      <div className="emp-in mb-5">
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

      {/* Estado: resultado */}
      {resultado ? (
        <div className="emp-in">
          <div className="flex items-center justify-between mb-4">
            <span className="emp-badge">✅ Listo</span>
            <button onClick={reset} className="emp-btn-ghost text-xs px-4 py-2">
              ↻ Volver a empezar
            </button>
          </div>
          <Resultado slug={slug} data={resultado} />
        </div>
      ) : loading ? (
        <LoadingCard grad={modulo.grad} />
      ) : (
        /* Estado: wizard */
        <div className="emp-card p-6 md:p-8">
          {/* Progreso (solo si hay más de un paso) */}
          {total > 1 && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold emp-dim">
                  Pregunta {i + 1} de {total}
                </span>
                <span className="text-xs emp-dim">{Math.round((i / total) * 100)}%</span>
              </div>
              <div className="emp-dots">
                {flow.steps.map((_, idx) => (
                  <i key={idx} className={idx < i ? 'done' : idx === i ? 'current' : ''} />
                ))}
              </div>
            </div>
          )}

          {/* El paso actual (key fuerza la animación de entrada) */}
          <Paso
            key={i}
            step={step}
            value={current}
            onChange={(v) => set(step.field, v)}
            onPick={(v) => pick(step.field, v)}
            onEnter={next}
          />

          {error && (
            <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.12)', color: '#fda4af' }}>
              {error}
            </div>
          )}

          {/* Navegación (los pasos de opción avanzan solos, no necesitan botón) */}
          {step.kind !== 'choice' && (
            <div className="mt-6 flex items-center gap-3">
              {i > 0 && (
                <button onClick={back} className="emp-btn-ghost text-sm px-5">
                  ← Atrás
                </button>
              )}
              <button onClick={next} disabled={!filled} className="emp-btn flex-1 text-sm">
                {isLast ? `${flow.cta} →` : 'Siguiente →'}
              </button>
            </div>
          )}
          {step.kind === 'choice' && i > 0 && (
            <div className="mt-6">
              <button onClick={back} className="emp-btn-ghost text-sm px-5">
                ← Atrás
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Un paso del wizard ---------------- */

function Paso({
  step,
  value,
  onChange,
  onPick,
  onEnter,
}: {
  step: Step;
  value: Val | undefined;
  onChange: (v: Val) => void;
  onPick: (v: Val) => void;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  useEffect(() => {
    if (step.kind !== 'choice') ref.current?.focus();
  }, [step]);

  return (
    <div className="emp-step-in">
      <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-white leading-tight">
        {step.pregunta}
      </h2>
      {step.sub && <p className="emp-dim mt-2">{step.sub}</p>}

      <div className="mt-5">
        {step.kind === 'choice' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {step.opciones.map((op, idx) => {
              const selected = value === op.value;
              return (
                <button
                  key={op.label}
                  type="button"
                  className={`emp-choice ${selected ? 'selected' : ''}`}
                  onClick={() => onPick(op.value)}
                >
                  {op.emoji ? (
                    <span className="emp-choice-emoji">{op.emoji}</span>
                  ) : (
                    <span className="emp-choice-key">{String.fromCharCode(65 + idx)}</span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{op.label}</span>
                    {op.hint && <span className="block text-xs emp-dim mt-0.5">{op.hint}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        ) : step.kind === 'textarea' ? (
          <textarea
            ref={ref}
            className="emp-input min-h-[120px] resize-none text-base"
            placeholder={step.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onEnter();
            }}
          />
        ) : (
          <input
            ref={ref}
            type="text"
            className="emp-input text-base"
            placeholder={step.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEnter();
            }}
          />
        )}
      </div>

      {/* Sugerencias */}
      {step.kind !== 'choice' && step.sugerencias && step.sugerencias.length > 0 && (
        <div className="mt-4">
          <div className="text-xs emp-dim mb-2">💡 Toca para usar un ejemplo:</div>
          <div className="flex flex-wrap gap-2">
            {step.sugerencias.map((s) => (
              <button key={s} type="button" className="emp-sugg" onClick={() => onChange(s.replace(/^[^\s]+\s/, ''))}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {step.kind === 'textarea' && (
        <p className="text-[11px] emp-dim mt-3">Pulsa ⌘/Ctrl + Enter para continuar</p>
      )}
    </div>
  );
}

/* ---------------- Loading ---------------- */

function LoadingCard({ grad }: { grad: readonly [string, string] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FRASES_PENSANDO.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="emp-card p-6 emp-in">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-lg shrink-0" style={{ background: gradCss(grad) }}>
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
        <div className="rounded-2xl p-4 text-center font-semibold text-white" style={{ background: gradCss(['#d946ef', '#f43f5e']), boxShadow: '0 16px 34px -14px rgba(217,70,239,.6)' }}>
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
              data.escenarios.find((e: any) => /real/i.test(e.nombre))?.beneficioMes ?? data.escenarios[0]?.beneficioMes
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
              <span className="inline-block rounded-lg px-2 py-0.5 text-xs text-white" style={{ background: gradCss(['#8b5cf6', '#d946ef']) }}>
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
