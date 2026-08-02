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
      'Resultados con marca Emprende',
    ],
    cta: 'Empezar gratis',
    href: '/emprende',
  },
  {
    nombre: 'Pro',
    precio: '19€',
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
    href: '#',
  },
  {
    nombre: 'Anual',
    precio: '149€',
    periodo: '/año',
    destacado: false,
    features: [
      'Todo lo del plan Pro',
      'Ahorras un 35% (2 meses gratis)',
      'Acceso anticipado a novedades',
    ],
    cta: 'Ahorrar con Anual',
    href: '#',
  },
];

export default function ProPage() {
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      <div className="text-center mb-10 emp-in">
        <span className="emp-badge mb-3" style={{ background: '#7c3aed15', color: '#7c3aed' }}>
          ✨ Planes
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Empieza gratis. Sube a <span className="emp-grad-text">Pro</span> cuando vayas en serio.
        </h1>
        <p className="text-muted-foreground mt-2">
          Todo lo que necesitas para lanzar tu negocio, en un solo sitio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 emp-stagger">
        {PLANES.map((p) => (
          <div
            key={p.nombre}
            className={`emp-card p-6 flex flex-col relative ${p.destacado ? 'md:-mt-3 md:mb-3' : ''}`}
            style={
              p.destacado
                ? { boxShadow: '0 24px 50px -20px rgba(124,58,237,.45)', border: '1.5px solid #7c3aed' }
                : undefined
            }
          >
            {p.destacado && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                style={{ background: gradCss(['#7c3aed', '#d946ef']) }}
              >
                Más popular
              </span>
            )}
            <h2 className="font-bold text-lg">{p.nombre}</h2>
            <div className="mt-2 mb-4">
              <span className={`text-4xl font-black ${p.destacado ? 'emp-grad-text' : ''}`}>{p.precio}</span>
              <span className="text-muted-foreground text-sm"> {p.periodo}</span>
            </div>
            <ul className="space-y-2.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="text-sm flex gap-2">
                  <span className="emp-grad-text font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.destacado ? (
              <Link href={p.href} className="emp-btn mt-6 py-2.5 text-sm">
                {p.cta}
              </Link>
            ) : (
              <Link
                href={p.href}
                className="mt-6 inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        El pago con Stripe se conecta en el siguiente paso — la fontanería de
        suscripciones ya está montada en el proyecto.
      </p>
    </div>
  );
}
