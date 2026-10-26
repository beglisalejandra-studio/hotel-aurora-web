import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import type { CookieNotice } from "@/lib/sanity/types";

/**
 * Aviso de cookies (criterio de la AEPD): Aceptar, Rechazar y Configurar con el mismo tamaño, estilo y lugar; nada
 * marcado de antemano; la decisión se cambia cuando se quiera desde «Configurar cookies», en el pie.
 * Va en el HTML de todas las páginas y lo muestra el script del <head> (clase consent-pending) si el visitante aún no
 * ha decidido: aparece con la página, sin esperar al JavaScript. Los botones los conecta Enhance.
 */
export function CookieBanner({ lang, notice }: { lang: Locale; notice?: CookieNotice }) {
  const t = ui(lang);
  const c = notice;
  return (
    <section className="cookie" id="cookie" role="dialog" aria-modal="false" aria-labelledby="ckT">
      <h2 id="ckT">{tr(c?.title, lang) || t.ckT}</h2>
      <p className="small">
        {tr(c?.text, lang) || t.ckText}{" "}
        <Link href={localePath(lang, "/cookies")}>{t.ckPolicy}</Link>
      </p>
      <div className="cookie-btns">
        <button type="button" className="btn" id="ckAccept">
          {t.ckAccept}
        </button>
        <button type="button" className="btn" id="ckReject">
          {t.ckReject}
        </button>
        <button
          type="button"
          className="btn"
          id="ckConfig"
          aria-expanded="false"
          aria-controls="ckCfg"
        >
          {t.ckConfig}
        </button>
      </div>
      <div className="cookie-cfg" id="ckCfg" hidden>
        <label className="tg">
          <span>
            <strong>{t.ckNecessary}</strong>
            <small>{t.ckNecessaryT}</small>
          </span>
          <input type="checkbox" checked disabled />
        </label>
        <label className="tg">
          <span>
            <strong>{t.ckAnalytics}</strong>
            <small>{tr(c?.analytics, lang) || t.ckAnalyticsT}</small>
          </span>
          <input type="checkbox" id="ckAn" />
        </label>
        <label className="tg">
          <span>
            <strong>{t.ckMarketing}</strong>
            <small>{tr(c?.marketing, lang) || t.ckMarketingT}</small>
          </span>
          <input type="checkbox" id="ckMk" />
        </label>
        <button type="button" className="btn ck-save" id="ckSave">
          {t.ckSave}
        </button>
      </div>
    </section>
  );
}
