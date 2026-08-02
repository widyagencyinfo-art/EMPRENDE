# emprendIA

emprendIA (antes "Emprende"): plataforma IA para emprendedores jóvenes: validar tu idea, descubrir qué
negocio montar, roast, simulador de ingresos y reto de 30 días.

**Stack:** Next.js 15 (App Router) · Claude (Anthropic) · Tailwind. Deploy en Vercel.

## Setup

```bash
npm install
cp .env.example .env.local   # y pon tu ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000 → /emprende
```

## Variables de entorno (Vercel)
- `ANTHROPIC_API_KEY` — obligatoria
- `EMPRENDE_AI_MODEL` — opcional (por defecto `claude-haiku-4-5`)

## Planes
Free (gancho) · Pro 19€/mes · Anual 149€.
