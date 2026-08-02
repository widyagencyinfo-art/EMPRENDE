'use client';
import Link from 'next/link';
import { MODULOS, gradCss } from '@/lib/emprende/catalog';
import { Ic, type IconName } from './icons';

// Mueve el halo radial hacia el cursor actualizando --mx/--my.
function onMove(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export function ModuleTiles() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 emp-stagger">
      {MODULOS.map((m) => (
        <Link
          key={m.slug}
          href={`/emprende/${m.slug}`}
          className="emp-tile group"
          onMouseMove={onMove}
          style={{
            ['--tile-grad' as string]: gradCss(m.grad, 90),
            ['--tile-c1' as string]: m.grad[0],
          }}
        >
          <Ic name="arrowUpRight" size={18} className="emp-tile-arrow" />
          <span className="emp-tile-icon text-white" style={{ background: gradCss(m.grad) }}>
            <Ic name={m.icon as IconName} size={24} />
          </span>
          <h3 className="font-semibold text-[15px] text-white">{m.nombre}</h3>
          <p className="text-sm emp-dim mt-1 leading-snug">{m.tagline}</p>
        </Link>
      ))}

      {/* Card de upsell Pro */}
      <Link
        href="/emprende/pro"
        className="emp-tile group"
        onMouseMove={onMove}
        style={{
          ['--tile-grad' as string]: gradCss(['#5b8cff', '#4ade80'], 90),
          ['--tile-c1' as string]: '#5b8cff',
        }}
      >
        <Ic name="arrowUpRight" size={18} className="emp-tile-arrow" />
        <span className="emp-tile-icon text-white" style={{ background: gradCss(['#5b8cff', '#4ade80']) }}>
          <Ic name="sparkle" size={24} />
        </span>
        <h3 className="font-semibold text-[15px] text-white">Hazte Pro</h3>
        <p className="text-sm emp-dim mt-1 leading-snug">
          Todo sin límites + mentor IA. Desde 19€/mes.
        </p>
      </Link>
    </div>
  );
}
