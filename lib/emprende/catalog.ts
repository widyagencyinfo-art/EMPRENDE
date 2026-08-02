/**
 * Catálogo de módulos — metadatos seguros para usar en cliente y servidor.
 * NO importa el motor IA (que es server-only), así los componentes cliente
 * (sidebar, formularios) pueden usar esta lista sin arrastrar el SDK.
 *
 * `grad` = [color inicio, color fin] del acento del módulo (identidad visual).
 * `icon` = nombre del icono SVG propio (app/emprende/icons.tsx).
 */
export const MODULOS = [
  {
    slug: 'que-negocio',
    nombre: '¿Qué negocio montar?',
    tagline: 'Descubre el negocio que encaja contigo',
    icon: 'compass',
    grad: ['#5b8cff', '#22d3ee'],
  },
  {
    slug: 'validar',
    nombre: 'Validar idea',
    tagline: '¿Es buena tu idea? Nota + análisis honesto',
    icon: 'target',
    grad: ['#22c55e', '#14b8a6'],
  },
  {
    slug: 'roast',
    nombre: 'Prueba de fuego',
    tagline: 'La crítica dura que te ahorra meses y dinero',
    icon: 'flame',
    grad: ['#f43f5e', '#fb923c'],
  },
  {
    slug: 'simulador',
    nombre: 'Simulador de ingresos',
    tagline: '¿Cuánto puedes ganar de verdad?',
    icon: 'coins',
    grad: ['#f59e0b', '#fbbf24'],
  },
  {
    slug: 'reto',
    nombre: 'Reto 30 días',
    tagline: 'De 0 a tus primeros clientes en un mes',
    icon: 'rocket',
    grad: ['#8b5cf6', '#6366f1'],
  },
] as const;

export type Modulo = (typeof MODULOS)[number];
export type ModuloSlug = Modulo['slug'];

export function getModulo(slug: string): Modulo | undefined {
  return MODULOS.find((m) => m.slug === slug);
}

/** Devuelve un gradiente CSS listo para usar en `style`. */
export function gradCss(grad: readonly [string, string], angle = 135): string {
  return `linear-gradient(${angle}deg, ${grad[0]}, ${grad[1]})`;
}
