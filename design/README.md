# design/

- `tokens.figma.json` — tokens (p. ej. de `get_variable_defs` del MCP de Figma). `npm run tokens` genera `app/tokens.css` (saneado contra inyección de CSS).
- `figma-cache/` — resultados cacheados de lecturas de Figma (JSON/capturas). **Reutilízalos: la cuenta tiene un presupuesto de lecturas limitado.**
- `figma-usage.md` — registro de cada lectura (fecha, herramienta, nodo, motivo).
