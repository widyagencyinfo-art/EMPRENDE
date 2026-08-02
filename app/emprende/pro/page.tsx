import Link from 'next/link';
import { gradCss } from '@/lib/emprende/catalog';

const PLANES = [
  {
    nombre: 'Free',
    precio: '0€',
    periodo: 'para siempre',
    destacado: false,
    features: [
      '1 validación de idea al día',
      'Roast a tu idea',
      'Descubre qué negocio montar',
      'Resultados con marca Rumbo',
    ],
    cta: 'Empezar gratis',
    href: '/emprende',
  },
  {
    nombre: 'Pro',
    precio: '14,99€',
    periodo: '/mes',
    destacado: true,
    features: [
      'Todo lo del Free, sin límites',
      'Simulador de ingresos completo',
      'Reto de 30 días personalizado',
      'Mentor IA 24/7 (próximamente)',
      'Sin marca de agua + export PDF',
    ],
    cta: 'Hazte Pro',
    href: '/emprende/pro/checkout?plan=pro',
  },
  {
    nombre: 'Anual',
    precio: '59,99€',
    periodo: '/año',
    destacado: false,
    features: [
      'Todo lo del plan Pro',
      'Sale a 5 €/mes (ahorras un 66%)',
      'Acceso anticipado a novedades',
    ],
    cta: 'Ahorrar con Anual',
    href: '/emprende/pro/checkout?plan=anual',
  },
];

export default function ProPage() {
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      <div className="text-center mb-12 emp-in">
        <span className="emp-badge mb-4">Planes</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Empieza gratis. Sube a <span className="emp-grad-text">Pro</span>
          <br className="hidden md:block" /> cuando vayas en serio.
        </h1>
        <p className="emp-dim mt-3 max-w-md mx-auto">
          Todo lo que necesitas para lanzar tu negocio, en un solo sitio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start emp-stagger">
        {PLANES.map((p) => (
          <div
            key={p.nombre}
            className={`emp-card p-6 flex flex-col relative ${p.destacado ? 'md:-mt-4 md:mb-4' : ''}`}
            style={
              p.destacado
                ? {
                    border: '1.5px solid rgba(34,211,238,.5)',
                    boxShadow: '0 30px 70px -24px rgba(91,140,255,.6), 0 0 0 1px rgba(34,211,238,.2)',
                    background: 'linear-gradient(180deg, rgba(91,140,255,.12), rgba(255,255,255,.02))',
                  }
                : undefined
            }
          >
            {p.destacado && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-xs font-semibold text-white whitespace-nowrap"
                style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 8px 20px -6px rgba(34,211,238,.7)' }}
              >
                Más popular
              </span>
            )}
            <h2 className="font-bold text-lg text-white">{p.nombre}</h2>
            <div className="mt-2 mb-5">
              <span className={`text-5xl font-black ${p.destacado ? 'emp-grad-text' : 'text-white'}`}>{p.precio}</span>
              <span className="emp-dim text-sm"> {p.periodo}</span>
            </div>
            <ul className="space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="text-sm flex gap-2.5 text-white/85">
                  <span className="emp-grad-text font-bold shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.destacado ? (
              <Link href={p.href} className="emp-btn mt-6 text-sm">
                {p.cta} →
              </Link>
            ) : (
              <Link href={p.href} className="emp-btn-ghost mt-6 text-sm">
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 emp-card p-6 md:p-7 emp-in">
        <h3 className="font-bold text-white mb-4 text-center">Preguntas rápidas</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin permanencia ni letra pequeña. Cancelas en un clic.' },
            { q: '¿El Free sirve de verdad?', a: 'Sí. Validas y descubres negocios gratis. Pro es para uso intensivo.' },
            { q: '¿Cómo se paga?', a: 'Con tarjeta vía Stripe (pago seguro). Se activa en el siguiente paso.' },
          ].map((f) => (
            <div key={f.q} className="emp-inner p-4">
              <div className="font-semibold text-sm text-white mb-1">{f.q}</div>
              <p className="text-sm emp-dim leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs emp-dim mt-8">
        Empieza con 7 días de Pro gratis, sin tarjeta. El pago con Stripe se
        activa muy pronto.
      </p>
    </div>
  );
}
