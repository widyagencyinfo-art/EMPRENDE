'use client';
/**
 * Perfil del usuario — el "registro" de Rumbo, guardado en localStorage.
 * Incluye su objetivo de capital, sus ingresos actuales y el plan (brief)
 * que la IA le genera al entrar.
 */

export type Brief = {
  diagnostico: string;
  focoSemana: string;
  acciones: string[];
  ruta: { hito: string; como: string }[];
  consejo: string;
};

export type Perfil = {
  nombre: string;
  area: string;
  experiencia: string;
  dineroDisponible: number;
  objetivoMensual: number;
  horasSemana: number;
  bloqueo: string;
  ingresosActuales: number; // €/mes que factura HOY (editable desde el panel)
  accionesHechas: number[]; // índices de acciones del foco marcadas
  brief: Brief | null;
  creado: number;
};

const KEY = 'rumbo_perfil_v1';

export function getPerfil(): Perfil | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Perfil) : null;
  } catch {
    return null;
  }
}

export function savePerfil(p: Perfil) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* sin hueco: mala suerte, no rompemos la app */
  }
}

export function updatePerfil(patch: Partial<Perfil>): Perfil | null {
  const actual = getPerfil();
  if (!actual) return null;
  const nuevo = { ...actual, ...patch };
  savePerfil(nuevo);
  return nuevo;
}
