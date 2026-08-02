# emprendIA (antes Emprende/Rumbo) — memoria del proyecto

Herramientas con IA para **emprendedores jóvenes**: validar tu idea, descubrir qué
negocio montar, roast, simulador de ingresos y reto de 30 días. Modelo freemium
(Free / Pro / Anual). Todo orgánico (sin ads) — el output compartible es el motor.

> Contexto: nació dentro del repo interno `widy-panel` y se **extrajo a este repo
> propio e independiente** (sin Supabase/Stripe/nada de widy-panel).

## Stack
Next.js 15 (App Router) · React 19 · Claude (Anthropic SDK) · Tailwind · deploy en Vercel.

## Arranque
```bash
npm install
cp .env.example .env.local   # pon tu ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000 → redirige a /emprende
```

## Variables de entorno
- `ANTHROPIC_API_KEY` — **obligatoria** (si falta, la IA da 401)
- `EMPRENDE_AI_MODEL` — opcional, por defecto `claude-haiku-4-5`
  (barato ~0,47 cént/respuesta; para más calidad: `claude-sonnet-5` / `claude-opus-5`)

## Estructura
```
app/
  layout.tsx            # layout raíz (html/body, Inter, globals)
  page.tsx              # redirige a /emprende
  emprende/
    layout.tsx          # sidebar + nav móvil (identidad visual propia)
    page.tsx            # home con hero + grid de módulos
    sidebar.tsx         # EmprendeSidebar + EmprendeMobileNav
    pro/page.tsx        # planes (Free / Pro / Anual)
    [modulo]/page.tsx   # ruta dinámica por módulo (SSG con generateStaticParams)
    [modulo]/runner.tsx # cliente: formulario + loading + resultados + compartir
  api/emprende/[modulo]/route.ts  # POST → enruta a cada función del motor
lib/
  ai/client.ts          # cliente Claude lazy + generateStructured (Zod→JSON Schema)
  emprende/catalog.ts   # MODULOS (metadatos + color de acento) — CLIENT-SAFE
  emprende/modules.ts   # EL CONTENIDO: prompts + esquemas Zod de cada módulo (server-only)
  utils/index.ts        # cn()
app/globals.css         # sistema de diseño namespaced .emp-* (gradientes, etc.)
```

## Motor IA (cómo funciona)
- `lib/ai/client.ts` → `generateStructured({system, prompt, schema})`:
  convierte el esquema **Zod a JSON Schema** (`zod-to-json-schema`, ya sale con
  `additionalProperties:false` + `required`) y llama a Claude con
  `output_config.format` (**structured outputs** → respuesta siempre válida),
  luego valida con Zod. Devuelve el objeto tipado.
- **Importante:** `effort` solo se manda a modelos que lo soportan (Opus/Sonnet 5,
  Opus 4.x). Haiku 4.5 y Sonnet 4.5 dan **400** si les mandas `effort` → se omite.
- Cliente **lazy** (no se instancia al importar) para que el build no falle sin key.
- `catalog.ts` NO importa el motor → los componentes cliente lo usan sin arrastrar el SDK.

## Módulos (slug → función en modules.ts)
- `que-negocio` → `queNegocio()` — test de encaje por perfil
- `validar` → `validar()` — nota 0-10 + análisis honesto (el corazón)
- `roast` → `roast()` — zasca con humor (el más viral)
- `simulador` → `simulador()` — 3 escenarios de ingresos
- `reto` → `reto()` — plan de 30 días por semanas

## Planes
- **Free** (0€): 1 validación/día, roast, qué negocio, con marca. → motor orgánico.
- **Pro** (19€/mes): todo sin límites + simulador + reto + (mentor IA próximamente) + sin marca + PDF.
- **Anual** (149€/año): Pro con ~35% dto.

## Verificado
- `build` + `typecheck` en verde.
- Los 5 módulos probados en vivo con API real (HTTP 200).
- Coste medido: ~0,47 cént/respuesta con Haiku.

## TODO / siguiente (por orden sugerido)
1. **Desplegar en Vercel** (importar este repo + añadir env vars). Solo lo hace el dueño (login Vercel).
2. **Límite del Free** (ej. 3 usos/día) para blindar coste — requiere identificar usuario (IP/cookie o auth).
3. **Cablear pago Pro con Stripe** (checkout + webhook).
4. **Página pública compartible** del resultado con marca → gasolina orgánica (gana la apuesta).
5. **Mentor IA 24/7** (chat) → retención.

## Notas de negocio
- Apuesta: hacer más dinero que el socio (que hace un buscador de leads). Público:
  emprendedores jóvenes, crecimiento 100% orgánico.
- Con 1 cliente Pro (19€) se cubren ~4.000 usos gratis. El coste IA es prepago
  (imposible pasarse del crédito cargado).
