'use client';
/**
 * Cuentas locales estilo Shopify: varias cuentas por dispositivo, cada una con
 * su email (+contraseña opcional o Google) y su perfil completo.
 * Sin backend: todo vive en localStorage de este navegador.
 */
import type { Perfil } from './perfil';

export type Cuenta = {
  email: string;
  /** hash sha-256 de la contraseña; null si entró con Google */
  hash: string | null;
  google?: boolean;
  perfil: Perfil;
  creada: number;
};

type Store = { cuentas: Cuenta[]; activa: string | null };

const KEY = 'emprendia_cuentas_v1';
const LEGACY = 'rumbo_perfil_v1';

function leer(): Store {
  if (typeof window === 'undefined') return { cuentas: [], activa: null };
  try {
    const raw = window.localStorage.getItem(KEY);
    const s = raw ? (JSON.parse(raw) as Store) : { cuentas: [], activa: null };
    if (!Array.isArray(s.cuentas)) return { cuentas: [], activa: null };
    return s;
  } catch {
    return { cuentas: [], activa: null };
  }
}

function guardar(s: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* sin hueco */
  }
}

/** Migra el perfil de la versión sin cuentas (una sola, sin email). */
function migrar(s: Store): Store {
  if (s.cuentas.length > 0) return s;
  try {
    const raw = window.localStorage.getItem(LEGACY);
    if (!raw) return s;
    const perfil = JSON.parse(raw) as Perfil;
    if (!perfil?.nombre) return s;
    const cuenta: Cuenta = {
      email: 'cuenta-local',
      hash: null,
      perfil,
      creada: perfil.creado || Date.now(),
    };
    const nuevo = { cuentas: [cuenta], activa: 'cuenta-local' };
    guardar(nuevo);
    window.localStorage.removeItem(LEGACY);
    return nuevo;
  } catch {
    return s;
  }
}

export async function hashPassword(pass: string): Promise<string> {
  const data = new TextEncoder().encode(`emprendia:${pass}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function listarCuentas(): Cuenta[] {
  return migrar(leer()).cuentas;
}

export function getCuenta(email: string): Cuenta | undefined {
  return listarCuentas().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getCuentaActiva(): Cuenta | null {
  const s = migrar(leer());
  if (!s.activa) return null;
  return s.cuentas.find((c) => c.email === s.activa) ?? null;
}

export function activarCuenta(email: string) {
  const s = migrar(leer());
  if (s.cuentas.some((c) => c.email === email)) {
    s.activa = email;
    guardar(s);
  }
}

export function cerrarSesion() {
  const s = migrar(leer());
  s.activa = null;
  guardar(s);
}

export async function loginConPassword(email: string, pass: string): Promise<boolean> {
  const c = getCuenta(email);
  if (!c || !c.hash) return false;
  const h = await hashPassword(pass);
  if (h !== c.hash) return false;
  activarCuenta(c.email);
  return true;
}

/** Crea la cuenta (tras el onboarding) y la deja activa. */
export function crearCuenta(email: string, hash: string | null, perfil: Perfil, google = false) {
  const s = migrar(leer());
  const idx = s.cuentas.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());
  const cuenta: Cuenta = { email, hash, google, perfil, creada: Date.now() };
  if (idx >= 0) s.cuentas[idx] = cuenta;
  else s.cuentas.push(cuenta);
  s.activa = cuenta.email;
  guardar(s);
}

/** Actualiza el perfil de la cuenta activa (lo usa el panel). */
export function actualizarPerfilActivo(patch: Partial<Perfil>): Perfil | null {
  const s = migrar(leer());
  const c = s.activa ? s.cuentas.find((x) => x.email === s.activa) : null;
  if (!c) return null;
  c.perfil = { ...c.perfil, ...patch };
  guardar(s);
  return c.perfil;
}
