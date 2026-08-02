'use client';
/**
 * /entrar — puerta de acceso a pantalla completa (estilo "Elige una cuenta").
 * Sin sidebar ni distracciones: eliges tu cuenta o creas una nueva, y entras.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gradCss } from '@/lib/emprende/catalog';
import { Ic } from '../emprende/icons';
import { Logo } from '../emprende/sidebar';
import { Onboarding } from '../emprende/onboarding';
import { getPerfil, type Perfil } from '../emprende/perfil';

export default function EntrarPage() {
  const router = useRouter();
  const [cargado, setCargado] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    setPerfil(getPerfil());
    setCargado(true);
  }, []);

  return (
    <div className="emp-app min-h-screen flex flex-col">
      {/* Cabecera mínima */}
      <header className="flex items-center justify-center pt-10 pb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-bold text-lg tracking-tight text-white">
            emprend<span className="emp-grad-text">IA</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-5 pb-16">
        {!cargado ? (
          <div className="w-full max-w-md space-y-3 mt-10">
            <div className="emp-skeleton h-8 w-2/3 mx-auto" />
            <div className="emp-skeleton h-40 w-full" />
          </div>
        ) : creando ? (
          <div className="w-full max-w-2xl mt-2">
            <Onboarding sinIntro onDone={() => router.push('/emprende')} />
          </div>
        ) : (
          /* ---------- Elige una cuenta ---------- */
          <div className="w-full max-w-md emp-in">
            <div className="emp-card p-7 md:p-9">
              <h1 className="text-2xl md:text-[28px] font-black tracking-tight text-white text-center">
                Elige una cuenta
              </h1>
              <p className="emp-dim text-sm text-center mt-1.5">
                para entrar en emprendIA
              </p>

              <div className="mt-7 space-y-3">
                {perfil && (
                  <button
                    onClick={() => router.push('/emprende')}
                    className="w-full flex items-center gap-4 emp-inner px-4 py-3.5 hover:border-white/25 transition-colors text-left group"
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl text-white font-black text-base shrink-0"
                      style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 8px 18px -6px rgba(91,140,255,.6)' }}
                    >
                      {perfil.nombre.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white truncate">{perfil.nombre}</span>
                      <span className="block text-xs emp-dim truncate">
                        Objetivo: {perfil.objetivoMensual.toLocaleString('es-ES')} €/mes · cuenta de este dispositivo
                      </span>
                    </span>
                    <Ic name="arrowRight" size={16} className="emp-dim group-hover:text-white transition-colors shrink-0" />
                  </button>
                )}

                <button
                  onClick={() => setCreando(true)}
                  className="w-full flex items-center gap-4 emp-inner px-4 py-3.5 hover:border-white/25 transition-colors text-left group"
                  style={{ borderStyle: 'dashed' }}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-white shrink-0 border border-white/15 bg-white/5">
                    <Ic name="user" size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">
                      {perfil ? 'Crear otra cuenta' : 'Crear mi cuenta'}
                    </span>
                    <span className="block text-xs emp-dim">
                      {perfil ? 'sustituye a la actual en este dispositivo' : '7 preguntas · 1 minuto · gratis'}
                    </span>
                  </span>
                  <Ic name="arrowRight" size={16} className="emp-dim group-hover:text-white transition-colors shrink-0" />
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] emp-dim mt-6 max-w-xs mx-auto leading-relaxed">
              Tu cuenta se guarda en este dispositivo. Al continuar aceptas usar
              emprendIA con cabeza: la IA aconseja, tú decides.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
