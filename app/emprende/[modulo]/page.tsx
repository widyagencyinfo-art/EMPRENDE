import { notFound } from 'next/navigation';
import { MODULOS, type ModuloSlug } from '@/lib/emprende/catalog';
import { Runner } from './runner';

export function generateStaticParams() {
  return MODULOS.map((m) => ({ modulo: m.slug }));
}

export default async function ModuloPage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  const existe = MODULOS.some((m) => m.slug === modulo);
  if (!existe) notFound();
  return <Runner slug={modulo as ModuloSlug} />;
}
