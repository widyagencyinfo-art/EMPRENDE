'use client';
/**
 * Puerta de la app: si no hay cuenta creada en este dispositivo,
 * manda a /entrar (pantalla completa de acceso) antes de mostrar nada.
 */
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getPerfil } from './perfil';

export function RequireCuenta() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getPerfil()) {
      router.replace('/entrar');
    }
    // se re-evalúa en cada navegación dentro de la app
  }, [router, pathname]);

  return null;
}
