import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
import { ColorWheelIcon } from "@sanity/icons/ColorWheel";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { LockIcon } from "@sanity/icons/Lock";
import { MenuIcon } from "@sanity/icons/Menu";
import { PackageIcon } from "@sanity/icons/Package";
import type { ComponentType } from "react";
import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";
import { MewsInfo } from "./components/MewsInfo";

type S = Parameters<StructureResolver>[0];

const single = (S: S, type: string, title: string, icon: ComponentType) =>
  S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

/**
 * Menú «Contenido», ordenado por lo que más se cambia y con nombres de todos los días. Las entradas que enlaza la
 * portada del panel (sanity/tools/home.tsx) usan el mismo id: room, offer, faq, legalPage, mews.
 */
export const structure: StructureResolver = (S, { getClient }) =>
  S.list()
    .title("Contenido")
    .items([
      S.documentTypeListItem("room").title("Habitaciones y precios").icon(ImagesIcon),
      S.listItem()
        .title("Portada")
        .id("portada")
        .icon(HomeIcon)
        .child(async () => {
          const id =
            (await getClient({ apiVersion }).fetch<string | null>(
              '*[_id == "settings"][0].homePage._ref',
            )) ?? "page-inicio";
          return S.document().schemaType("page").documentId(id).title("Portada");
        }),
      S.documentTypeListItem("offer").title("Paquetes y experiencias").icon(PackageIcon),
      S.documentTypeListItem("faq").title("Preguntas frecuentes").icon(HelpCircleIcon),
      S.documentTypeListItem("post").title("Blog").icon(ComposeIcon),
      S.divider(),
      single(S, "settings", "Datos del hotel", CogIcon),
      single(S, "theme", "Colores y tipografías", ColorWheelIcon),
      single(S, "navigation", "Menú y pie de página", MenuIcon),
      single(S, "cookieNotice", "Aviso de cookies", LockIcon),
      S.documentTypeListItem("legalPage").title("Textos legales").icon(DocumentTextIcon),
      S.listItem()
        .title("Calendario y reservas (Mews)")
        .id("mews")
        .icon(CalendarIcon)
        .child(S.component(MewsInfo).title("Calendario y reservas")),
      S.divider(),
      S.documentTypeListItem("page").title("Otras páginas").icon(DocumentsIcon),
    ]);
