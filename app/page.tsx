import Link from 'next/link';
import { gradCss, MODULOS } from '@/lib/emprende/catalog';
import { Ic, type IconName } from './emprende/icons';
import { Logo } from './emprende/sidebar';

/**
 * Landing pública (estilo Shopify): marketing → registro/inicio en /entrar.
 * La app vive en /emprende y está protegida por la puerta de /entrar.
 */

const STATS = [
  { n: '6', l: 'herramientas de IA' },
  { n: '~30 s', l: 'por análisis' },
  { n: '1 min', l: 'para tu plan personalizado' },
  { n: '0 €', l: 'para empezar' },
];

const FAQ = [
  {
    q: '¿De verdad es gratis?',
    a: 'Sí. Creas tu cuenta, recibes tu plan personalizado y usas las herramientas base sin pagar nada. El plan Pro (19€/mes) quita los límites cuando vayas en serio.',
  },
  {
    q: '¿Qué hace exactamente la IA?',
    a: 'Analiza tu caso concreto: valida tu idea con nota y análisis de mercado, te recomienda qué negocio montar según tu perfil, proyecta tus ingresos y te monta un plan de acción semana a semana.',
  },
  {
    q: '¿Necesito tener ya una idea de negocio?',
    a: 'No. Si aún no la tienes, la herramienta "¿Qué negocio montar?" te recomienda el negocio que mejor encaja con tus habilidades, tu tiempo y tu presupuesto.',
  },
  {
    q: '¿Esto sustituye a un mentor?',
    a: 'Es tu primer empujón: análisis honesto y plan concreto al momento, las 24 horas. La IA aconseja con datos reales del mercado; las decisiones siguen siendo tuyas.',
  },
];

function Wordmark() {
  return (
    <span className="font-bold text-lg tracking-tight text-white">
      emprend<span className="emp-grad-text">IA</span>
    </span>
  );
}

/* Mini-mockups de producto (puro CSS, sin imágenes) */

function MockPlan() {
  return (
    <div className="emp-card p-5 w-full max-w-sm">
      <div className="flex items-center gap-1.5 text-xs emp-dim mb-3">
        <Ic name="target" size={13} /> Tu foco de esta semana
      </div>
      <p className="font-bold emp-grad-text leading-snug">
        Consigue tus 3 primeras llamadas con clientes potenciales
      </p>
      <div className="mt-4 space-y-2">
        {[
          { t: 'Haz tu lista de 50 contactos', done: true },
          { t: 'Escribe tu mensaje de apertura', done: true },
          { t: 'Envía 7 mensajes al día', done: false },
        ].map((a) => (
          <div key={a.t} className="emp-inner px-3 py-2.5 flex items-center gap-2.5">
            <span
              className="grid h-4.5 w-4.5 h-[18px] w-[18px] place-items-center rounded-md border shrink-0"
              style={a.done ? { background: gradCss(['#22c55e', '#14b8a6']), borderColor: 'transparent' } : { borderColor: 'rgba(255,255,255,.25)' }}
            >
              {a.done && <Ic name="check" size={11} className="text-white" />}
            </span>
            <span className={`text-xs ${a.done ? 'line-through emp-dim' : 'text-white/90'}`}>{a.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockNota() {
  return (
    <div className="emp-card p-5 w-full max-w-sm">
      <div className="flex items-center gap-4">
        <div className="emp-ring shrink-0" style={{ ['--ring-val' as string]: 72, ['--ring-color' as string]: '#22c55e', width: 84, height: 84 }}>
          <span className="text-center relative z-[1]">
            <span className="block text-2xl font-black" style={{ color: '#22c55e' }}>7.2</span>
            <span className="block text-[9px] emp-dim -mt-0.5">/10</span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-snug">Idea con hueco real si nichas bien el público.</p>
          <span className="text-[11px] emp-dim">Veredicto de la IA · 28 s</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs emp-dim"><Ic name="chart" size={12} /> Mercado: 1.200M€ y creciendo un 8%</div>
        <div className="flex items-center gap-2 text-xs emp-dim"><Ic name="target" size={12} /> Competencia: fragmentada, sin líder claro</div>
        <div className="flex items-center gap-2 text-xs emp-dim"><Ic name="zap" size={12} /> Riesgo: necesitas masa crítica local</div>
      </div>
    </div>
  );
}

function MockPanel() {
  return (
    <div className="emp-card p-5 w-full max-w-sm">
      <div className="flex items-center justify-between text-xs emp-dim mb-3">
        <span className="flex items-center gap-1.5"><Ic name="route" size={13} /> Rumbo a tu objetivo</span>
        <span>30%</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-black text-white">450 €<span className="text-xs emp-dim font-semibold">/mes</span></span>
        <span className="text-sm font-black emp-grad-text">1.500 €/mes</span>
      </div>
      <div className="emp-bar" style={{ height: 10 }}>
        <i style={{ width: '30%' }} />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {['Primer cliente', 'Referidos', 'Contenido', 'Objetivo'].map((h, i) => (
          <div key={h} className="emp-inner px-2.5 py-2 flex items-center gap-1.5">
            <Ic name="flag" size={11} className={i === 0 ? 'text-emerald-400' : 'emp-dim'} />
            <span className={`text-[11px] ${i === 0 ? 'text-white font-semibold' : 'emp-dim'}`}>{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES: { icon: IconName; k: string; t: string; d: string; mock: React.ReactNode }[] = [
  {
    icon: 'route',
    k: 'Tu plan',
    t: 'Un plan de arranque hecho para ti, no para "la gente"',
    d: 'Al crear tu cuenta te preguntamos quién eres, cuánto tienes y a dónde quieres llegar. La IA te devuelve tu diagnóstico, tu foco de la semana con acciones marcables y tu ruta de hitos hasta tu objetivo de ingresos.',
    mock: <MockPlan />,
  },
  {
    icon: 'target',
    k: 'Validación',
    t: 'Valida tu idea antes de invertir un euro',
    d: 'Cuéntale tu idea y en 30 segundos tienes nota sobre 10, análisis de mercado y competencia, a quién vendérsela primero, riesgos reales y el giro que la haría mejor. Honesto, sin humo.',
    mock: <MockNota />,
  },
  {
    icon: 'trending',
    k: 'Tu progreso',
    t: 'Un panel con rumbo: tu dinero contra tu objetivo',
    d: 'Tu barra de progreso hacia tu objetivo mensual, todas tus conversaciones con la IA guardadas, tus notas, tu racha y tus niveles. Abres la app y sabes exactamente dónde estás y qué toca hoy.',
    mock: <MockPanel />,
  },
];

export default function LandingPage() {
  return (
    <div className="emp-app min-h-screen">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 emp-mnav">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <Wordmark />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm emp-dim">
            <a href="#herramientas" className="hover:text-white transition-colors">Herramientas</a>
            <a href="#como" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/entrar" className="emp-btn-ghost text-sm !py-2 px-4 hidden sm:inline-flex">
              Iniciar sesión
            </Link>
            <Link href="/entrar" className="emp-btn text-sm !py-2 px-4">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="max-w-6xl mx-auto px-5 pt-16 md:pt-24 pb-14 text-center">
        <span className="emp-badge emp-in">
          <Ic name="sparkle" size={13} /> La app de IA para emprendedores
        </span>
        <h1 className="emp-in text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.02] mt-6 max-w-3xl mx-auto">
          De la idea al negocio,
          <br />
          <span className="emp-grad-text">con IA a tu lado.</span>
        </h1>
        <p className="emp-in emp-dim text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
          Valida tu idea, descubre qué negocio montar y sigue tu ruta hasta tu
          objetivo de ingresos — con una IA que te habla claro y un plan hecho
          para ti desde el minuto uno.
        </p>
        <div className="emp-in mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/entrar" className="emp-btn text-sm px-8">
            Empezar gratis <Ic name="arrowRight" size={15} />
          </Link>
          <a href="#como" className="emp-btn-ghost text-sm px-6">
            Ver cómo funciona
          </a>
        </div>
        <p className="text-[11px] emp-dim mt-4">Gratis · Sin tarjeta · Tu plan en 1 minuto</p>

        {/* Captura real del producto, con marco de navegador */}
        <div className="mt-14 relative emp-in max-w-5xl mx-auto">
          <div
            className="absolute -inset-x-16 -top-16 bottom-0 -z-10 pointer-events-none"
            style={{ background: 'radial-gradient(60% 65% at 50% 35%, rgba(91,140,255,.30), transparent 70%), radial-gradient(40% 50% at 80% 60%, rgba(34,211,238,.18), transparent 70%)', filter: 'blur(28px)' }}
          />
          <div
            className="rounded-2xl overflow-hidden border border-white/15"
            style={{ boxShadow: '0 50px 110px -30px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.05), inset 0 1px 0 rgba(255,255,255,.1)' }}
          >
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10" style={{ background: 'rgba(255,255,255,.05)' }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
              <span className="mx-auto text-[11px] emp-dim rounded-md px-3 py-0.5" style={{ background: 'rgba(255,255,255,.06)' }}>
                emprendia.app/panel
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/panel.png" alt="El panel de emprendIA: tu objetivo de capital, tu foco de la semana y tus análisis" className="w-full h-auto block" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto emp-stagger">
          {STATS.map((s) => (
            <div key={s.l} className="emp-inner px-4 py-4">
              <div className="text-2xl md:text-3xl font-black text-white">{s.n}</div>
              <div className="text-xs emp-dim mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="como" className="max-w-6xl mx-auto px-5 py-14 space-y-16">
        {FEATURES.map((f, i) => (
          <div key={f.k} className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 min-w-0">
              <span className="emp-badge mb-4"><Ic name={f.icon} size={13} /> {f.k}</span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">{f.t}</h2>
              <p className="emp-dim mt-4 leading-relaxed">{f.d}</p>
              <Link href="/entrar" className="inline-flex items-center gap-1.5 text-sm font-semibold emp-grad-text mt-5">
                Probarlo gratis <Ic name="arrowRight" size={14} className="text-cyan-300" />
              </Link>
            </div>
            <div className="flex-1 flex justify-center w-full">{f.mock}</div>
          </div>
        ))}
      </section>

      {/* ---------- Herramientas ---------- */}
      <section id="herramientas" className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Seis herramientas. <span className="emp-grad-text">Un objetivo: que factures.</span>
          </h2>
          <p className="emp-dim mt-3 max-w-md mx-auto">Cada una resuelve una duda concreta del camino, en menos de un minuto.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 emp-stagger">
          {MODULOS.map((m) => (
            <Link key={m.slug} href="/entrar" className="emp-tile group" style={{ ['--tile-grad' as string]: gradCss(m.grad, 90), ['--tile-c1' as string]: m.grad[0] }}>
              <Ic name="arrowUpRight" size={18} className="emp-tile-arrow" />
              <span className="emp-tile-icon text-white" style={{ background: gradCss(m.grad) }}>
                <Ic name={m.icon as IconName} size={24} />
              </span>
              <h3 className="font-semibold text-[15px] text-white">{m.nombre}</h3>
              <p className="text-sm emp-dim mt-1 leading-snug">{m.tagline}</p>
            </Link>
          ))}
          <Link href="/entrar" className="emp-tile group" style={{ ['--tile-grad' as string]: gradCss(['#5b8cff', '#4ade80'], 90), ['--tile-c1' as string]: '#5b8cff' }}>
            <Ic name="arrowUpRight" size={18} className="emp-tile-arrow" />
            <span className="emp-tile-icon text-white" style={{ background: gradCss(['#5b8cff', '#4ade80']) }}>
              <Ic name="route" size={24} />
            </span>
            <h3 className="font-semibold text-[15px] text-white">Tu plan de arranque</h3>
            <p className="text-sm emp-dim mt-1 leading-snug">Foco semanal + ruta a tu objetivo, al crear tu cuenta</p>
          </Link>
        </div>
      </section>

      {/* ---------- Precios ---------- */}
      <section id="precios" className="max-w-6xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Empieza gratis. <span className="emp-grad-text">Sube cuando factures.</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3 items-start max-w-4xl mx-auto emp-stagger">
          {[
            { n: 'Free', p: '0€', per: 'para siempre', f: ['Tu plan de arranque', 'Validación diaria', 'Roast + qué negocio montar'], top: false },
            { n: 'Pro', p: '14,99€', per: '/mes', f: ['Todo sin límites', 'Simulador + reto 30 días', 'Sin marca + export PDF', 'Mentor IA (próximamente)'], top: true },
            { n: 'Anual', p: '59,99€', per: '/año', f: ['Todo lo de Pro', 'Sale a 5 €/mes (-66%)', 'Novedades antes que nadie'], top: false },
          ].map((pl) => (
            <div
              key={pl.n}
              className="emp-card p-6"
              style={pl.top ? { border: '1.5px solid rgba(34,211,238,.5)', boxShadow: '0 30px 70px -24px rgba(91,140,255,.6)' } : undefined}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{pl.n}</h3>
                {pl.top && <span className="emp-badge text-[10px] !py-1">Más popular</span>}
              </div>
              <div className="mt-2 mb-4">
                <span className={`text-4xl font-black ${pl.top ? 'emp-grad-text' : 'text-white'}`}>{pl.p}</span>
                <span className="emp-dim text-sm"> {pl.per}</span>
              </div>
              <ul className="space-y-2.5">
                {pl.f.map((x) => (
                  <li key={x} className="text-sm flex gap-2 text-white/85">
                    <Ic name="check" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link href="/entrar" className={`${pl.top ? 'emp-btn' : 'emp-btn-ghost'} w-full mt-5 text-sm`}>
                {pl.n === 'Free' ? 'Empezar gratis' : `Elegir ${pl.n}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="max-w-3xl mx-auto px-5 py-14">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-center mb-8">
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="emp-card px-5 py-4 group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-semibold text-white text-sm">
                {f.q}
                <Ic name="arrowRight" size={14} className="emp-dim shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="emp-dim text-sm mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="emp-hero !p-10 md:!p-14 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight relative z-[1]">
            Deja de darle vueltas.
            <br />
            <span className="emp-grad-text">Empieza hoy.</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-md mx-auto relative z-[1]">
            Tu plan personalizado tarda un minuto y no cuesta nada. Lo difícil ya lo pones tú.
          </p>
          <div className="mt-7 relative z-[1]">
            <Link href="/entrar" className="emp-btn text-sm px-10">
              Crear mi cuenta gratis <Ic name="arrowRight" size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/10 mt-6">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <Wordmark />
          </div>
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm emp-dim">
            <a href="#herramientas" className="hover:text-white transition-colors">Herramientas</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/entrar" className="hover:text-white transition-colors">Entrar</Link>
          </nav>
          <p className="text-xs emp-dim">© 2026 emprendIA — hecho para que empieces de una vez.</p>
        </div>
      </footer>
    </div>
  );
}
