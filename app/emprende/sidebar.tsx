'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MODULOS, gradCss } from '@/lib/emprende/catalog';
import { Ic, type IconName } from './icons';
import { getCuentaActiva, cerrarSesion, type Cuenta } from './cuentas';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-7 w-7 rounded-lg' : 'h-9 w-9 rounded-xl';
  return (
    <span
      className={cn('grid place-items-center text-white shadow-lg', s)}
      style={{
        background: gradCss(['#5b8cff', '#22d3ee']),
        boxShadow: '0 8px 20px -6px rgba(91,140,255,.7), inset 0 1px 0 rgba(255,255,255,.4)',
      }}
    >
      <Ic name="logo" size={size === 'sm' ? 15 : 19} />
    </span>
  );
}

export function EmprendeSidebar() {
  const pathname = usePathname();
  const enPanel = pathname === '/emprende';
  return (
    <aside className="hidden md:flex w-72 flex-col emp-side">
      <div className="h-16 flex items-center px-5">
        <Link href="/emprende" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-bold text-lg tracking-tight text-white">
            emprend<span className="emp-grad-text">IA</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto no-scrollbar">
        <Link href="/emprende" className={cn('emp-side-link', enPanel && 'active')}>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
            style={{ background: enPanel ? gradCss(['#5b8cff', '#22d3ee']) : 'rgba(91,140,255,.14)' }}
          >
            <Ic name="home" size={17} />
          </span>
          <span className="min-w-0">
            <span className="emp-side-name block text-sm font-semibold truncate">Mi panel</span>
            <span className="block text-xs emp-dim truncate">Tu rumbo, tu foco y tu plan de hoy</span>
          </span>
        </Link>

        <Link href="/emprende/calendario" className={cn('emp-side-link', pathname === '/emprende/calendario' && 'active')}>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
            style={{ background: pathname === '/emprende/calendario' ? gradCss(['#22d3ee', '#4ade80']) : 'rgba(34,211,238,.14)' }}
          >
            <Ic name="calendar" size={17} />
          </span>
          <span className="min-w-0">
            <span className="emp-side-name block text-sm font-semibold truncate">Calendario</span>
            <span className="block text-xs emp-dim truncate">Organízate: notas, objetivos y análisis</span>
          </span>
        </Link>

        <div className="px-2.5 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider emp-dim">
          Herramientas
        </div>

        {MODULOS.map((m) => {
          const href = `/emprende/${m.slug}`;
          const active = pathname === href;
          return (
            <Link key={m.slug} href={href} className={cn('emp-side-link', active && 'active')}>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
                style={{
                  background: active ? gradCss(m.grad) : `${m.grad[0]}22`,
                  boxShadow: active ? '0 6px 14px -4px rgba(0,0,0,.5)' : undefined,
                }}
              >
                <Ic name={m.icon as IconName} size={17} />
              </span>
              <span className="min-w-0">
                <span className="emp-side-name block text-sm font-semibold truncate">{m.nombre}</span>
                <span className="block text-xs emp-dim truncate">{m.tagline}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-3">
        <Link
          href="/emprende/config"
          className={cn('emp-side-link !py-2', pathname === '/emprende/config' && 'active')}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white" style={{ background: 'rgba(255,255,255,.07)' }}>
            <Ic name="settings" size={15} />
          </span>
          <span className="emp-side-name text-sm font-semibold">Configuración</span>
        </Link>
        <CuentaBox />
        <ProBtn />
      </div>
    </aside>
  );
}

export function EmprendeMobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden sticky top-0 z-30 emp-mnav">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/emprende" className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-bold tracking-tight text-white">emprend<span className="emp-grad-text">IA</span></span>
        </Link>
        <Link href="/emprende/pro" className="emp-btn px-3 py-1.5 text-xs">
          <Ic name="sparkle" size={13} /> Pro
        </Link>
      </div>
      <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto no-scrollbar">
        <Link
          href="/emprende"
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors inline-flex items-center gap-1.5',
            pathname === '/emprende' ? 'text-white border-transparent' : 'text-white/70 border-white/15 bg-white/5'
          )}
          style={pathname === '/emprende' ? { background: gradCss(['#5b8cff', '#22d3ee']) } : undefined}
        >
          <Ic name="home" size={12} /> Panel
        </Link>
        {MODULOS.map((m) => {
          const href = `/emprende/${m.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={m.slug}
              href={href}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors inline-flex items-center gap-1.5',
                active ? 'text-white border-transparent' : 'text-white/70 border-white/15 bg-white/5'
              )}
              style={active ? { background: gradCss(m.grad) } : undefined}
            >
              <Ic name={m.icon as IconName} size={12} /> {m.nombre}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


function CuentaBox() {
  const router = useRouter();
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  useEffect(() => setCuenta(getCuentaActiva()), []);
  if (!cuenta) return null;
  return (
    <div className="emp-inner p-3">
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-xl text-white font-black text-xs shrink-0"
          style={{ background: gradCss(['#5b8cff', '#22d3ee']) }}
        >
          {cuenta.perfil.nombre.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white truncate">{cuenta.perfil.nombre}</span>
          <span className="block text-[11px] emp-dim truncate">
            {`Plan ${cuenta.perfil.plan === 'pro' ? 'Pro' : 'Free'} · ${cuenta.email === 'cuenta-local' ? 'este dispositivo' : cuenta.email}`}
          </span>
        </span>
        <button
          title="Cambiar de cuenta"
          onClick={() => {
            cerrarSesion();
            router.push('/entrar');
          }}
          className="emp-dim hover:text-white transition-colors shrink-0 p-1"
        >
          <Ic name="x" size={15} />
        </button>
      </div>
    </div>
  );
}

function ProBtn() {
  const [esPro, setEsPro] = useState(false);
  useEffect(() => setEsPro(getCuentaActiva()?.perfil.plan === 'pro'), []);
  if (esPro) {
    return (
      <div className="emp-inner p-3 flex items-center gap-2.5" style={{ borderColor: 'rgba(34,211,238,.35)' }}>
        <Ic name="crown" size={16} className="text-cyan-300 shrink-0" />
        <span className="text-xs font-semibold text-white">Plan Pro activo</span>
      </div>
    );
  }
  return (
    <Link href="/emprende/pro" className="emp-btn w-full text-sm">
      <Ic name="sparkle" size={15} /> Hazte Pro
    </Link>
  );
}