/**
 * Catálogo de módulos — metadatos seguros para usar en cliente y servidor.
 * NO importa el motor IA (que es server-only), así los componentes cliente
 * (sidebar, formularios) pueden usar esta lista sin arrastrar el SDK.
 *
 * `grad` = [color inicio, color fin] del acento del módulo (identidad visual).
 */
export const MODULOS = [
  {
    slug: 'que-negocio',
    nombre: '¿Qué negocio montar?',
    tagline: 'Descubre el negocio que encaja contigo',
    emoji: '🧭',
    grad: ['#6366f1', '#0ea5e9'],
  },
  {
    slug: 'validar',
    nombre: 'Validar idea',
    tagline: '¿Es buena tu idea? Nota + análisis honesto',
    emoji: '🔥',
    grad: ['#f97316', '#ef4444'],
  },
  {
    slug: 'roast',
    nombre: 'Roast a tu idea',
    tagline: 'La IA sin filtros te destroza (y te rescata)',
    emoji: '💀',
    grad: ['#d946ef', '#f43f5e'],
  },
  {
    slug: 'simulador',
    nombre: 'Simulador de ingresos',
    tagline: '¿Cuánto puedes ganar de verdad?',
    emoji: '💰',
    grad: ['#10b981', '#14b8a6'],
  },
  {
    slug: 'reto',
    nombre: 'Reto 30 días',
    tagline: 'De 0 a tus primeros clientes en un mes',
    emoji: '🚀',
    grad: ['#8b5cf6', '#d946ef'],
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
