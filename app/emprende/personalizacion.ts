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
export type EjemploCard = { icon: IconName; label: string; hint?: string; value: string };

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

// Ejemplos por categoría de área — para que "elige un ejemplo para probar"
// tenga que ver con lo que el usuario dijo que hace, no con lo primero que
// se nos ocurriera (paseador de perros no pinta nada si eres agencia).
const EJEMPLOS_POR_AREA: Record<string, EjemploCard[]> = {
  'Vende servicios: agencia, freelance o consultoría': [
    { icon: 'megaphone', label: 'Agencia de redes', hint: 'para negocios locales', value: 'Gestionar las redes sociales de negocios locales por una cuota mensual' },
    { icon: 'brain', label: 'Consultoría con IA', hint: 'para pymes', value: 'Ayudar a pymes a automatizar tareas repetitivas con herramientas de IA' },
    { icon: 'palette', label: 'Diseño por suscripción', hint: 'para marcas pequeñas', value: 'Servicio de diseño gráfico mensual para pequeñas marcas' },
    { icon: 'code', label: 'Webs freelance', hint: 'negocios sin presencia online', value: 'Crear webs y tiendas online para negocios que no tienen presencia digital' },
  ],
  'Tienda online o producto físico': [
    { icon: 'shirt', label: 'Ropa con diseños propios', hint: 'tienda online', value: 'Tienda online de ropa con diseños propios' },
    { icon: 'scissors', label: 'Producto artesanal', hint: 'hecho a mano', value: 'Productos hechos a mano vendidos online, tipo velas o cerámica' },
    { icon: 'leaf', label: 'Cosmética natural', hint: 'marca propia', value: 'Marca propia de cosmética natural o suplementos' },
    { icon: 'cube', label: 'Nicho muy concreto', hint: 'dropshipping', value: 'Tienda especializada en un nicho muy concreto' },
  ],
  'Creación de contenido, redes y marca personal': [
    { icon: 'lightbulb', label: 'Contenido + cursos', hint: 'nicho educativo', value: 'Cuenta de contenido educativo en un nicho concreto con cursos de pago' },
    { icon: 'pen', label: 'Newsletter de pago', hint: 'tema muy específico', value: 'Newsletter de pago sobre un tema muy específico' },
    { icon: 'user', label: 'Gestión de comunidad', hint: 'para marcas', value: 'Gestionar la comunidad y redes de marcas que no tienen tiempo' },
    { icon: 'phone', label: 'Edición de vídeo', hint: 'para creadores', value: 'Servicio de edición de vídeo para otros creadores de contenido' },
  ],
  'Apps, software o SaaS': [
    { icon: 'code', label: 'App de reservas', hint: 'peluquerías y barberías', value: 'Una app para reservar cita en peluquerías y barberías del barrio' },
    { icon: 'receipt', label: 'SaaS de facturación', hint: 'para autónomos', value: 'Herramienta SaaS de facturación sencilla para autónomos' },
    { icon: 'globe', label: 'Extensión de Chrome', hint: 'productividad', value: 'Extensión de Chrome que resuelve un problema muy concreto de productividad' },
    { icon: 'brain', label: 'Micro-SaaS de IA', hint: 'nicho específico', value: 'Micro-SaaS con IA para un nicho muy específico' },
  ],
  'Negocio físico o local': [
    { icon: 'coffee', label: 'Cafetería especialidad', hint: 'para llevar', value: 'Cafetería de especialidad para llevar en zona de oficinas' },
    { icon: 'palette', label: 'Estudio de tatuajes', hint: 'estilo propio', value: 'Estudio de tatuajes con estilo propio' },
    { icon: 'dumbbell', label: 'Box de entrenamiento', hint: 'funcional', value: 'Gimnasio boutique o box de entrenamiento funcional' },
    { icon: 'store', label: 'Tienda de barrio', hint: 'producto concreto', value: 'Tienda de barrio especializada en un producto muy concreto' },
  ],
};

/** Ejemplos de idea/negocio ajustados a la categoría que eligió en el registro (null si aún explora o escribió "Otro"). */
export function getEjemplosPersonalizados(): EjemploCard[] | null {
  const perfil = getPerfil();
  if (!perfil) return null;
  return EJEMPLOS_POR_AREA[perfil.area] ?? null;
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
