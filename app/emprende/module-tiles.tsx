'use client';
import Link from 'next/link';
import { MODULOS, gradCss } from '@/lib/emprende/catalog';

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="emp-tile-arrow">
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
          <ArrowIcon />
          <span className="emp-tile-icon text-white" style={{ background: gradCss(m.grad) }}>
            {m.emoji}
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
          ['--tile-grad' as string]: gradCss(['#8b5cf6', '#fb923c'], 90),
          ['--tile-c1' as string]: '#8b5cf6',
        }}
      >
        <ArrowIcon />
        <span className="emp-tile-icon text-white" style={{ background: gradCss(['#8b5cf6', '#fb923c']) }}>
          ✨
        </span>
        <h3 className="font-semibold text-[15px] text-white">Hazte Pro</h3>
        <p className="text-sm emp-dim mt-1 leading-snug">
          Todo sin límites + mentor IA. Desde 19€/mes.
        </p>
      </Link>
    </div>
  );
}
