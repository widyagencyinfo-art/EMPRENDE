import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Cliente de Claude para todo el producto Emprende, inicializado de forma
// perezosa: solo se crea cuando se hace la primera llamada real (así el build
// no falla al importar los módulos sin ANTHROPIC_API_KEY en el entorno).
let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

// Modelo configurable por entorno. Por defecto Haiku 4.5: rapidísimo y barato
// (~0,5 cént por respuesta), calidad de sobra para estos módulos y aguanta
// muchísimo volumen. Para más calidad: EMPRENDE_AI_MODEL=claude-sonnet-5 o
// claude-opus-5.
export const AI_MODEL = process.env.EMPRENDE_AI_MODEL || 'claude-haiku-4-5';

// El parámetro `effort` solo lo aceptan los modelos de gama alta (Opus/Sonnet 5,
// Opus 4.x, Fable). Haiku 4.5 y Sonnet 4.5 dan error 400 si se lo mandas.
function soportaEffort(model: string): boolean {
  return !/haiku|sonnet-4-5/.test(model);
}

// Esfuerzo por defecto: bajo. Estas tareas son acotadas (un informe, una nota),
// así responde rápido y barato. Se puede subir por llamada si hace falta.
type Effort = 'low' | 'medium' | 'high';

export interface GenerateOpts<S extends z.ZodTypeAny> {
  system: string;
  prompt: string;
  schema: S;
  maxTokens?: number;
  effort?: Effort;
}

/**
 * Convierte un esquema Zod a JSON Schema compatible con structured outputs
 * (objetos cerrados, todas las claves requeridas — sin $ref para simplificar).
 */
function toJsonSchema<S extends z.ZodTypeAny>(schema: S) {
  return zodToJsonSchema(schema, { target: 'openApi3', $refStrategy: 'none' });
}

/**
 * Genera una respuesta estructurada y validada contra un esquema Zod.
 * Usa structured outputs de Claude (la respuesta cumple el esquema) y además
 * validamos con Zod para tener el objeto tipado y seguro.
 */
export async function generateStructured<S extends z.ZodTypeAny>(
  opts: GenerateOpts<S>
): Promise<z.infer<S>> {
  const { system, prompt, schema, maxTokens = 4000, effort = 'low' } = opts;

  const output_config: Record<string, unknown> = {
    format: {
      type: 'json_schema',
      schema: toJsonSchema(schema) as Record<string, unknown>,
    },
  };
  // Solo añadimos `effort` si el modelo lo soporta (evita 400 en Haiku).
  if (soportaEffort(AI_MODEL)) output_config.effort = effort;

  const response = await getClient().messages.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
    output_config: output_config as any,
  });

  // Con structured outputs, la respuesta es un único bloque de texto con el JSON.
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('La IA no devolvió un resultado. Inténtalo de nuevo.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    throw new Error('La IA devolvió un formato inesperado. Inténtalo de nuevo.');
  }

  return schema.parse(parsed);
}
