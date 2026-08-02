'use client';
import { useEffect, useRef, useState } from 'react';
import { getModulo, gradCss, type ModuloSlug } from '@/lib/emprende/catalog';
import { logRun } from '../stats';
import { Resultado } from '../resultado';
import { Ic, type IconName } from '../icons';
import { getSugerenciaPersonal, getContextoPerfil, type SugerenciaPersonal } from '../personalizacion';

type Val = string | number;
type Answers = Record<string, Val>;

type Card = { icon: IconName; label: string; hint?: string; value: Val };

// Módulos cuyo primer paso admite la tarjeta "Mi negocio" y cuyo análisis
// recibe en silencio el contexto real del usuario (capital, tiempo, punto
// de partida) para que la IA no responda de forma genérica.
const MODULOS_ADAPTABLES = new Set<ModuloSlug>(['validar', 'roast', 'simulador', 'reto']);

type Step =
  | {
      field: string;
      kind: 'text' | 'textarea';
      pregunta: string;
      sub?: string;
      placeholder: string;
      cards?: Card[]; // respuestas rápidas en tarjeta; siempre se puede escribir a mano
      personalizable?: boolean; // añade la tarjeta "Mi negocio" arriba de las demás
    }
  | {
      field: string;
      kind: 'choice';
      pregunta: string;
      sub?: string;
      opciones: Card[];
    };

// Cada módulo es una conversación de N preguntas, respondibles por tarjetas.
const FLOWS: Record<ModuloSlug, { steps: Step[]; cta: string }> = {
  'que-negocio': {
    cta: 'Descubrir mi negocio',
    steps: [
      {
        field: 'skills',
        kind: 'textarea',
        pregunta: '¿Qué se te da bien?',
        sub: 'Elige lo tuyo o escríbelo con tus palabras.',
        placeholder: 'Diseño, hablar con gente, programar, redes sociales...',
        cards: [
          { icon: 'palette', label: 'Diseño y contenido', hint: 'gráfico, vídeo, redes', value: 'Diseño gráfico, edición de vídeo y redes sociales' },
          { icon: 'code', label: 'Programar', hint: 'webs, apps, automatizar', value: 'Programar webs, apps y automatizaciones' },
          { icon: 'megaphone', label: 'Vender y hablar', hint: 'con gente, negociar', value: 'Hablar con gente, vender y negociar' },
          { icon: 'scissors', label: 'Hacer con las manos', hint: 'manualidades, producto', value: 'Manualidades y productos hechos a mano' },
          { icon: 'utensils', label: 'Cocinar', hint: 'comida, repostería', value: 'Cocinar y repostería' },
        ],
      },
      {
        field: 'horasSemana',
        kind: 'choice',
        pregunta: '¿Cuánto tiempo puedes dedicarle?',
        sub: 'Sé realista: es mejor poco y constante.',
        opciones: [
          { icon: 'moon', label: 'Ratos sueltos', hint: '~5 h/semana', value: 5 },
          { icon: 'clock', label: 'Unas horas', hint: '~10 h/semana', value: 10 },
          { icon: 'zap', label: 'En serio', hint: '~20 h/semana', value: 20 },
          { icon: 'rocket', label: 'A tope', hint: '40+ h/semana', value: 40 },
        ],
      },
      {
        field: 'presupuesto',
        kind: 'choice',
        pregunta: '¿Cuánto puedes invertir para arrancar?',
        sub: 'Hay negocios geniales a coste casi cero.',
        opciones: [
          { icon: 'coin', label: 'A coste cero', hint: '0 €', value: 0 },
          { icon: 'banknote', label: 'Poquito', hint: 'hasta 100 €', value: 100 },
          { icon: 'stack', label: 'Algo tengo', hint: '~300 €', value: 300 },
          { icon: 'wallet', label: 'Voy en serio', hint: '500 € o más', value: 500 },
        ],
      },
      {
        field: 'intereses',
        kind: 'textarea',
        pregunta: '¿Qué temas te tiran?',
        sub: 'El sector donde te apetece trabajar.',
        placeholder: 'Moda, fitness, tecnología, ayudar a negocios locales...',
        cards: [
          { icon: 'shirt', label: 'Moda', value: 'Moda y marcas de ropa' },
          { icon: 'dumbbell', label: 'Fitness y salud', value: 'Fitness, salud y bienestar' },
          { icon: 'phone', label: 'Tecnología', value: 'Tecnología y apps' },
          { icon: 'store', label: 'Negocios locales', value: 'Ayudar a negocios locales a crecer' },
          { icon: 'utensils', label: 'Comida', value: 'Comida y hostelería' },
          { icon: 'gamepad', label: 'Gaming y contenido', value: 'Gaming y creación de contenido' },
        ],
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
        sub: 'Elige un ejemplo para probar o cuéntame la tuya.',
        placeholder: 'Una app que conecta dueños de perros con paseadores de confianza...',
        personalizable: true,
        cards: [
          { icon: 'paw', label: 'App de paseadores', hint: 'para dueños de perros', value: 'Una app que conecta dueños de perros con paseadores de confianza cerca de casa' },
          { icon: 'leaf', label: 'Meal prep saludable', hint: 'para oficinistas', value: 'Servicio de comida saludable semanal preparada para oficinistas ocupados' },
          { icon: 'shirt', label: 'Ropa con diseños propios', hint: 'cultura urbana', value: 'Tienda online de camisetas con diseños propios sobre cultura urbana' },
        ],
      },
    ],
  },
  roast: {
    cta: 'Quiero la verdad',
    steps: [
      {
        field: 'idea',
        kind: 'textarea',
        pregunta: 'Cuéntame tu idea. Sin filtros.',
        sub: 'Te diré lo que te diría el mercado: lo bueno, lo flojo y cómo salvarla — antes de que te cueste dinero.',
        placeholder: 'Gestionar las redes sociales de restaurantes de mi ciudad por una cuota mensual...',
        personalizable: true,
        cards: [
          { icon: 'megaphone', label: 'Agencia de redes', hint: 'para negocios locales', value: 'Gestionar las redes sociales de restaurantes y negocios locales por una cuota mensual' },
          { icon: 'shirt', label: 'Marca de ropa propia', hint: 'venta online', value: 'Lanzar una marca de ropa con diseños propios vendiendo online' },
          { icon: 'code', label: 'App de reservas', hint: 'peluquerías y barberías', value: 'Una app para reservar cita en peluquerías y barberías del barrio' },
          { icon: 'utensils', label: 'Comida a domicilio', hint: 'menús saludables', value: 'Menús saludables semanales a domicilio para oficinistas' },
        ],
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
        personalizable: true,
        cards: [
          { icon: 'megaphone', label: 'Agencia de redes', hint: 'para restaurantes', value: 'Agencia de gestión de redes sociales para restaurantes locales' },
          { icon: 'globe', label: 'Webs para negocios', hint: 'locales sin web', value: 'Diseño de webs para negocios locales sin presencia online' },
        ],
      },
      {
        field: 'precio',
        kind: 'text',
        pregunta: '¿Cuánto vas a cobrar?',
        sub: 'Tu precio por cliente o por proyecto.',
        placeholder: '400€/mes por cliente',
        cards: [
          { icon: 'coin', label: '20€/mes', hint: 'suscripción baja', value: '20€/mes' },
          { icon: 'repeat', label: '50€ + 50€/mes', hint: 'entrada + cuota', value: '50€ la web + 50€/mes de mantenimiento' },
          { icon: 'banknote', label: '400€/mes', hint: 'por cliente', value: '400€/mes por cliente' },
          { icon: 'receipt', label: '500€ el proyecto', hint: 'pago único', value: '500€ por proyecto' },
        ],
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
        sub: 'Te montaré un plan semana a semana.',
        placeholder: 'Tienda online de camisetas con diseños propios',
        personalizable: true,
        cards: [
          { icon: 'shirt', label: 'Tienda de camisetas', hint: 'diseños propios', value: 'Tienda online de camisetas con diseños propios' },
          { icon: 'coffee', label: 'Cafetería especialidad', hint: 'para llevar', value: 'Cafetería de especialidad para llevar en zona de oficinas' },
        ],
      },
    ],
  },
};

const FRASES_PENSANDO = [
  'Analizando tu caso a fondo...',
  'Mirando el tamaño del mercado...',
  'Estudiando a la competencia...',
  'Buscando el ángulo ganador...',
  'Echando las cuentas reales...',
  'Puliendo los últimos detalles...',
];

export function Runner({ slug }: { slug: ModuloSlug }) {
  const modulo = getModulo(slug)!;
  const flow = FLOWS[slug];
  const total = flow.steps.length;

  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
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
    else setStarted(false);
  }

  async function next() {
    if (!filled) return;
    if (!isLast) {
      setI(i + 1);
      return;
    }
    await submit();
  }

  function pick(field: string, value: Val) {
    const nextAnswers = { ...answers, [field]: value };
    setAnswers(nextAnswers);
    setTimeout(() => {
      if (i < total - 1) setI(i + 1);
      else submit(nextAnswers);
    }, 260);
  }

  async function submit(over?: Answers) {
    const data: Answers = { ...(over ?? answers) };
    // Contexto real del usuario (capital, tiempo, punto de partida) — nunca
    // se le pregunta ni se le muestra, solo viaja a la IA para que adapte
    // el análisis a él en vez de darle una respuesta genérica.
    if (MODULOS_ADAPTABLES.has(slug)) {
      const contexto = getContextoPerfil();
      if (contexto) data.contexto = contexto;
    }
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
      // guardar la conversación completa en el panel (historial + XP)
      logRun(slug, typeof j.resultado?.nota === 'number' ? j.resultado.nota : undefined, {
        input: data,
        output: j.resultado,
      });
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
    setStarted(false);
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
              className="grid h-14 w-14 place-items-center rounded-2xl text-white shrink-0"
              style={{ background: gradCss(modulo.grad), boxShadow: '0 12px 26px -8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.35)' }}
            >
              <Ic name={modulo.icon as IconName} size={28} />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{modulo.nombre}</h1>
              <p className="emp-dim text-sm mt-0.5">{modulo.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {resultado ? (
        <div className="emp-in">
          <div className="flex items-center justify-between mb-4">
            <span className="emp-badge">
              <Ic name="check" size={13} className="text-emerald-400" /> Guardado en tu panel · +25 XP
            </span>
            <button onClick={reset} className="emp-btn-ghost text-xs px-4 py-2">
              <Ic name="refresh" size={13} /> Volver a empezar
            </button>
          </div>
          <Resultado slug={slug} data={resultado} />
        </div>
      ) : loading ? (
        <LoadingCard grad={modulo.grad} />
      ) : !started ? (
        /* ---------- Pantalla de bienvenida ---------- */
        <div className="emp-card p-8 md:p-10 text-center emp-in relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-50"
            style={{ background: `radial-gradient(70% 100% at 50% 0%, ${modulo.grad[0]}26, transparent 70%)` }}
          />
          <span
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white mb-5"
            style={{ background: gradCss(modulo.grad), boxShadow: '0 16px 34px -10px rgba(0,0,0,.6)' }}
          >
            <Ic name={modulo.icon as IconName} size={32} />
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-md mx-auto">
            {total === 1 ? 'Una sola pregunta' : `${total} preguntas rápidas`} y la IA hace el resto
          </h2>
          <p className="emp-dim mt-3 max-w-sm mx-auto">
            Responde tocando tarjetas (o escribe si lo prefieres) y te doy un
            resultado accionable al momento.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <span className="emp-badge"><Ic name="zap" size={13} /> ~30 segundos</span>
            <span className="emp-badge"><Ic name="brain" size={13} /> IA real</span>
            <span className="emp-badge"><Ic name="check" size={13} /> Se guarda en tu panel</span>
          </div>
          <button onClick={() => setStarted(true)} className="emp-btn text-sm mt-7 px-10">
            Empezar <Ic name="arrowRight" size={15} />
          </button>
        </div>
      ) : (
        /* ---------- Wizard ---------- */
        <div className="emp-card p-6 md:p-8">
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

          <Paso
            key={i}
            step={step}
            value={current}
            isLast={isLast}
            cta={flow.cta}
            filled={filled}
            onChange={(v) => set(step.field, v)}
            onPick={(v) => pick(step.field, v)}
            onNext={next}
            onBack={back}
          />

          {error && (
            <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.12)', color: '#fda4af' }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Un paso del wizard ---------------- */

function CardBtn({
  card,
  selected,
  onClick,
  dashed,
  personal,
}: {
  card: Card;
  selected?: boolean;
  onClick: () => void;
  dashed?: boolean;
  personal?: boolean;
}) {
  return (
    <button
      type="button"
      className={`emp-choice big relative ${selected ? 'selected' : ''} ${dashed ? 'dashed' : ''}`}
      onClick={onClick}
      style={personal && !selected ? { borderColor: 'rgba(34,211,238,.45)', background: 'rgba(34,211,238,.06)' } : undefined}
    >
      {personal && (
        <span
          className="absolute -top-2 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
          style={{ background: 'linear-gradient(90deg,#5b8cff,#22d3ee)' }}
        >
          Tu plan
        </span>
      )}
      <span className="emp-choice-key" style={{ width: 38, height: 38, borderRadius: 12 }}>
        <Ic name={card.icon} size={19} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-tight">{card.label}</span>
        {card.hint && <span className="block text-xs emp-dim mt-0.5">{card.hint}</span>}
      </span>
    </button>
  );
}

function Paso({
  step,
  value,
  isLast,
  cta,
  filled,
  onChange,
  onPick,
  onNext,
  onBack,
}: {
  step: Step;
  value: Val | undefined;
  isLast: boolean;
  cta: string;
  filled: boolean;
  onChange: (v: Val) => void;
  onPick: (v: Val) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [personal, setPersonal] = useState<SugerenciaPersonal | null>(null);
  useEffect(() => {
    setPersonal(step.kind !== 'choice' && step.personalizable ? getSugerenciaPersonal() : null);
  }, [step]);

  const tieneCards = step.kind !== 'choice' && (!!step.cards?.length || !!personal);
  const [manual, setManual] = useState(step.kind !== 'choice' && !step.cards?.length && !step.personalizable);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => {
    if (manual) ref.current?.focus();
  }, [manual]);

  return (
    <div className="emp-step-in">
      <h2 className="text-2xl md:text-[30px] font-black tracking-tight text-white leading-tight">
        {step.pregunta}
      </h2>
      {step.sub && <p className="emp-dim mt-2">{step.sub}</p>}

      <div className="mt-6">
        {step.kind === 'choice' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {step.opciones.map((op) => (
              <CardBtn key={op.label} card={op} selected={value === op.value} onClick={() => onPick(op.value)} />
            ))}
          </div>
        ) : !manual && tieneCards ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {personal && (
              <CardBtn
                card={{ icon: personal.icon, label: personal.label, hint: personal.hint, value: personal.value }}
                selected={value === personal.value}
                onClick={() => onPick(personal.value)}
                personal
              />
            )}
            {step.cards?.map((c) => (
              <CardBtn key={c.label} card={c} selected={value === c.value} onClick={() => onPick(c.value)} />
            ))}
            <CardBtn card={{ icon: 'pen', label: 'Lo escribo yo', hint: 'con mis palabras', value: '' }} dashed onClick={() => setManual(true)} />
          </div>
        ) : (
          <>
            {step.kind === 'textarea' ? (
              <textarea
                ref={ref}
                className="emp-input min-h-[120px] resize-none text-base"
                placeholder={step.placeholder}
                value={(value as string) ?? ''}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onNext();
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
                  if (e.key === 'Enter') onNext();
                }}
              />
            )}
            {tieneCards && (
              <button
                type="button"
                className="text-xs emp-dim mt-2.5 hover:text-white transition-colors"
                onClick={() => setManual(false)}
              >
                ← mejor elijo una tarjeta
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-7 flex items-center gap-3">
        <button onClick={onBack} className="emp-btn-ghost text-sm px-5">
          ← Atrás
        </button>
        {(manual || !tieneCards) && step.kind !== 'choice' && (
          <button onClick={onNext} disabled={!filled} className="emp-btn flex-1 text-sm">
            {isLast ? cta : 'Siguiente'} <Ic name="arrowRight" size={15} />
          </button>
        )}
      </div>
      {step.kind === 'textarea' && manual && (
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
        <span className="grid h-10 w-10 place-items-center rounded-xl text-white shrink-0" style={{ background: gradCss(grad) }}>
          <Ic name="brain" size={20} />
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
