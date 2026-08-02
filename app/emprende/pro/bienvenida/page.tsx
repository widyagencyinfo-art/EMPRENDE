'use client';
/**
 * Bienvenida al plan Pro — la celebración tras activar el plan.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gradCss } from '@/lib/emprende/catalog';
import { Ic, type IconName } from '../../icons';
import { getPerfil } from '../../perfil';

const DESBLOQUEOS: { icon: IconName; t: string; d: string }[] = [
  { icon: 'zap', t: 'Sin límites', d: 'Analiza y valida todas las ideas que quieras, cuando quieras.' },
  { icon: 'coins', t: 'Simulador completo', d: 'Proyecciones de ingresos con escenarios y palancas.' },
  { icon: 'rocket', t: 'Reto 30 días', d: 'Tu plan de lanzamiento semana a semana.' },
  { icon: 'sparkle', t: 'Mentor IA', d: 'Muy pronto: tu mentor disponible 24/7.' },
];

// confeti simple con CSS (sin librerías)
const CONFETI = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 41) % 100,
  delay: (i % 8) * 0.22,
  dur: 2.6 + ((i * 7) % 10) / 6,
  color: ['#5b8cff', '#22d3ee', '#4ade80', '#f59e0b', '#f43f5e'][i % 5],
  size: 6 + ((i * 3) % 6),
}));

export default function BienvenidaProPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const p = getPerfil();
    if (!p) router.replace('/entrar');
    else if (p.plan !== 'pro') router.replace('/emprende/pro');
    else setNombre(p.nombre);
  }, [router]);

  return (
    <div className="max-w-2xl mx-auto p-5 md:p-10 relative">
      {/* Confeti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {CONFETI.map((c, i) => (
          <span
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${c.left}%`,
              top: -20,
              width: c.size,
              height: c.size * 0.6,
              background: c.color,
              animation: `emp-confeti ${c.dur}s ${c.delay}s ease-in forwards`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes emp-confeti { to { transform: translateY(88vh) rotate(540deg); opacity: 0; } }`}</style>

      <div className="emp-card p-8 md:p-12 text-center emp-in relative overflow-hidden mt-6">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: 'radial-gradient(70% 90% at 50% 0%, rgba(34,211,238,.20), transparent 70%)' }} />
        <span
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white mb-5"
          style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 16px 40px -10px rgba(34,211,238,.8)' }}
        >
          <Ic name="crown" size={30} />
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          Ya eres <span className="emp-grad-text">Pro</span>{nombre ? `, ${nombre}` : ''}.
        </h1>
        <p className="emp-dim mt-4 max-w-sm mx-auto leading-relaxed">
          Se acabaron los límites. Ahora la única variable eres tú: la IA está
          lista para trabajar todo lo que tú trabajes.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 mt-8 text-left">
          {DESBLOQUEOS.map((d) => (
            <div key={d.t} className="emp-inner p-4">
              <div className="flex items-center gap-2 font-semibold text-white text-sm">
                <Ic name={d.icon} size={15} className="text-cyan-300" /> {d.t}
              </div>
              <p className="text-xs emp-dim mt-1.5 leading-relaxed">{d.d}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/emprende" className="emp-btn text-sm px-8">
            Ir a mi panel <Ic name="arrowRight" size={15} />
          </Link>
          <Link href="/emprende/validar" className="emp-btn-ghost text-sm">
            Validar una idea ya
          </Link>
        </div>
      </div>
    </div>
  );
}
