'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MODULOS, gradCss } from '@/lib/emprende/catalog';

export function EmprendeSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-72 flex-col emp-side">
      <div className="h-16 flex items-center px-5">
        <Link href="/emprende" className="flex items-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white font-black text-lg"
            style={{ background: gradCss(['#7c3aed', '#d946ef']) }}
          >
            E
          </span>
          <span className="font-bold text-lg tracking-tight">
            Emprende<span className="emp-grad-text">.</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {MODULOS.map((m) => {
          const href = `/emprende/${m.slug}`;
          const active = pathname === href;
          return (
            <Link key={m.slug} href={href} className={cn('emp-side-link', active && 'active')}>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base"
                style={{ background: `${m.grad[0]}1a` }}
              >
                {m.emoji}
              </span>
              <span className="min-w-0">
                <span className="emp-side-name block text-sm font-semibold text-foreground truncate">
                  {m.nombre}
                </span>
                <span className="block text-xs text-muted-foreground truncate">{m.tagline}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/emprende/pro"
          className="emp-btn w-full px-4 py-2.5 text-sm"
        >
          ✨ Hazte Pro
        </Link>
      </div>
    </aside>
  );
}

export function EmprendeMobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/emprende" className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg text-white font-black text-sm"
            style={{ background: gradCss(['#7c3aed', '#d946ef']) }}
          >
            E
          </span>
          <span className="font-bold tracking-tight">Emprende</span>
        </Link>
        <Link href="/emprende/pro" className="emp-btn px-3 py-1.5 text-xs">
          ✨ Pro
        </Link>
      </div>
      <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto no-scrollbar">
        {MODULOS.map((m) => {
          const href = `/emprende/${m.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={m.slug}
              href={href}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                active ? 'text-white border-transparent' : 'bg-white text-foreground'
              )}
              style={active ? { background: gradCss(m.grad) } : undefined}
            >
              {m.emoji} {m.nombre}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
