'use client';
/**
 * Perfil del usuario. Desde la versión multi-cuenta, el perfil vive DENTRO de
 * la cuenta activa (./cuentas.ts); estas funciones son la fachada que usa el
 * resto de la app (panel, puerta, onboarding legacy).
 */
import { getCuentaActiva, actualizarPerfilActivo } from './cuentas';

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
  accionesHechas: number[]; // índices de acciones del plan marcadas
  accionesFechas?: Record<number, number>; // idx → timestamp de cuándo se completó
  plan?: 'free' | 'pro';
  proDesde?: number;
  brief: Brief | null;
  creado: number;
};

/** Perfil de la cuenta activa (o null si nadie ha iniciado sesión). */
export function getPerfil(): Perfil | null {
  if (typeof window === 'undefined') return null;
  return getCuentaActiva()?.perfil ?? null;
}

export function updatePerfil(patch: Partial<Perfil>): Perfil | null {
  return actualizarPerfilActivo(patch);
}

/** Compat: guardar el perfil completo sobre la cuenta activa. */
export function savePerfil(p: Perfil) {
  actualizarPerfilActivo(p);
}
