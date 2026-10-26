/**
 * Estilos del editor visual del panel. Solo se insertan en la vista previa de «Editar la web» (layout, html.ed-on):
 * la hoja de estilos de la web pública no los lleva, así no pesan en la carga de los visitantes.
 * Interfaz del panel, no de la web: colores propios, legibles sobre cualquier sección y en los dos temas.
 */
export const EDITOR_CSS = `
.ed-on {
  --ed-bg: #16202a;
  --ed-ink: #ffffff;
  --ed-soft: rgba(255, 255, 255, 0.12);
  --ed-hover: rgba(255, 255, 255, 0.24);
  --ed-focus: #8ab4ff;
  --ed-danger: #ffb3a1;
  --ed-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
}
.ed-on .cookie,
.ed-on .dock {
  display: none !important;
}
.ed-on .rv {
  opacity: 1 !important;
  transform: none !important;
}
.ed-sec {
  position: relative;
}
.ed-target {
  min-height: 48px;
}
.ed-target:empty {
  display: grid;
  place-items: center;
  min-height: 160px;
  margin: 16px;
  border: 2px dashed var(--ink-2);
}
.ed-target:empty::before {
  content: "Sección vacía: pulsa aquí para rellenarla";
  color: var(--ink-2);
  font: 500 16px/1.4 var(--f-text);
}
.ed-hidden .ed-target {
  opacity: 0.35;
  filter: grayscale(0.6);
}
/* La barra va sobre el borde superior de la sección (mitad fuera), para tapar lo mínimo del contenido */
.ed-tools {
  position: absolute;
  top: 0;
  right: 12px;
  translate: 0 -50%;
  z-index: 35;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  max-width: calc(100% - 20px);
  padding: 6px;
  border-radius: 10px;
  background: var(--ed-bg);
  color: var(--ed-ink);
  box-shadow: var(--ed-shadow);
  font:
    500 13px/1.2 system-ui,
    sans-serif;
}
main > .ed-sec:first-of-type > .ed-tools {
  top: calc(var(--hdr) + 10px);
  translate: none;
}
.ed-name {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 640px) {
  .ed-long {
    display: none;
  }
  .ed-name {
    max-width: 120px;
  }
  .ed-tools {
    flex-wrap: nowrap;
    right: 8px;
  }
}
.ed-tools button {
  appearance: none;
  border: 0;
  cursor: pointer;
  padding: 8px 11px;
  border-radius: 7px;
  background: var(--ed-soft);
  color: inherit;
  font: inherit;
}
.ed-tools button:hover {
  background: var(--ed-hover);
}
.ed-tools button:disabled {
  opacity: 0.35;
  cursor: default;
}
.ed-tools button:focus-visible {
  outline: 2px solid var(--ed-focus);
  outline-offset: 1px;
}
.ed-name {
  padding: 0 6px;
  font-weight: 600;
}
.ed-tools .ed-danger {
  color: var(--ed-danger);
}
.ed-confirm {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.ed-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: grid;
  gap: 2px;
  min-width: 280px;
  margin-top: 6px;
  padding: 6px;
  border-radius: 10px;
  background: var(--ed-bg);
  box-shadow: var(--ed-shadow);
}
.ed-menu button {
  text-align: left;
  background: transparent;
}
.ed-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 64px;
  margin-top: 20px;
  padding: 14px 20px;
  border: 2px dashed var(--ink-2);
  border-radius: 12px;
  color: var(--ink);
  text-decoration: none;
  font: 500 16px/1.3 var(--f-text);
}
.ed-add span {
  font-size: 28px;
  line-height: 1;
}
.ed-add:hover {
  background: var(--band);
}
`;
