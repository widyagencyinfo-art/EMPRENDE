import { z } from 'zod';
import { generateStructured } from '@/lib/ai/client';

/**
 * EL CONTENIDO — el cerebro de cada módulo del panel Emprende.
 *
 * Cada módulo = un esquema de salida (datos limpios) + un prompt experto.
 * Público objetivo: emprendedores jóvenes (Gen Z), tono directo y motivador,
 * español de España. Cero relleno, cero genérico: consejos accionables.
 */

// Preámbulo de marca compartido — define el "quién habla".
const VOZ = `Eres el copiloto de EMPRENDE, la plataforma para emprendedores jóvenes.
Hablas español de España, directo, cercano y motivador — como un mentor que ha
montado negocios de verdad, no como un libro de texto. Nada de humo ni de frases
de coach vacías. Cada cosa que dices es concreta, honesta y accionable. Piensas en
el mundo real: costes reales, plazos reales, competencia real. Prefieres una verdad
incómoda a un halago falso.`;

/* ------------------------------------------------------------------ */
/* 1. ¿QUÉ NEGOCIO MONTAR?  — el gancho de entrada más ancho          */
/* ------------------------------------------------------------------ */

export const QueNegocioInput = z.object({
  skills: z.string(),
  horasSemana: z.number(),
  presupuesto: z.number(),
  intereses: z.string(),
});
export type QueNegocioInput = z.infer<typeof QueNegocioInput>;

const QueNegocioOutput = z.object({
  match: z.string(), // el negocio recomendado, en una frase
  encaje: z.number(), // 0-100, cómo de bien encaja contigo
  porQue: z.string(), // por qué encaja con TU perfil
  potencialMensual: z.string(), // rango realista de ingresos, ej "800-2.500€/mes"
  tiempoArranque: z.string(), // ej "2-4 semanas hasta el primer euro"
  primerosPasos: z.array(z.string()), // 3-5 pasos concretos
  alternativas: z.array(
    z.object({ negocio: z.string(), motivo: z.string() })
  ), // 2 opciones B
});
export type QueNegocioOutput = z.infer<typeof QueNegocioOutput>;

export function queNegocio(input: QueNegocioInput) {
  return generateStructured({
    schema: QueNegocioOutput,
    system: VOZ,
    prompt: `Un emprendedor joven quiere montar algo pero no sabe el qué. Su perfil:
- Habilidades / lo que se le da bien: ${input.skills}
- Tiempo disponible: ${input.horasSemana} horas/semana
- Presupuesto para empezar: ${input.presupuesto}€
- Le interesa / le gusta: ${input.intereses}

Recomiéndale EL negocio que mejor encaja con SU perfil concreto (no genérico).
Explica por qué encaja con él en particular, da un rango realista de ingresos
mensuales alcanzable, cuánto tarda en ver el primer euro, los primeros pasos
concretos para arrancar, y 2 alternativas por si la primera no le convence.`,
  });
}

/* ------------------------------------------------------------------ */
/* 2. VALIDADOR DE IDEA  — el corazón                                 */
/* ------------------------------------------------------------------ */

export const ValidarInput = z.object({ idea: z.string() });
export type ValidarInput = z.infer<typeof ValidarInput>;

const ValidarOutput = z.object({
  nota: z.number(), // 0-10
  veredicto: z.string(), // una frase de sentencia
  mercado: z.string(), // tamaño y estado del mercado
  competencia: z.string(), // quién ya lo hace y hueco disponible
  publicoIdeal: z.string(), // a quién vendérselo primero
  riesgos: z.array(z.string()), // 2-4 riesgos reales
  primerosPasos: z.array(z.string()), // cómo empezar a validarla ya
  comoMejorarla: z.string(), // el giro que la haría mejor
});
export type ValidarOutput = z.infer<typeof ValidarOutput>;

export function validar(input: ValidarInput) {
  return generateStructured({
    schema: ValidarOutput,
    system: VOZ,
    prompt: `Valida esta idea de negocio con honestidad brutal pero constructiva:

"${input.idea}"

Dale una nota del 0 al 10 (0 = mala idea, 10 = oportunidad clara) y JUSTÍFICALA.
Analiza el mercado (tamaño, si crece o no), la competencia (quién ya lo hace y qué
hueco queda), a qué público concreto vendérselo primero, los riesgos reales, los
primeros pasos para validarla YA con poco dinero, y el giro que la haría mejor.`,
  });
}

/* ------------------------------------------------------------------ */
/* 3. ROAST  — el más viral                                           */
/* ------------------------------------------------------------------ */

export const RoastInput = z.object({ idea: z.string() });
export type RoastInput = z.infer<typeof RoastInput>;

const RoastOutput = z.object({
  roast: z.string(), // el zasca con humor, estilo TikTok
  nota: z.number(), // 0-10
  puntosDebiles: z.array(z.string()), // lo que no funciona, sin piedad
  peroPodriaFuncionarSi: z.string(), // el rescate: cómo sí funcionaría
  fraseCompartible: z.string(), // one-liner para pegar en redes
});
export type RoastOutput = z.infer<typeof RoastOutput>;

export function roast(input: RoastInput) {
  return generateStructured({
    schema: RoastOutput,
    effort: 'low',
    system: `${VOZ}
En este modo eres más gamberro: destrozas la idea con humor afilado estilo Gen Z /
TikTok, sin insultar a la persona pero sin piedad con la idea. Después SIEMPRE
rescatas: dices cómo sí podría funcionar. El objetivo es que dé risa y se comparta.`,
    prompt: `Hazle un ROAST a esta idea de negocio. Con gracia, honesto y con zasca:

"${input.idea}"

Dale una nota del 0 al 10, lista sus puntos débiles sin filtro, y luego rescátala
diciendo cómo sí podría funcionar. Termina con una frase corta y compartible para
redes (con gancho, que dé ganas de mandársela a un colega).`,
  });
}

/* ------------------------------------------------------------------ */
/* 4. SIMULADOR DE INGRESOS                                           */
/* ------------------------------------------------------------------ */

export const SimuladorInput = z.object({
  negocio: z.string(),
  precio: z.string(), // lo que cobraría (texto libre: "20€/mes", "500€ el proyecto")
});
export type SimuladorInput = z.infer<typeof SimuladorInput>;

const SimuladorOutput = z.object({
  supuestos: z.array(z.string()), // sobre qué se basa la estimación
  escenarios: z.array(
    z.object({
      nombre: z.string(), // Pesimista / Realista / Optimista
      clientesMes: z.number(),
      ingresosMes: z.number(),
      costesMes: z.number(),
      beneficioMes: z.number(),
    })
  ),
  mesesRecuperarInversion: z.string(),
  palancas: z.array(z.string()), // qué mover para ganar más
});
export type SimuladorOutput = z.infer<typeof SimuladorOutput>;

export function simulador(input: SimuladorInput) {
  return generateStructured({
    schema: SimuladorOutput,
    effort: 'medium',
    system: VOZ,
    prompt: `Haz una proyección de ingresos realista para este negocio:
- Negocio: ${input.negocio}
- Lo que cobraría: ${input.precio}

Da los supuestos en los que te basas, y tres escenarios (Pesimista, Realista,
Optimista) con nº de clientes al mes, ingresos, costes y beneficio mensual en euros.
Estima en cuántos meses recuperaría la inversión inicial y qué palancas concretas
puede mover para ganar más. Sé realista, no vendas humo.`,
  });
}

/* ------------------------------------------------------------------ */
/* 5. RETO 30 DÍAS  — la retención                                    */
/* ------------------------------------------------------------------ */

export const RetoInput = z.object({ negocio: z.string() });
export type RetoInput = z.infer<typeof RetoInput>;

const RetoOutput = z.object({
  objetivo: z.string(), // meta clara a 30 días
  semanas: z.array(
    z.object({
      semana: z.number(),
      foco: z.string(),
      tareas: z.array(z.string()), // tareas concretas de la semana
    })
  ),
  hito: z.string(), // qué habrá conseguido al día 30
});
export type RetoOutput = z.infer<typeof RetoOutput>;

export function reto(input: RetoInput) {
  return generateStructured({
    schema: RetoOutput,
    effort: 'medium',
    maxTokens: 5000,
    system: VOZ,
    prompt: `Diseña un reto de 30 días para lanzar este negocio desde cero:

"${input.negocio}"

Define un objetivo claro y ambicioso pero realista para el día 30 (idealmente:
primeros clientes o primeros euros). Divide el mes en 4 semanas, cada una con un
foco y tareas concretas y accionables (nada vago). Termina con el hito que habrá
conseguido al acabar. Que sea un plan que de verdad pueda seguir alguien con poco
tiempo.`,
  });
}

// Los metadatos del catálogo viven en ./catalog (seguros para cliente).
export { MODULOS, type ModuloSlug } from './catalog';
