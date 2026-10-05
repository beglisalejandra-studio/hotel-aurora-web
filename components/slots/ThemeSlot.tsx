/**
 * Seam: el módulo `visual-editor` lo reemplaza para enlazar la hoja de tema (`/theme.css`) que generan los colores y
 * tipografías que el cliente elige en el editor. Es un `<link>` a un archivo propio (no un `<style>` en línea), así
 * que funciona también con la CSP estricta con nonce. Por defecto no hace nada.
 */
export function ThemeSlot() {
  return null;
}
