'use client';
/**
 * Configuración: cuenta, plan y facturación, datos e información.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gradCss } from '@/lib/emprende/catalog';
import { Ic } from '../icons';
import { getCuentaActiva, cerrarSesion, type Cuenta } from '../cuentas';
import { updatePerfil } from '../perfil';

export default function ConfigPage() {
  const router = useRouter();
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [cargado, setCargado] = useState(false);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);

  function refresh() {
    setCuenta(getCuentaActiva());
    setCargado(true);
  }
  useEffect(refresh, []);

  if (!cargado || !cuenta) {
    return (
      <div className="max-w-3xl mx-auto p-5 md:p-10 space-y-4">
        <div className="emp-skeleton h-10 w-1/2" />
        <div className="emp-skeleton h-40 w-full" />
      </div>
    );
  }

  const perfil = cuenta.perfil;
  const esPro = perfil.plan === 'pro';

  function borrarHistorial() {
    try {
      window.localStorage.removeItem('emprende_runs_v1');
    } catch {}
    setConfirmandoBorrado(false);
    router.push('/emprende');
  }

  return (
    <div className="max-w-3xl mx-auto p-5 md:p-10">
      <div className="mb-8 emp-in">
        <div className="text-xs emp-dim flex items-center gap-1.5">
          <Ic name="settings" size={13} /> Ajustes
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">Configuración</h1>
      </div>

      <div className="space-y-5 emp-stagger">
        {/* Cuenta */}
        <section className="emp-card p-6">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="user" size={15} className="emp-dim" /> Cuenta
          </h2>
          <div className="flex items-center gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-white font-black text-lg shrink-0"
              style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 10px 22px -8px rgba(91,140,255,.7)' }}
            >
              {perfil.nombre.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-lg">{perfil.nombre}</div>
              <div className="text-sm emp-dim truncate">
                {cuenta.email === 'cuenta-local' ? 'Cuenta local de este dispositivo' : cuenta.email}
                {cuenta.google ? ' · Google' : cuenta.hash ? ' · con contraseña' : ''}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => {
                cerrarSesion();
                router.push('/entrar');
              }}
              className="emp-btn-ghost text-sm"
            >
              <Ic name="refresh" size={14} /> Cambiar de cuenta
            </button>
            <button
              onClick={() => {
                cerrarSesion();
                router.push('/');
              }}
              className="emp-btn-ghost text-sm"
            >
              <Ic name="x" size={14} /> Cerrar sesión
            </button>
          </div>
        </section>

        {/* Plan y facturación */}
        <section className="emp-card p-6" id="facturacion">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="wallet" size={15} className="emp-dim" /> Plan y facturación
          </h2>

          <div
            className="rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-4"
            style={
              esPro
                ? { borderColor: 'rgba(34,211,238,.4)', background: 'linear-gradient(120deg, rgba(91,140,255,.14), rgba(34,211,238,.10))' }
                : { borderColor: 'rgba(255,255,255,.1)', background: 'rgba(255,255,255,.03)' }
            }
          >
            <div>
              <div className="font-black text-white text-lg flex items-center gap-2">
                {esPro && <Ic name="crown" size={18} className="text-cyan-300" />}
                Plan {esPro ? 'Pro' : 'Free'}
              </div>
              <div className="text-xs emp-dim mt-0.5">
                {esPro
                  ? `Activo desde el ${new Date(perfil.proDesde ?? Date.now()).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} · sin límites`
                  : 'Herramientas base con límites diarios'}
              </div>
            </div>
            {esPro ? (
              <button
                onClick={() => {
                  updatePerfil({ plan: 'free' });
                  refresh();
                }}
                className="emp-btn-ghost text-xs"
              >
                Volver a Free
              </button>
            ) : (
              <Link href="/emprende/pro/checkout?plan=pro" className="emp-btn text-sm">
                <Ic name="sparkle" size={14} /> Mejorar a Pro
              </Link>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm emp-inner px-4 py-3">
              <span className="emp-dim">Método de pago</span>
              <span className="text-white/80">{esPro ? 'Prueba gratuita · sin tarjeta' : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm emp-inner px-4 py-3">
              <span className="emp-dim">Historial de pagos</span>
              <span className="text-white/80">Sin cargos todavía</span>
            </div>
          </div>
          <p className="text-[11px] emp-dim mt-3">
            El cobro real con tarjeta (Stripe) se activa en breve; hasta entonces el plan Pro funciona en modo prueba.
          </p>
        </section>

        {/* Datos */}
        <section className="emp-card p-6">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="history" size={15} className="emp-dim" /> Tus datos
          </h2>
          <p className="text-sm emp-dim leading-relaxed">
            Todo se guarda en este dispositivo: tu perfil, tu plan, tus conversaciones con la IA y tu calendario.
            Muy pronto podrás sincronizarlo en la nube con tu cuenta.
          </p>
          {confirmandoBorrado ? (
            <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'rgba(244,63,94,.35)', background: 'rgba(244,63,94,.08)' }}>
              <p className="text-sm text-white font-semibold">¿Borrar todo tu historial de análisis?</p>
              <p className="text-xs emp-dim mt-1">Tus conversaciones con la IA y tus estadísticas se perderán. Tu cuenta y tu plan se mantienen.</p>
              <div className="flex gap-2.5 mt-3">
                <button onClick={borrarHistorial} className="emp-btn-ghost text-xs" style={{ borderColor: 'rgba(244,63,94,.5)', color: '#fda4af' }}>
                  Sí, borrar historial
                </button>
                <button onClick={() => setConfirmandoBorrado(false)} className="emp-btn-ghost text-xs">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmandoBorrado(true)} className="emp-btn-ghost text-xs mt-4">
              Borrar historial de análisis
            </button>
          )}
        </section>

        {/* Información */}
        <section className="emp-card p-6">
          <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <Ic name="lightbulb" size={15} className="emp-dim" /> Información
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between emp-inner px-4 py-3">
              <span className="emp-dim">Versión</span>
              <span className="text-white/80">emprendIA 1.0</span>
            </div>
            <div className="flex items-center justify-between emp-inner px-4 py-3">
              <span className="emp-dim">Motor</span>
              <span className="text-white/80">IA Claude · análisis en ~30 s</span>
            </div>
            <div className="flex items-center justify-between emp-inner px-4 py-3">
              <span className="emp-dim">Hecho en</span>
              <span className="text-white/80">España 🇪🇸 · 2026</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
