import { NextResponse } from 'next/server';
import {
  queNegocio,
  validar,
  roast,
  simulador,
  reto,
  brief,
  QueNegocioInput,
  ValidarInput,
  RoastInput,
  SimuladorInput,
  RetoInput,
  BriefInput,
} from '@/lib/emprende/modules';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Enruta cada módulo a su función del motor, validando la entrada con Zod.
const HANDLERS = {
  'que-negocio': (b: unknown) => queNegocio(QueNegocioInput.parse(b)),
  validar: (b: unknown) => validar(ValidarInput.parse(b)),
  roast: (b: unknown) => roast(RoastInput.parse(b)),
  simulador: (b: unknown) => simulador(SimuladorInput.parse(b)),
  reto: (b: unknown) => reto(RetoInput.parse(b)),
  brief: (b: unknown) => brief(BriefInput.parse(b)),
} as const;

type Modulo = keyof typeof HANDLERS;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ modulo: string }> }
) {
  const { modulo } = await params;
  const handler = HANDLERS[modulo as Modulo];
  if (!handler) {
    return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  try {
    const resultado = await handler(body);
    return NextResponse.json({ resultado });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Algo salió mal generando el resultado.';
    // Errores de validación Zod → 400; el resto → 500
    const isValidation = err instanceof Error && err.name === 'ZodError';
    return NextResponse.json({ error: message }, { status: isValidation ? 400 : 500 });
  }
}
