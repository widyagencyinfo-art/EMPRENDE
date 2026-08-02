'use client';
/**
 * Adapta las herramientas al perfil de cada usuario: sugiere su propio
 * negocio como respuesta rápida, y da a la IA su contexto real (capital,
 * tiempo, punto de partida) para que el análisis encaje con él, no con
 * un emprendedor genérico.
 */
import type { IconName } from './icons';
import { getPerfil } from './perfil';
import { getRuns } from './stats';

export type SugerenciaPersonal = { icon: IconName; label: string; hint: string; value: string };

// Los textos fijos de "área" del onboarding — si el área NO es uno de estos,
// el usuario la escribió con sus propias palabras (opción "Otro") y es un
// dato mucho más útil que cualquier ejemplo genérico.
const AREAS_FIJAS = new Set([
  'Todavía no tiene idea clara, está explorando qué montar',
  'Vende servicios: agencia, freelance o consultoría',
  'Tienda online o producto físico',
  'Creación de contenido, redes y marca personal',
  'Apps, software o SaaS',
  'Negocio físico o local',
]);

function acortar(s: string, n = 46): string {
  return s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
}

/** Tarjeta "Mi negocio": usa el negocio ya descubierto con la IA, o el área si la escribió a mano. */
export function getSugerenciaPersonal(): SugerenciaPersonal | null {
  const perfil = getPerfil();
  if (!perfil) return null;

  const ultimoNegocio = [...getRuns()]
    .reverse()
    .find((r) => r.slug === 'que-negocio' && typeof (r.output as any)?.match === 'string');
  if (ultimoNegocio) {
    const match = (ultimoNegocio.output as any).match as string;
    return { icon: 'target', label: 'Mi negocio', hint: acortar(match), value: match };
  }

  if (!AREAS_FIJAS.has(perfil.area) && perfil.area.trim()) {
    return { icon: 'briefcase', label: 'Mi negocio', hint: acortar(perfil.area), value: perfil.area };
  }

  return null;
}

/** Resumen del perfil que se manda a la IA (nunca al usuario) para que adapte el análisis a su realidad. */
export function getContextoPerfil(): string | undefined {
  const perfil = getPerfil();
  if (!perfil) return undefined;
  return (
    `Área: ${perfil.area}. Punto de partida: ${perfil.experiencia}. ` +
    `Capital disponible para invertir: ${perfil.dineroDisponible}€. ` +
    `Tiempo disponible: ${perfil.horasSemana} h/semana. ` +
    `Objetivo de ingresos: ${perfil.objetivoMensual}€/mes.`
  );
}
