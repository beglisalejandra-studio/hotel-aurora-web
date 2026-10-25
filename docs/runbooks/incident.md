# Runbook — Incidente de seguridad / datos

1. **Contener:** desactivar la integración afectada (variable/feature), revocar y **rotar** credenciales expuestas (Stripe, Resend, Gemini, tokens).
2. **Evaluar:** qué datos, cuántas personas, desde cuándo (logs mínimos sin PII: usa `digest`/ids).
3. **Notificar:** al cliente y, si procede por normativa (p. ej. RGPD: 72 h a la autoridad si hay riesgo para las personas), a quien corresponda. Lo decide una persona cualificada; este documento no es asesoría legal.
4. **Corregir y verificar:** parche + test de regresión + `npm audit`; PR con revisión humana.
5. **Aprender:** `docs/learning/lessons.md`; actualizar `docs/security.md`, el doctor o la plantilla si aplica.
