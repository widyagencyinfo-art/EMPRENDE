'use client';
/**
 * Checkout del plan Pro/Anual. El cobro real con Stripe llega en breve;
 * mientras, se puede activar Pro en modo prueba (sin tarjeta) para vivir
 * el flujo completo. Sin formularios de tarjeta falsos: honestidad ante todo.
 */
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Ic } from '../../icons';
import { getPerfil, updatePerfil } from '../../perfil';

const PLANES = {
  pro: {
    nombre: 'Pro mensual',
    precio: '14,99 €',
    periodo: '/mes',
    nota: 'Cancela cuando quieras',
    features: ['Todo sin límites', 'Simulador de ingresos completo', 'Reto de 30 días', 'Sin marca de agua + export PDF', 'Mentor IA (muy pronto)'],
  },
  anual: {
    nombre: 'Pro anual',
    precio: '59,99 €',
    periodo: '/año',
    nota: 'Sale a 5 €/mes · ahorras un 66%',
    features: ['Todo lo del Pro mensual', '7 meses gratis frente al mensual', 'Acceso anticipado a novedades'],
  },
} as const;

function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = (params.get('plan') === 'anual' ? 'anual' : 'pro') as keyof typeof PLANES;
  const p = PLANES[plan];
  const [nombre, setNombre] = useState('');
  const [activando, setActivando] = useState(false);

  useEffect(() => {
    const perfil = getPerfil();
    if (!perfil) router.replace('/entrar');
    else setNombre(perfil.nombre);
  }, [router]);

  function activarPrueba() {
    setActivando(true);
    updatePerfil({ plan: 'pro', proDesde: Date.now() });
    setTimeout(() => router.push('/emprende/pro/bienvenida'), 500);
  }

  return (
    <div className="max-w-2xl mx-auto p-5 md:p-10">
      <div className="mb-7 emp-in">
        <Link href="/emprende/pro" className="text-sm emp-dim hover:text-white transition-colors">
          ← Volver a planes
        </Link>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3">
          Un paso para ser <span className="emp-grad-text">Pro</span>
        </h1>
        {nombre && <p className="emp-dim mt-1.5">Buena decisión, {nombre}.</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_0.9fr] items-start emp-stagger">
        {/* Resumen del pedido */}
        <div className="emp-card p-6">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="receipt" size={15} className="emp-dim" /> Tu pedido
          </h2>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-black text-white text-lg flex items-center gap-2">
                <Ic name="crown" size={17} className="text-cyan-300" /> {p.nombre}
              </div>
              <div className="text-xs emp-dim mt-0.5">{p.nota}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black emp-grad-text">{p.precio}</div>
              <div className="text-xs emp-dim">{p.periodo}</div>
            </div>
          </div>
          <hr className="emp-hr my-4" />
          <ul className="space-y-2.5">
            {p.features.map((f) => (
              <li key={f} className="text-sm flex gap-2.5 text-white/85">
                <Ic name="check" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {plan === 'pro' ? (
            <Link href="/emprende/pro/checkout?plan=anual" className="text-xs emp-grad-text font-semibold mt-4 inline-block">
              ¿Y si te llevas el anual por 59,99 €? (-66 %) →
            </Link>
          ) : (
            <Link href="/emprende/pro/checkout?plan=pro" className="text-xs emp-dim hover:text-white mt-4 inline-block transition-colors">
              Prefiero el mensual (14,99 €/mes)
            </Link>
          )}
        </div>

        {/* Pago */}
        <div className="emp-card p-6">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="wallet" size={15} className="emp-dim" /> Pago
          </h2>

          <button onClick={activarPrueba} disabled={activando} className="emp-btn w-full text-sm">
            {activando ? 'Activando...' : 'Empezar prueba Pro gratis'}
          </button>
          <p className="text-[11px] emp-dim text-center mt-2">
            7 días de Pro completo · sin tarjeta · se queda en Free si no sigues
          </p>

          <div className="flex items-center gap-3 my-5">
            <hr className="emp-hr flex-1" />
            <span className="text-xs emp-dim">o</span>
            <hr className="emp-hr flex-1" />
          </div>

          <button disabled className="emp-btn-ghost w-full text-sm opacity-60 cursor-not-allowed">
            <Ic name="wallet" size={15} /> Pagar con tarjeta
          </button>
          <p className="text-[11px] emp-dim text-center mt-2">
            El pago seguro con Stripe se activa muy pronto. Hasta entonces, la prueba gratis te da acceso a todo.
          </p>

          <div className="emp-inner p-3 mt-5 flex items-start gap-2.5">
            <Ic name="check" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] emp-dim leading-relaxed">
              Sin permanencia, sin letra pequeña. Cancelas desde Configuración en un clic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-10"><div className="emp-skeleton h-40 w-full" /></div>}>
      <Checkout />
    </Suspense>
  );
}
