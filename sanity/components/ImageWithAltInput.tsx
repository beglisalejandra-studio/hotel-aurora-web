import { useCallback, useEffect, useRef, useState } from "react";
import { set, useClient, useFormValue, type ObjectInputProps } from "sanity";
import { apiVersion } from "../env";

type Value = {
  desktop?: { asset?: { _ref?: string } };
  alt?: { es?: string; en?: string };
};

const TYPE_LABEL: Record<string, string> = {
  room: "Habitación",
  offer: "Paquete o experiencia",
  post: "Entrada del blog",
  page: "Página",
  legalPage: "Página legal",
};

/**
 * Foto con descripción sugerida (pedido de la persona, 2026-10-25): al subir la foto de escritorio, si aún no hay
 * descripción, el panel la pide a la web y la rellena en español e inglés para que el editor la revise.
 */
export function ImageWithAltInput(props: ObjectInputProps<Value>) {
  const { value, onChange, renderDefault } = props;
  const client = useClient({ apiVersion });
  const docType = useFormValue(["_type"]) as string | undefined;
  const titleEs = useFormValue(["title", "es"]) as string | undefined;
  const name = useFormValue(["name"]) as string | undefined;
  const docTitle = titleEs ?? name;
  const assetRef = value?.desktop?.asset?._ref;
  const hasAlt = Boolean(value?.alt?.es);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const lastRef = useRef(assetRef);

  const suggest = useCallback(async () => {
    if (!assetRef) return;
    setStatus("loading");
    setMessage("Mirando la foto para sugerir una descripción…");
    try {
      const token = client.config().token;
      const context = [docType && TYPE_LABEL[docType], docTitle].filter(Boolean).join(": ");
      const res = await fetch("/api/alt-text", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ assetRef, ...(context ? { context } : {}) }),
      });
      const data = (await res.json()) as { es?: string; en?: string; message?: string };
      if (!res.ok || !data.es)
        throw new Error(data.message ?? "No se pudo sugerir la descripción.");
      onChange(set({ _type: "localeString", es: data.es, en: data.en ?? "" }, ["alt"]));
      setStatus("done");
      setMessage("Descripción sugerida. Revísala y corrígela si hace falta antes de publicar.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "No se pudo sugerir la descripción.");
    }
  }, [assetRef, client, docTitle, docType, onChange]);

  // Foto nueva sin descripción: se sugiere sola.
  useEffect(() => {
    if (assetRef && assetRef !== lastRef.current && !hasAlt) void suggest();
    lastRef.current = assetRef;
  }, [assetRef, hasAlt, suggest]);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {renderDefault(props)}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => void suggest()}
          disabled={!assetRef || status === "loading"}
          style={{
            minHeight: 36,
            padding: "0 14px",
            borderRadius: 999,
            border: "1px solid currentColor",
            background: "transparent",
            color: "inherit",
            cursor: assetRef ? "pointer" : "not-allowed",
          }}
        >
          {status === "loading"
            ? "Sugiriendo…"
            : hasAlt
              ? "Sugerir otra descripción"
              : "Sugerir descripción"}
        </button>
        <span role="status" style={{ fontSize: 13, opacity: status === "error" ? 1 : 0.8 }}>
          {assetRef ? message : "Sube la foto de escritorio y la descripción se sugerirá sola."}
        </span>
      </div>
    </div>
  );
}
