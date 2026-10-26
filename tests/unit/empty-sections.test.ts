import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Sections } from "@/components/sections/Sections";
import { ADDABLE_SECTIONS } from "@/lib/edit/labels";
import type { Section } from "@/lib/sanity/types";

/**
 * «+ Añadir sección debajo» crea una sección vacía (solo su tipo). Hasta que se rellena, la página tiene que seguir
 * pintándose: cada tipo de sección debe aguantar estar vacío.
 */
describe("una sección recién añadida y vacía no rompe la página", () => {
  for (const type of ADDABLE_SECTIONS) {
    it(type, () => {
      const html = renderToStaticMarkup(
        createElement(Sections, {
          sections: [{ _type: type, _key: "nueva" } as unknown as Section],
          lang: "es",
          settings: null,
          edit: { id: "page-inicio", type: "page" },
        }),
      );
      expect(html).toContain('class="ed-sec"');
    });
  }
});
