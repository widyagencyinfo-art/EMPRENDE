'use client';
/**
 * Rendimiento del usuario — todo en localStorage (sin cuentas, sin backend).
 * Cada análisis completado suma XP y alimenta el centro de mando de la home.
 */

export type RunLog = {
  slug: string;
  t: number;
  nota?: number;
  /** entrada del usuario y respuesta completa de la IA (historial de conversaciones) */
  input?: Record<string, unknown>;
  output?: unknown;
};

const KEY = 'emprende_runs_v1';
const XP_POR_ANALISIS = 25;

export const NIVELES = [
  { nombre: 'Curioso', emoji: '👀', xp: 0 },
  { nombre: 'Explorador', emoji: '🧭', xp: 50 },
  { nombre: 'Validador', emoji: '🔍', xp: 125 },
  { nombre: 'Hustler', emoji: '⚡', xp: 250 },
  { nombre: 'Fundador', emoji: '🚀', xp: 450 },
  { nombre: 'CEO en prácticas', emoji: '👑', xp: 700 },
  { nombre: 'Imparable', emoji: '🔥', xp: 1000 },
] as const;

export function getRuns(): RunLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as RunLog[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function logRun(
  slug: string,
  nota?: number,
  convo?: { input: Record<string, unknown>; output: unknown }
) {
  if (typeof window === 'undefined') return;
  try {
    const runs = getRuns();
    runs.push({
      slug,
      t: Date.now(),
      ...(typeof nota === 'number' ? { nota } : {}),
      ...(convo ?? {}),
    });
    // cap para no crecer sin límite (los resultados completos pesan)
    window.localStorage.setItem(KEY, JSON.stringify(runs.slice(-60)));
  } catch {
    /* storage lleno o bloqueado: no pasa nada */
  }
}

/** Días seguidos (contando hoy o ayer como inicio válido) con ≥1 análisis. */
function calcRacha(runs: RunLog[]): number {
  if (!runs.length) return 0;
  const dias = new Set(runs.map((r) => new Date(r.t).toDateString()));
  const DIA = 86_400_000;
  let cursor = new Date();
  // si hoy no hay actividad, la racha puede seguir viva desde ayer
  if (!dias.has(cursor.toDateString())) cursor = new Date(cursor.getTime() - DIA);
  let racha = 0;
  while (dias.has(cursor.toDateString())) {
    racha++;
    cursor = new Date(cursor.getTime() - DIA);
  }
  return racha;
}

export function computeStats(runs: RunLog[]) {
  const total = runs.length;
  const notas = runs.filter((r) => typeof r.nota === 'number').map((r) => r.nota!) ;
  const notaMedia = notas.length
    ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10
    : null;
  const xp = total * XP_POR_ANALISIS;

  let nivelIdx = 0;
  for (let i = 0; i < NIVELES.length; i++) if (xp >= NIVELES[i].xp) nivelIdx = i;
  const nivel = NIVELES[nivelIdx];
  const siguiente = NIVELES[nivelIdx + 1] ?? null;
  const pctNivel = siguiente
    ? Math.min(100, Math.round(((xp - nivel.xp) / (siguiente.xp - nivel.xp)) * 100))
    : 100;

  return {
    total,
    notaMedia,
    racha: calcRacha(runs),
    xp,
    nivelIdx,
    nivel,
    siguiente,
    pctNivel,
    ultimasNotas: runs.filter((r) => typeof r.nota === 'number').slice(-7),
    recientes: [...runs].sort((a, b) => b.t - a.t).slice(0, 5),
  };
}

export function haceCuanto(t: number): string {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'ahora mismo';
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}
