/**
 * Set de iconos propio (SVG stroke, estilo línea fina).
 * Sustituye a los emojis para que la app tenga identidad de producto.
 */
import type { SVGProps } from 'react';

export type IconName = keyof typeof PATHS;

const PATHS = {
  // marca / navegación
  logo: (
    <>
      <path d="M12 3.5 19 11h-4.2v6.5a1 1 0 0 1-1 1h-3.6a1 1 0 0 1-1-1V11H5l7-7.5Z" fill="currentColor" stroke="none" />
      <path d="M8.2 20.5h7.6" strokeWidth="2.4" />
    </>
  ),
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  arrowRight: <path d="M4 12h16m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H9m8 0v8" />,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  refresh: <path d="M20 11a8 8 0 1 0-2.3 6.3M20 5v6h-6" />,
  history: <path d="M12 8v4l3 3m6-3a9 9 0 1 1-2.6-6.3M21 3v6h-6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  pen: <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17l-1 4Zm11-13 3 3" />,
  sparkle: <path d="M12 3v4m0 10v4m9-9h-4M7 12H3m13.4-5.4-2.1 2.1M8.7 15.3l-2.1 2.1m0-10.8 2.1 2.1m6.6 6.6 2.1 2.1" />,

  // módulos
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  flame: <path d="M12 3s5.5 4.5 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2 1-4 2.5-5.5 0 2 .8 3 2 3.5C10.5 8 11 5.5 12 3Z" />,
  coins: (
    <>
      <circle cx="9" cy="9" r="6" />
      <path d="M14.8 7.3A6 6 0 1 1 7.3 14.8M7 9h4M9 7v4" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 15c-1-4 .5-8.5 4-11 1.5 1 2.5 2.5 3 4.5-1 4-4.5 7-7 6.5Z" />
      <path d="M12 15c-2-.5-4 0-5.5 1.5L9 19c1.5-1.5 3.5-3 3-4ZM6 12l3-3m5 10 3-3" />
    </>
  ),

  // wizard / onboarding
  briefcase: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-12 5h18" />
    </>
  ),
  store: <path d="M4 10 5.5 4h13L20 10m-16 0v10h16V10m-16 0a3 3 0 0 0 5.3 0 3 3 0 0 0 5.4 0 3 3 0 0 0 5.3 0M9 20v-6h6v6" />,
  megaphone: <path d="M3 11v3l4 1 2 5h2l-1.5-5H14l6 3V5l-6 3H7l-4 3Zm16-2v6" />,
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" />,
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-1-2 .5-3 2.5-3H18a3 3 0 0 0 3-3c0-5.5-4-10-9-10Z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.2 7.6 20 18M8.2 16.4 20 6" />
    </>
  ),
  utensils: <path d="M7 3v7a2 2 0 0 1-2-2V3m2 0v18M4 3v5m13-5c-1.5 1-2.5 3-2.5 6 0 2 1 3 2.5 3v10m0-19c1.5 1 2.5 3 2.5 6 0 2-1 3-2.5 3" />,
  moon: <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2.5" />
    </>
  ),
  zap: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 9h18m-5 5h2" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5M8.5 11h4m-4 2h4" />
    </>
  ),
  banknote: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M5 12h.01M19 12h.01" />
    </>
  ),
  stack: <path d="M4 17h16M4 13h16M7 9h13v8M4 5h13v3" />,
  chart: <path d="M4 20V10m5.3 10V4m5.4 16v-8m5.3 8V7M3 20h18" />,
  trending: <path d="m3 17 6-6 4 4 8-8m0 0h-5m5 0v5" />,
  medal: (
    <>
      <circle cx="12" cy="14" r="5" />
      <path d="m8.5 10 -2.5-7m4.6 5.5L8.5 3m7 7 2.5-7m-4.6 5.5L15.5 3m-4.9 9.6 1.4-1.1 1.4 1.1-.5-1.7 1.4-1.1h-1.7L12 8l-.5 1.8H9.8l1.4 1.1-.6 1.7Z" />
    </>
  ),
  star: <path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.2L12 17.2 6.4 20.2l1.2-6.2L3 9.6l6.3-.8L12 3Z" />,
  brain: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="M10 3v3m4-3v3m-4 15v-3m4 3v-3M3 10h3m-3 4h3m12-4h3m-3 4h3M9.5 9.5h.01M14.5 9.5h.01m-4 4.5c.8 1 3.2 1 4 0" />
    </>
  ),
  shirt: <path d="m8 4-5 4 2.5 3L8 9.5V20h8V9.5l2.5 1.5L21 8l-5-4a3 3 0 0 1-8 0Z" />,
  dumbbell: <path d="M2 12h3m14 0h3M7 8v8m10-8v8M7 12h10M5 9v6M19 9v6" />,
  phone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  gamepad: (
    <>
      <rect x="2" y="7" width="20" height="11" rx="4" />
      <path d="M7 10.5v4M5 12.5h4m6.5 1.5h.01M18 11h.01" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="9" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <path d="M12 12c-2.8 0-5 2.2-5 4.4 0 1.4 1.1 2.1 2.4 1.7 1-.3 1.7-.5 2.6-.5s1.6.2 2.6.5c1.3.4 2.4-.3 2.4-1.7 0-2.2-2.2-4.4-5-4.4Z" />
    </>
  ),
  leaf: <path d="M5 20C4 10 10 4 21 3c.5 10-4 17-13 16-1.5-.2-2.5-.5-3 1Zm2-3c2-4 5-7 9-9" />,
  cube: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="m4 10 4-6h8l4 6m-12 0v10m8-10v10" />
    </>
  ),
  coffee: <path d="M5 9h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Zm11 1h2a2.5 2.5 0 0 1 0 5h-2M8 5c0-1 .5-1.5.5-2m3 2c0-1 .5-1.5.5-2" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" />
    </>
  ),
  repeat: <path d="M17 3l4 4-4 4M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4m14-2v2a2 2 0 0 1-2 2H3" />,
  receipt: <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Zm3 5h6m-6 4h6" />,
  flag: <path d="M5 21V4m0 1h13l-2.5 3.5L18 12H5" />,
  route: (
    <>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" strokeDasharray="3 3" />
    </>
  ),
  lightbulb: <path d="M9 18h6m-5 3h4m3-11a5 5 0 1 0-8.5 3.5c.8.8 1.5 1.5 1.5 2.5h4c0-1 .7-1.7 1.5-2.5A5 5 0 0 0 17 10Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19 12c0-.6-.1-1.1-.2-1.6l2-1.5-2-3.4-2.3 1a7.4 7.4 0 0 0-2.7-1.6L13.4 2h-3l-.4 2.5a7.4 7.4 0 0 0-2.7 1.6l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3.2l-2 1.5 2 3.4 2.3-1a7.4 7.4 0 0 0 2.7 1.6l.4 2.5h3l.4-2.5a7.4 7.4 0 0 0 2.7-1.6l2.3 1 2-3.4-2-1.5c.1-.5.2-1 .2-1.6Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4m8-4v4M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17.5h.01M12 17.5h.01" />
    </>
  ),
  crown: <path d="M4 18h16M4 18 3 7l5 4 4-7 4 7 5-4-1 11H4Z" />,
} as const;

export function Ic({
  name,
  size = 20,
  ...rest
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
