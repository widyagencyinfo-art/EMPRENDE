'use client';
/**
 * Onboarding — el "registro" de Rumbo. 7 preguntas para conocer al usuario,
 * y con eso la IA le genera su plan de arranque (brief) antes de entrar al panel.
 */
import { useEffect, useRef, useState } from 'react';
import { gradCss } from '@/lib/emprende/catalog';
import { Ic, type IconName } from './icons';
import { savePerfil, type Perfil } from './perfil';

type Card = { icon: IconName; label: string; hint?: string; value: string | number };

type Step = {
  field: keyof Omit<Perfil, 'ingresosActuales' | 'accionesHechas' | 'brief' | 'creado'>;
  pregunta: string;
  sub: string;
  kind: 'text' | 'choice';
  placeholder?: string;
  opciones?: Card[];
};

const STEPS: Step[] = [
  {
    field: 'nombre',
    kind: 'text',
    pregunta: 'Lo primero: ¿cómo te llamas?',
    sub: 'Para hablarte como se habla a un socio, no como a un usuario.',
    placeholder: 'Tu nombre',
  },
  {
    field: 'area',
    kind: 'choice',
    pregunta: '¿En qué mundillo te estás moviendo?',
    sub: 'O el que te llama, si aún estás explorando.',
    opciones: [
      { icon: 'compass', label: 'Aún explorando', hint: 'no tengo idea clara', value: 'Todavía no tiene idea clara, está explorando qué montar' },
      { icon: 'briefcase', label: 'Servicios / agencia', hint: 'freelance, agencia', value: 'Vende servicios: agencia, freelance o consultoría' },
      { icon: 'store', label: 'Tienda / producto', hint: 'e-commerce, físico', value: 'Tienda online o producto físico' },
      { icon: 'megaphone', label: 'Contenido y redes', hint: 'creador, marca personal', value: 'Creación de contenido, redes y marca personal' },
      { icon: 'code', label: 'App / SaaS', hint: 'software, tecnología', value: 'Apps, software o SaaS' },
      { icon: 'building', label: 'Negocio físico', hint: 'local, hostelería', value: 'Negocio físico o local' },
    ],
  },
  {
    field: 'experiencia',
    kind: 'choice',
    pregunta: '¿En qué punto del camino estás?',
    sub: 'Sin vergüenza: todos empezamos en cero.',
    opciones: [
      { icon: 'leaf', label: 'Empezando de cero', hint: 'aún no he vendido nada', value: 'Empezando de cero, todavía no ha vendido nada' },
      { icon: 'flag', label: 'Primeras ventas', hint: 'ya he vendido algo', value: 'Ya ha hecho sus primeras ventas' },
      { icon: 'trending', label: 'Facturo cada mes', hint: 'ingresos recurrentes', value: 'Factura todos los meses' },
      { icon: 'rocket', label: 'Quiero escalar', hint: 'busco el siguiente nivel', value: 'Factura bien y quiere escalar al siguiente nivel' },
    ],
  },
  {
    field: 'dineroDisponible',
    kind: 'choice',
    pregunta: '¿Con cuánta gasolina cuentas para arrancar?',
    sub: 'El capital que podrías invertir sin dolor. Se puede empezar con 0.',
    opciones: [
      { icon: 'coin', label: 'Con lo puesto', hint: '0 €', value: 0 },
      { icon: 'banknote', label: 'Algo suelto', hint: 'hasta 300 €', value: 300 },
      { icon: 'stack', label: 'Un colchoncito', hint: '~1.000 €', value: 1000 },
      { icon: 'wallet', label: 'Munición seria', hint: '3.000 € o más', value: 3000 },
    ],
  },
  {
    field: 'objetivoMensual',
    kind: 'choice',
    pregunta: '¿Cuál es tu objetivo realista de ingresos?',
    sub: 'Al mes. Tu barra de progreso del panel apuntará aquí.',
    opciones: [
      { icon: 'flag', label: 'Mis primeros 500 €', hint: '500 €/mes', value: 500 },
      { icon: 'trending', label: 'Un sueldo extra', hint: '1.500 €/mes', value: 1500 },
      { icon: 'rocket', label: 'Vivir de esto', hint: '3.000 €/mes', value: 3000 },
      { icon: 'star', label: 'Jugar en grande', hint: '10.000 €/mes', value: 10000 },
    ],
  },
  {
    field: 'horasSemana',
    kind: 'choice',
    pregunta: '¿Cuánto tiempo real le puedes meter?',
    sub: 'Mejor pocas horas constantes que un atracón y desaparecer.',
    opciones: [
      { icon: 'moon', label: 'Ratos sueltos', hint: '~5 h/semana', value: 5 },
      { icon: 'clock', label: 'Unas horas', hint: '~10 h/semana', value: 10 },
      { icon: 'zap', label: 'En serio', hint: '~20 h/semana', value: 20 },
      { icon: 'rocket', label: 'A jornada completa', hint: '40+ h/semana', value: 40 },
    ],
  },
  {
    field: 'bloqueo',
    kind: 'choice',
    pregunta: 'Y ahora en confianza: ¿qué es lo que más te frena?',
    sub: 'Tu plan atacará esto primero.',
    opciones: [
      { icon: 'compass', label: 'No sé por dónde empezar', hint: 'demasiadas opciones', value: 'No sabe por dónde empezar' },
      { icon: 'user', label: 'No consigo clientes', hint: 'tengo idea, faltan ventas', value: 'Tiene idea pero no consigue clientes' },
      { icon: 'clock', label: 'Me falta constancia', hint: 'empiezo y lo dejo', value: 'Le cuesta ser constante, empieza cosas y las deja' },
      { icon: 'wallet', label: 'El dinero', hint: 'me frena invertir', value: 'Siente que le falta dinero para arrancar' },
    ],
  },
];

const FRASES_PLAN = [
  'Leyendo tu perfil...',
  'Midiendo la distancia a tu objetivo...',
  'Eligiendo tu foco de esta semana...',
  'Trazando tu ruta de capital...',
  'Afinando el plan...',
];

export function Onboarding({ onDone, sinIntro = false }: { onDone: () => void; sinIntro?: boolean }) {
  const [fase, setFase] = useState<'intro' | 'quiz' | 'plan'>(sinIntro ? 'quiz' : 'intro');
  const [i, setI] = useState(0);
  const [datos, setDatos] = useState<Record<string, string | number>>({});
  const [error, setError] = useState<string | null>(null);
  const [fraseIdx, setFraseIdx] = useState(0);
  const ref = useRef<HTMLInputElement>(null);

  const step = STEPS[i];
  const filled = datos[step.field] !== undefined && String(datos[step.field]).trim() !== '';

  useEffect(() => {
    if (fase === 'quiz' && step.kind === 'text') ref.current?.focus();
  }, [fase, i, step.kind]);

  useEffect(() => {
    if (fase !== 'plan') return;
    const t = setInterval(() => setFraseIdx((v) => (v + 1) % FRASES_PLAN.length), 1700);
    return () => clearInterval(t);
  }, [fase]);

  function pick(value: string | number) {
    const nuevos = { ...datos, [step.field]: value };
    setDatos(nuevos);
    setTimeout(() => {
      if (i < STEPS.length - 1) setI(i + 1);
      else terminar(nuevos);
    }, 260);
  }

  function siguiente() {
    if (!filled) return;
    if (i < STEPS.length - 1) setI(i + 1);
    else terminar(datos);
  }

  async function terminar(finales: Record<string, string | number>) {
    setFase('plan');
    setError(null);
    const base = {
      nombre: String(finales.nombre),
      area: String(finales.area),
      experiencia: String(finales.experiencia),
      dineroDisponible: Number(finales.dineroDisponible),
      objetivoMensual: Number(finales.objetivoMensual),
      horasSemana: Number(finales.horasSemana),
      bloqueo: String(finales.bloqueo),
    };
    try {
      const res = await fetch('/api/emprende/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(base),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Error');
      savePerfil({
        ...base,
        ingresosActuales: 0,
        accionesHechas: [],
        brief: j.resultado,
        creado: Date.now(),
      });
      onDone();
    } catch (err) {
      // guardamos el perfil igualmente; el plan se podrá regenerar desde el panel
      savePerfil({ ...base, ingresosActuales: 0, accionesHechas: [], brief: null, creado: Date.now() });
      setError(err instanceof Error ? err.message : 'No pude generar tu plan, pero tu perfil está guardado.');
      setTimeout(onDone, 1800);
    }
  }

  /* ---------- Intro ---------- */
  if (fase === 'intro') {
    return (
      <div className="max-w-xl mx-auto emp-in">
        <div className="emp-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-60" style={{ background: 'radial-gradient(70% 90% at 50% 0%, rgba(91,140,255,.22), transparent 70%)' }} />
          <span
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white mb-6"
            style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 16px 40px -10px rgba(91,140,255,.7)' }}
          >
            <Ic name="logo" size={34} />
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Bienvenido a <span className="emp-grad-text">emprendIA</span>
          </h1>
          <p className="emp-dim mt-4 max-w-sm mx-auto leading-relaxed">
            Cuéntame quién eres y a dónde quieres llegar, y te monto un plan de
            arranque a tu medida: tu foco, tus acciones de esta semana y tu ruta
            hasta tu objetivo de ingresos.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="emp-badge"><Ic name="clock" size={13} /> 1 minuto</span>
            <span className="emp-badge"><Ic name="route" size={13} /> Plan personalizado</span>
            <span className="emp-badge"><Ic name="check" size={13} /> Gratis</span>
          </div>
          <button onClick={() => setFase('quiz')} className="emp-btn text-sm mt-8 px-10">
            Crear mi cuenta <Ic name="arrowRight" size={15} />
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Generando plan ---------- */
  if (fase === 'plan') {
    return (
      <div className="max-w-xl mx-auto emp-in">
        <div className="emp-card p-8 md:p-12 text-center">
          <span
            className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white mb-5"
            style={{ background: gradCss(['#5b8cff', '#22d3ee']) }}
          >
            <Ic name="brain" size={26} />
          </span>
          <h2 className="text-xl font-black text-white">
            Montando tu plan{datos.nombre ? `, ${datos.nombre}` : ''}...
          </h2>
          <p className="emp-dim text-sm mt-2">{FRASES_PLAN[fraseIdx]}</p>
          <div className="emp-progress mt-6 max-w-xs mx-auto"><i /></div>
          {error && <p className="text-sm mt-5" style={{ color: '#fda4af' }}>{error}</p>}
          <div className="mt-7 space-y-3 text-left max-w-sm mx-auto">
            <div className="emp-skeleton h-3 w-3/4" />
            <div className="emp-skeleton h-3 w-full" />
            <div className="emp-skeleton h-3 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Quiz ---------- */
  return (
    <div className="max-w-2xl mx-auto emp-in">
      <div className="emp-card p-6 md:p-8">
        <div className="mb-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold emp-dim">Paso {i + 1} de {STEPS.length}</span>
            <span className="text-xs emp-dim">{Math.round((i / STEPS.length) * 100)}%</span>
          </div>
          <div className="emp-dots">
            {STEPS.map((_, idx) => (
              <i key={idx} className={idx < i ? 'done' : idx === i ? 'current' : ''} />
            ))}
          </div>
        </div>

        <div key={i} className="emp-step-in">
          <h2 className="text-2xl md:text-[30px] font-black tracking-tight text-white leading-tight">
            {step.pregunta}
          </h2>
          <p className="emp-dim mt-2">{step.sub}</p>

          <div className="mt-6">
            {step.kind === 'choice' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {step.opciones!.map((op) => (
                  <button
                    key={op.label}
                    type="button"
                    className={`emp-choice big ${datos[step.field] === op.value ? 'selected' : ''}`}
                    onClick={() => pick(op.value)}
                  >
                    <span className="emp-choice-key" style={{ width: 38, height: 38, borderRadius: 12 }}>
                      <Ic name={op.icon} size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-tight">{op.label}</span>
                      {op.hint && <span className="block text-xs emp-dim mt-0.5">{op.hint}</span>}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <input
                ref={ref}
                type="text"
                className="emp-input text-base"
                placeholder={step.placeholder}
                value={(datos[step.field] as string) ?? ''}
                onChange={(e) => setDatos((d) => ({ ...d, [step.field]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') siguiente();
                }}
              />
            )}
          </div>

          <div className="mt-7 flex items-center gap-3">
            {i > 0 && (
              <button onClick={() => setI(i - 1)} className="emp-btn-ghost text-sm px-5">
                ← Atrás
              </button>
            )}
            {step.kind === 'text' && (
              <button onClick={siguiente} disabled={!filled} className="emp-btn flex-1 text-sm">
                Siguiente <Ic name="arrowRight" size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
