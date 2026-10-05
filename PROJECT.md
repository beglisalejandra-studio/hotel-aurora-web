---
type: new
status: discovery
duration: 3-6w
visual_authority: taste-skill
stack: next
hosting: undecided
figma_seat: view
mode: auto
---

# PROJECT — Hotel Aurora

> Alcance, arquitectura, integraciones, secretos y despliegue. **El front-matter gobierna al sistema**: `type` (new | redesign | maintenance), `status` (discovery → design → build → qa → staging → production → maintenance), `duration` (1-3d | 1-2w | 3-6w), `visual_authority` (UNA sola: taste-skill | impeccable), `stack`, `hosting`, `figma_seat` (view | collab | dev | full: define el presupuesto de lecturas de Figma), `mode` (auto | explain).

## 1. Alcance
- **Objetivo de conversión (único):** {{CONVERSION_GOAL}}
- **Dentro del alcance:** {{IN_SCOPE}}
- **Fuera del alcance:** {{OUT_OF_SCOPE}}
- **Fechas / hitos:** {{MILESTONES}}

## 2. Arquitectura
- **Stack:** Next.js + TypeScript estricto (plantilla). Justificación y alternativas: `docs/decisions/ADR-0001-stack.md`.
- **Sitemap / páginas:** {{SITEMAP}}
- **Idiomas:** {{LANGUAGES}}
- **Contenido editable por el cliente:** {{EDITABLE_CONTENT}} (layout, tokens, pagos, seguridad e integraciones sensibles quedan protegidos)

## 3. Integraciones (una ficha por integración)
<!-- Copia esta ficha por cada integración. Sin ficha completa, no se integra. -->
| Campo | Valor |
|---|---|
| Integración | {{INTEGRATION_NAME}} |
| Objetivo | |
| Datos que maneja (categorías de PII) | |
| Dónde se ejecuta (cliente / servidor) | |
| Credenciales (NOMBRE de variable y dónde se guarda) | |
| Coste | |
| Privacidad (base legal, retención, subprocesador) | |
| Fallback si cae | |
| Pruebas | |
| Responsable | |

## 4. Secretos y variables
Los VALORES viven solo en el gestor del proveedor de despliegue. Lista de NOMBRES en `.env.example`. Rotación: {{ROTATION_POLICY}}.

## 5. Despliegue
- **Proveedor / hosting:** undecided
- **Preview/staging:** {{PREVIEW_URL}} (noindex; pagos en modo test; datos ficticios)
- **Producción:** dominio {{DOMAIN}} — **solo con aprobación humana** (`.web-os/approvals/production.json`, creado por una persona)
- **Plan de rollback:** `docs/runbooks/rollback.md`

## 6. Plan por fases (ritmo: 3-6w)
<!-- Lo completa /web-plan. Cada fase: entregable · criterio de aceptación · verificación · decisión de avanzar. -->

## 7. Responsables
| Rol | Nombre | Contacto |
|---|---|---|
| Responsable del proyecto | {{OWNER_NAME}} | |
| Aprobador de producción | | |
| Contacto del cliente | | |
