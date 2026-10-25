import crawlers from "@/config/ai-crawlers.json";

export interface AiCrawler {
  /** Token de User-agent tal y como lo documenta cada proveedor. */
  name: string;
  /** Para qué se usa el rastreo: entrenamiento, búsqueda o petición puntual de una persona. */
  purpose: "training" | "search" | "user";
  policy: "allow" | "block";
}

export const aiCrawlers = crawlers.bots as AiCrawler[];
const PRIVATE_PATHS = ["/api/", "/editor"];

/** Reglas de robots.txt: una regla explícita por rastreador de IA según la política que decidió el responsable. */
export type CrawlerRule = { userAgent: string; allow?: string; disallow?: string | string[] };

export function aiCrawlerRules(list: AiCrawler[] = aiCrawlers): CrawlerRule[] {
  return list.map((c) =>
    c.policy === "block"
      ? { userAgent: c.name, disallow: "/" }
      : { userAgent: c.name, allow: "/", disallow: PRIVATE_PATHS },
  );
}

export const privatePaths = PRIVATE_PATHS;
