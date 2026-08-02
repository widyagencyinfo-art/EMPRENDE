'use client';
/**
 * Eventos del calendario — notas/citas que el usuario apunta por día.
 * Guardados por cuenta (email) en localStorage.
 */
import { getCuentaActiva } from './cuentas';

export type Evento = { id: string; fecha: string; texto: string }; // fecha YYYY-MM-DD

const KEY = 'emprendia_eventos_v1';

type Store = Record<string, Evento[]>; // email → eventos

function leer(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function guardar(s: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* lleno */
  }
}

function emailActivo(): string | null {
  return getCuentaActiva()?.email ?? null;
}

export function getEventos(): Evento[] {
  const e = emailActivo();
  if (!e) return [];
  return leer()[e] ?? [];
}

export function addEvento(fecha: string, texto: string): Evento[] {
  const e = emailActivo();
  if (!e) return [];
  const s = leer();
  const lista = s[e] ?? [];
  lista.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, fecha, texto });
  s[e] = lista.slice(-500);
  guardar(s);
  return s[e];
}

export function delEvento(id: string): Evento[] {
  const e = emailActivo();
  if (!e) return [];
  const s = leer();
  s[e] = (s[e] ?? []).filter((x) => x.id !== id);
  guardar(s);
  return s[e];
}
