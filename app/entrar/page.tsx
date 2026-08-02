'use client';
/**
 * /entrar — acceso a pantalla completa estilo Shopify:
 *  lista de cuentas → (agregar cuenta) email → contraseña / registro → onboarding.
 * Cuentas locales de este dispositivo; Google se activa con NEXT_PUBLIC_GOOGLE_CLIENT_ID.
 */
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gradCss } from '@/lib/emprende/catalog';
import { Ic } from '../emprende/icons';
import { Logo } from '../emprende/sidebar';
import { Onboarding } from '../emprende/onboarding';
import type { Perfil } from '../emprende/perfil';
import {
  listarCuentas,
  getCuenta,
  activarCuenta,
  loginConPassword,
  crearCuenta,
  hashPassword,
  type Cuenta,
} from '../emprende/cuentas';

const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type Fase = 'cargando' | 'lista' | 'email' | 'password' | 'registro' | 'quiz';

export default function EntrarPage() {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>('cargando');
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  // credenciales pendientes mientras se hace el onboarding
  const pendiente = useRef<{ email: string; hash: string | null; google: boolean }>({ email: '', hash: null, google: false });
  const googleDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cs = listarCuentas();
    setCuentas(cs);
    setFase(cs.length > 0 ? 'lista' : 'email');
  }, []);

  /* ---------- Google Identity ---------- */
  function onGoogleCred(resp: { credential: string }) {
    try {
      const payload = JSON.parse(atob(resp.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const gEmail = String(payload.email || '').toLowerCase();
      if (!gEmail) throw new Error('sin email');
      const existente = getCuenta(gEmail);
      if (existente) {
        activarCuenta(existente.email);
        router.push('/emprende');
      } else {
        pendiente.current = { email: gEmail, hash: null, google: true };
        setFase('quiz');
      }
    } catch {
      setError('No pude leer tu cuenta de Google. Prueba con tu correo.');
    }
  }

  function initGoogle() {
    const g = (window as any).google;
    if (!GOOGLE_ID || !g?.accounts?.id || !googleDiv.current) return;
    g.accounts.id.initialize({ client_id: GOOGLE_ID, callback: onGoogleCred });
    g.accounts.id.renderButton(googleDiv.current, {
      theme: 'filled_black',
      size: 'large',
      width: 320,
      text: 'continue_with',
      locale: 'es',
    });
  }

  /* ---------- Email ---------- */
  function continuarEmail() {
    setError(null);
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError('Escribe un correo válido.');
      return;
    }
    setEmail(e);
    setFase(getCuenta(e) ? 'password' : 'registro');
  }

  async function entrarConPass() {
    setError(null);
    const ok = await loginConPassword(email, pass);
    if (ok) router.push('/emprende');
    else setError('Contraseña incorrecta.');
  }

  async function crearYSeguir() {
    setError(null);
    if (pass.length < 6) {
      setError('Mínimo 6 caracteres.');
      return;
    }
    pendiente.current = { email, hash: await hashPassword(pass), google: false };
    setFase('quiz');
  }

  function guardarPerfil(p: Perfil) {
    const { email: e, hash, google } = pendiente.current;
    crearCuenta(e, hash, p, google);
  }

  const volverALista = cuentas.length > 0;

  return (
    <div className="emp-app min-h-screen flex flex-col">
      {GOOGLE_ID && <Script src="https://accounts.google.com/gsi/client" onReady={initGoogle} />}

      <header className="flex items-center justify-center pt-10 pb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-bold text-lg tracking-tight text-white">
            emprend<span className="emp-grad-text">IA</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-5 pb-16">
        {fase === 'cargando' && (
          <div className="w-full max-w-md space-y-3 mt-10">
            <div className="emp-skeleton h-8 w-2/3 mx-auto" />
            <div className="emp-skeleton h-40 w-full" />
          </div>
        )}

        {/* ---------- Lista de cuentas ---------- */}
        {fase === 'lista' && (
          <div className="w-full max-w-md emp-in">
            <div className="emp-card p-7 md:p-9">
              <h1 className="text-2xl md:text-[28px] font-black tracking-tight text-white text-center">
                Elige una cuenta
              </h1>
              <p className="emp-dim text-sm text-center mt-1.5">para entrar en emprendIA</p>

              <div className="mt-7 space-y-3">
                {cuentas.map((c) => (
                  <button
                    key={c.email}
                    onClick={() => {
                      if (c.hash) {
                        setEmail(c.email);
                        setPass('');
                        setError(null);
                        setFase('password');
                      } else {
                        activarCuenta(c.email);
                        router.push('/emprende');
                      }
                    }}
                    className="w-full flex items-center gap-4 emp-inner px-4 py-3.5 hover:border-white/25 transition-colors text-left group"
                  >
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl text-white font-black text-base shrink-0"
                      style={{ background: gradCss(['#5b8cff', '#22d3ee']), boxShadow: '0 8px 18px -6px rgba(91,140,255,.6)' }}
                    >
                      {c.perfil.nombre.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white truncate">{c.perfil.nombre}</span>
                      <span className="block text-xs emp-dim truncate">
                        {c.email === 'cuenta-local' ? 'cuenta de este dispositivo' : c.email}
                        {c.google ? ' · Google' : ''}
                      </span>
                    </span>
                    <Ic name="arrowRight" size={16} className="emp-dim group-hover:text-white transition-colors shrink-0" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setEmail('');
                    setPass('');
                    setError(null);
                    setFase('email');
                  }}
                  className="w-full flex items-center gap-4 emp-inner px-4 py-3.5 hover:border-white/25 transition-colors text-left group"
                  style={{ borderStyle: 'dashed' }}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-white shrink-0 border border-white/15 bg-white/5">
                    <Ic name="user" size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">Agregar cuenta</span>
                    <span className="block text-xs emp-dim">con tu correo o Google</span>
                  </span>
                  <Ic name="arrowRight" size={16} className="emp-dim group-hover:text-white transition-colors shrink-0" />
                </button>
              </div>
            </div>
            <PiePuerta />
          </div>
        )}

        {/* ---------- Email (estilo Shopify) ---------- */}
        {fase === 'email' && (
          <div className="w-full max-w-md emp-in">
            <div className="emp-card p-7 md:p-9">
              <h1 className="text-2xl md:text-[28px] font-black tracking-tight text-white text-center">
                Inicia sesión
              </h1>
              <p className="emp-dim text-sm text-center mt-1.5">o crea tu cuenta en un minuto</p>

              <label className="block text-sm font-semibold text-white mt-7 mb-1.5">Correo electrónico</label>
              <input
                autoFocus
                type="email"
                className="emp-input"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && continuarEmail()}
              />
              <button onClick={continuarEmail} className="emp-btn w-full text-sm mt-4">
                Continuar con correo electrónico
              </button>

              <div className="flex items-center gap-3 my-5">
                <hr className="emp-hr flex-1" />
                <span className="text-xs emp-dim">o</span>
                <hr className="emp-hr flex-1" />
              </div>

              {GOOGLE_ID ? (
                <div ref={googleDiv} className="flex justify-center" />
              ) : (
                <button
                  onClick={() => setAviso('El acceso con Google se activa muy pronto. Mientras, entra con tu correo 👆')}
                  className="emp-btn-ghost w-full text-sm"
                >
                  <GoogleG /> Continuar con Google
                </button>
              )}

              {aviso && <p className="text-xs emp-dim text-center mt-3">{aviso}</p>}
              {error && <ErrorMsg msg={error} />}
            </div>
            {volverALista && <Volver onClick={() => setFase('lista')} />}
            <PiePuerta />
          </div>
        )}

        {/* ---------- Contraseña (cuenta existente) ---------- */}
        {fase === 'password' && (
          <div className="w-full max-w-md emp-in">
            <div className="emp-card p-7 md:p-9">
              <h1 className="text-2xl font-black tracking-tight text-white text-center">Hola de nuevo</h1>
              <p className="emp-dim text-sm text-center mt-1.5 truncate">{email}</p>

              <label className="block text-sm font-semibold text-white mt-7 mb-1.5">Contraseña</label>
              <input
                autoFocus
                type="password"
                className="emp-input"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && entrarConPass()}
              />
              <button onClick={entrarConPass} className="emp-btn w-full text-sm mt-4">
                Entrar <Ic name="arrowRight" size={15} />
              </button>
              {error && <ErrorMsg msg={error} />}
            </div>
            <Volver onClick={() => setFase(volverALista ? 'lista' : 'email')} />
          </div>
        )}

        {/* ---------- Registro: crear contraseña ---------- */}
        {fase === 'registro' && (
          <div className="w-full max-w-md emp-in">
            <div className="emp-card p-7 md:p-9">
              <h1 className="text-2xl font-black tracking-tight text-white text-center">Crea tu cuenta</h1>
              <p className="emp-dim text-sm text-center mt-1.5 truncate">{email}</p>

              <label className="block text-sm font-semibold text-white mt-7 mb-1.5">Elige una contraseña</label>
              <input
                autoFocus
                type="password"
                className="emp-input"
                placeholder="mínimo 6 caracteres"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && crearYSeguir()}
              />
              <button onClick={crearYSeguir} className="emp-btn w-full text-sm mt-4">
                Crear cuenta y continuar <Ic name="arrowRight" size={15} />
              </button>
              <p className="text-[11px] emp-dim text-center mt-3">
                Después te hago 7 preguntas rápidas para montar tu plan personalizado.
              </p>
              {error && <ErrorMsg msg={error} />}
            </div>
            <Volver onClick={() => setFase('email')} />
          </div>
        )}

        {/* ---------- Onboarding (7 preguntas) ---------- */}
        {fase === 'quiz' && (
          <div className="w-full max-w-2xl mt-2">
            <Onboarding sinIntro guardar={guardarPerfil} onDone={() => router.push('/emprende')} />
          </div>
        )}
      </main>
    </div>
  );
}

function Volver({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mx-auto mt-5 flex items-center gap-1.5 text-sm emp-dim hover:text-white transition-colors">
      ← Volver
    </button>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="text-sm text-center mt-3" style={{ color: '#fda4af' }}>
      {msg}
    </p>
  );
}

function PiePuerta() {
  return (
    <p className="text-center text-[11px] emp-dim mt-6 max-w-xs mx-auto leading-relaxed">
      Tus cuentas se guardan en este dispositivo. La IA aconseja, tú decides.
    </p>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.2 13.4 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.8c4.4-4.1 7.2-10.1 7.2-17.5Z" />
      <path fill="#FBBC05" d="M10.3 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1Z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.2-2 15-5.5l-7.4-5.8c-2 1.4-4.6 2.2-7.6 2.2-6.4 0-11.8-3.9-13.7-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}
