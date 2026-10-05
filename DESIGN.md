# DESIGN — Hotel Aurora

> Dirección visual, tokens y reglas de componentes. **Autoridad visual única** (`visual_authority` en PROJECT.md: taste-skill). Los tokens son la fuente; los componentes solo usan `var(--…)`/utilidades, nunca valores mágicos.

## 1. Dirección
- **Palabras clave (3–5):** {{DIRECTION_KEYWORDS}}
- **Referencias adoptadas (principios, no clones):** ver `reference-analysis.md`
- **Qué evitar:** {{AVOID}}

## 2. Tokens
| Token | Valor | Uso | Contraste (AA) |
|---|---|---|---|
| `--background` / `--foreground` | | fondo / texto | ≥ 4.5:1 |
| `--accent` / `--accent-foreground` | | CTA, enlaces | ≥ 4.5:1 |
| Tipografía (sans / display / mono) | | | |
| Escala de espaciado | | | |
| Radios / sombras | | | |

Origen: {{TOKENS_SOURCE}} (Figma variables → `design/tokens.figma.json` → `npm run tokens`; o definidos aquí). **Figma es un recurso escaso** (límites por asiento): cada lectura se registra en `design/figma-usage.md` y se cachea en `design/figma-cache/`.

## 3. Componentes y estados
Por componente: variantes · estados (hover, focus-visible, active, disabled, error, loading) · comportamiento responsive · accesibilidad (rol, nombre, teclado).

## 4. Responsive
Breakpoints: 360 · 390 · 768 · 1024 · 1440 px. Qué cambia en móvil: {{MOBILE_CHANGES}}.

## 5. Movimiento
Duraciones y easing: {{MOTION_RULES}}. **Siempre** `prefers-reduced-motion` (ya soportado en `globals.css`). Video: decidido por `VIDEO_SCORE` (`creative/manifest.json`).

## 6. Imagen y video
Reglas de composición, relación con titular/CTA, tratamiento. Contrato visual de referencias en `creative/manifest.json` (`constraints.preserve`).

## 7. Desviaciones respecto a Figma
Lista y motivo de cada diferencia.
