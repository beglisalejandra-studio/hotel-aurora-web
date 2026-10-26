import { AddIcon } from "@sanity/icons/Add";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CogIcon } from "@sanity/icons/Cog";
import { ColorWheelIcon } from "@sanity/icons/ColorWheel";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { LaunchIcon } from "@sanity/icons/Launch";
import { LockIcon } from "@sanity/icons/Lock";
import { MenuIcon } from "@sanity/icons/Menu";
import { PackageIcon } from "@sanity/icons/Package";
import { useEffect, useState, type ComponentType, type MouseEvent } from "react";
import { useClient, type Tool } from "sanity";
import { useRouter } from "sanity/router";
import { apiVersion } from "../env";

type Task = {
  title: string;
  text: string;
  icon: ComponentType;
  /** Abrir un documento, crear uno nuevo o abrir una lista del menú «Contenido» (mismo id que en structure.ts). */
  go: { edit: [type: string, id: string] } | { create: string } | { list: string };
};

const FREQUENT: Task[] = [
  {
    title: "Habitaciones y precios",
    text: "Textos, fotos y precio «desde» de cada habitación.",
    icon: ImagesIcon,
    go: { list: "room" },
  },
  {
    title: "Añadir una habitación",
    text: "Crea una nueva. Sale en la web cuando la publicas.",
    icon: AddIcon,
    go: { create: "room" },
  },
  {
    title: "Portada",
    text: "Textos y fotos de la página de inicio, sección por sección.",
    icon: HomeIcon,
    go: { edit: ["page", "page-inicio"] },
  },
  {
    title: "Escribir en el blog",
    text: "Nueva entrada con título, foto y texto.",
    icon: ComposeIcon,
    go: { create: "post" },
  },
  {
    title: "Paquetes y experiencias",
    text: "Escapadas, spa y bonos regalo.",
    icon: PackageIcon,
    go: { list: "offer" },
  },
  {
    title: "Preguntas frecuentes",
    text: "Las respuestas que ve el visitante y que usa el asistente.",
    icon: HelpCircleIcon,
    go: { list: "faq" },
  },
];

const SETTINGS: Task[] = [
  {
    title: "Teléfono, correo y dirección",
    text: "Datos del hotel, horas de entrada y salida, redes sociales.",
    icon: CogIcon,
    go: { edit: ["settings", "settings"] },
  },
  {
    title: "Colores y tipografías",
    text: "El aspecto de toda la web. Avisa si un texto no se leería bien.",
    icon: ColorWheelIcon,
    go: { edit: ["theme", "theme"] },
  },
  {
    title: "Menú y pie de página",
    text: "Qué enlaces salen arriba y abajo.",
    icon: MenuIcon,
    go: { edit: ["navigation", "navigation"] },
  },
  {
    title: "Aviso de cookies",
    text: "El texto del aviso que ve cada visitante.",
    icon: LockIcon,
    go: { edit: ["cookieNotice", "cookieNotice"] },
  },
  {
    title: "Textos legales",
    text: "Privacidad, cookies, aviso legal y condiciones.",
    icon: DocumentTextIcon,
    go: { list: "legalPage" },
  },
  {
    title: "Calendario y reservas",
    text: "Precios por día y disponibilidad: se gestionan en Mews.",
    icon: CalendarIcon,
    go: { list: "mews" },
  },
];

// Colores del propio panel (claro u oscuro, según el editor), con valores de respaldo.
const CSS = `
.ah{height:100%;overflow:auto;padding:clamp(16px,4vw,48px);box-sizing:border-box;color:var(--card-fg-color,#16202a);font:15px/1.5 Inter,system-ui,sans-serif}
.ah *{box-sizing:border-box}
.ah-in{max-width:1040px;margin:0 auto;display:grid;gap:36px}
.ah h1{font-size:28px;line-height:1.2;margin:0 0 6px;font-weight:600}
.ah h2{font-size:15px;margin:0 0 12px;font-weight:600;letter-spacing:.01em}
.ah-muted{color:var(--card-muted-fg-color,#5b6670);margin:0}
.ah-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.ah-task{display:flex;gap:14px;align-items:flex-start;min-height:88px;padding:16px;border-radius:10px;text-decoration:none;color:inherit;border:1px solid var(--card-border-color,rgba(22,32,42,.16));background:var(--card-bg-color,#fff);transition:border-color .15s,box-shadow .15s}
.ah-task:hover{border-color:var(--card-focus-ring-color,#2276fc);box-shadow:0 2px 10px rgba(0,0,0,.08)}
.ah-task:focus-visible{outline:2px solid var(--card-focus-ring-color,#2276fc);outline-offset:2px}
.ah-task svg{font-size:28px;flex:none;margin-top:-2px}
.ah-task strong{display:block;font-size:16px;margin-bottom:4px}
.ah-task span{font-size:14px;color:var(--card-muted-fg-color,#5b6670)}
.ah-how{border-radius:10px;padding:20px 22px;border:1px solid var(--card-border-color,rgba(22,32,42,.16))}
.ah-how ol{margin:0 0 12px;padding-left:22px;display:grid;gap:8px 32px;font-size:16px}
@media (min-width:900px){.ah-how ol{grid-template-columns:repeat(3,1fr)}}
.ah-how a{color:inherit;font-weight:600}
.ah-how a svg{vertical-align:-2px}
`;

function TaskCard({ task, homeId }: { task: Task; homeId: string }) {
  const router = useRouter();
  const { go } = task;
  const editId = "edit" in go ? (go.edit[0] === "page" ? homeId : go.edit[1]) : "";
  const href =
    "list" in go
      ? `/admin/structure/${go.list}`
      : "create" in go
        ? router.resolveIntentLink("create", { type: go.create })
        : router.resolveIntentLink("edit", { type: go.edit[0], id: editId });
  const onClick = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if ("list" in go) router.navigateUrl({ path: href });
    else if ("create" in go) router.navigateIntent("create", { type: go.create });
    else router.navigateIntent("edit", { type: go.edit[0], id: editId });
  };
  const Icon = task.icon;
  return (
    <a className="ah-task" href={href} onClick={onClick}>
      <Icon aria-hidden="true" />
      <div>
        <strong>{task.title}</strong>
        <span>{task.text}</span>
      </div>
    </a>
  );
}

/** Portada del panel: las tareas habituales con un clic y cómo se publica un cambio, en palabras sencillas. */
function HomeTool() {
  const client = useClient({ apiVersion });
  const [homeId, setHomeId] = useState("page-inicio");
  useEffect(() => {
    client
      .fetch<string | null>('*[_id == "settings"][0].homePage._ref')
      .then((id) => id && setHomeId(id))
      .catch(() => {});
  }, [client]);
  return (
    <div className="ah">
      <style>{CSS}</style>
      <div className="ah-in">
        <header>
          <h1>Hola. ¿Qué quieres cambiar?</h1>
          <p className="ah-muted">
            Cada botón te lleva directamente a la pantalla donde se cambia.
          </p>
        </header>
        <section className="ah-how">
          <h2>Cómo se publica un cambio</h2>
          <ol>
            <li>
              Cambia lo que quieras. Mientras escribes se guarda solo como borrador: la web todavía
              no cambia.
            </li>
            <li>Pulsa el botón «Publicar», abajo a la derecha.</li>
            <li>
              En uno o dos minutos el cambio aparece en la web (recarga la página para verlo).
            </li>
          </ol>
          <p className="ah-muted">
            ¿Te has equivocado antes de publicar? En el menú «···», junto a «Publicar», elige
            «Descartar cambios» y vuelve a lo que había.
          </p>
          <p style={{ margin: "14px 0 0" }}>
            <a href="/" target="_blank" rel="noopener">
              Ver la web <LaunchIcon aria-hidden="true" />
            </a>
          </p>
        </section>
        <section>
          <h2>Lo más habitual</h2>
          <div className="ah-grid">
            {FREQUENT.map((t) => (
              <TaskCard key={t.title} task={t} homeId={homeId} />
            ))}
          </div>
        </section>
        <section>
          <h2>Datos y aspecto de la web</h2>
          <div className="ah-grid">
            {SETTINGS.map((t) => (
              <TaskCard key={t.title} task={t} homeId={homeId} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export const homeTool: Tool = {
  name: "inicio",
  title: "Inicio",
  icon: HomeIcon,
  component: HomeTool,
};
