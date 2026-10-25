import type { StructureResolver } from "sanity/structure";
import { MewsInfo } from "./components/MewsInfo";

const single = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      single(S, "settings", "Ajustes del hotel"),
      single(S, "theme", "Colores y tipografías"),
      single(S, "navigation", "Menú y pie"),
      S.divider(),
      S.documentTypeListItem("page").title("Páginas"),
      S.documentTypeListItem("room").title("Habitaciones"),
      S.documentTypeListItem("offer").title("Paquetes y experiencias"),
      S.documentTypeListItem("faq").title("Preguntas frecuentes"),
      S.documentTypeListItem("post").title("Blog"),
      S.documentTypeListItem("legalPage").title("Páginas legales"),
      S.divider(),
      S.listItem()
        .title("Calendario y precios (Mews)")
        .id("mews")
        .child(S.component(MewsInfo).title("Calendario y precios")),
    ]);
