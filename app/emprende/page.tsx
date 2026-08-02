import Link from 'next/link';
import { MODULOS, gradCss } from '@/lib/emprende/catalog';

export default function EmprendeHome() {
  return (
    <div className="max-w-5xl mx-auto p-5 md:p-10">
      {/* Hero */}
      <section className="emp-hero emp-in">
        <span className="emp-badge bg-white/15 text-white mb-4">
          🚀 Para emprendedores jóvenes
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-3xl">
          De la idea al negocio,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: gradCss(['#fda4ff', '#fdba74']) }}
          >
            con IA a tu lado.
          </span>
        </h1>
        <p className="mt-4 text-white/70 text-base md:text-lg max-w-xl">
          Valida tu idea, descubre qué montar y lanza tu proyecto en semanas. Sin
          humo, sin excusas. Empieza gratis 👇
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/emprende/que-negocio" className="emp-btn px-6 py-3 text-sm">
            Descubrir mi negocio
          </Link>
          <Link
            href="/emprende/validar"
            className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            Validar mi idea
          </Link>
        </div>
      </section>

      {/* Módulos */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Elige tu herramienta</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 emp-stagger">
          {MODULOS.map((m) => (
            <Link
              key={m.slug}
              href={`/emprende/${m.slug}`}
              className="emp-tile group"
              style={{ ['--tile-grad' as string]: gradCss(m.grad, 90) }}
            >
              <span
                className="emp-tile-icon text-white"
                style={{ background: gradCss(m.grad) }}
              >
                {m.emoji}
              </span>
              <h3 className="font-semibold group-hover:translate-x-0.5 transition-transform">
                {m.nombre}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{m.tagline}</p>
            </Link>
          ))}

          {/* Card de upsell */}
          <Link
            href="/emprende/pro"
            className="emp-tile flex flex-col justify-center items-start"
            style={{ ['--tile-grad' as string]: gradCss(['#7c3aed', '#fb923c']) }}
          >
            <span className="emp-tile-icon text-white" style={{ background: gradCss(['#7c3aed', '#fb923c']) }}>
              ✨
            </span>
            <h3 className="font-semibold">Hazte Pro</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Todo sin límites + mentor IA. Desde 19€/mes.
            </p>
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-10">
        Hecho para que dejes de darle vueltas y empieces de una vez.
      </p>
    </div>
  );
}
