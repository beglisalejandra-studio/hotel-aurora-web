"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RequestText = {
  tableT: string;
  spaT: string;
  voucherT: string;
  send: string;
  sending: string;
  cancel: string;
  close: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  diners: string;
  treatment: string;
  quantity: string;
  note: string;
  minData: string;
  consentBefore: string;
  privacyPolicy: string;
  errReq: string;
  errMail: string;
  errDate: string;
  errConsent: string;
  errSend: string;
  errRate: string;
  okT: string;
  okP: string;
  voucherNote: string;
};

type Kind = "table" | "spa" | "voucher";
type Errors = Partial<Record<"name" | "email" | "date" | "consent" | "form", string>>;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Solicitudes de mesa, cita de spa y bono. Se validan aquí y, sobre todo, en el servidor (/api/request), que limita
 * los envíos y descarta bots. Se pide solo lo necesario, con consentimiento no premarcado.
 */
export function RequestDialog({
  lang,
  t,
  privacyHref,
}: {
  lang: string;
  t: RequestText;
  privacyHref: string;
}) {
  const [kind, setKind] = useState<Kind | null>(null);
  const [offer, setOffer] = useState("");
  const [treatments, setTreatments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const dlg = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);

  const close = useCallback(() => {
    setKind(null);
    document.body.classList.remove("noscroll");
    opener.current?.focus();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest<HTMLElement>("[data-open-request]");
      if (!b) return;
      e.preventDefault();
      const k = b.dataset.openRequest as Kind;
      opener.current = b;
      setOffer(b.dataset.offerTitle ?? "");
      setTreatments([
        ...new Set(
          [...document.querySelectorAll<HTMLElement>("[data-treatment]")]
            .map((x) => x.dataset.treatment ?? "")
            .filter(Boolean),
        ),
      ]);
      setKind(k === "spa" || k === "voucher" ? k : "table");
      setErrors({});
      setDone(false);
      shownAt.current = Date.now();
      document.body.classList.add("noscroll");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (kind) setTimeout(() => dlg.current?.focus(), 0);
  }, [kind, done]);

  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !dlg.current) return;
      const f = [
        ...dlg.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea',
        ),
      ].filter((x) => x.offsetParent !== null);
      const first = f[0];
      const last = f[f.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [kind, close]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kind || busy) return;
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const err: Errors = {};
    if (!v("name")) err.name = t.errReq;
    if (!EMAIL.test(v("email"))) err.email = v("email") ? t.errMail : t.errReq;
    if (kind !== "voucher" && (!v("date") || v("date") < today())) err.date = t.errDate;
    if (!fd.get("consent")) err.consent = t.errConsent;
    setErrors(err);
    if (Object.keys(err).length) {
      setTimeout(
        () => dlg.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        0,
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          lang,
          name: v("name"),
          email: v("email"),
          phone: v("phone"),
          date: v("date") || undefined,
          quantity: Number(v("quantity") || 1),
          treatment: v("treatment") || undefined,
          offer: offer || undefined,
          note: v("note"),
          consent: true,
          website: v("website"),
          t: shownAt.current,
        }),
      });
      if (r.ok) setDone(true);
      else setErrors({ form: r.status === 429 ? t.errRate : t.errSend });
    } catch {
      setErrors({ form: t.errSend });
    } finally {
      setBusy(false);
    }
  }

  if (!kind) return null;
  const title = kind === "table" ? t.tableT : kind === "spa" ? t.spaT : t.voucherT;
  const field = (id: string, label: string, input: React.ReactNode, err?: string) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {input}
      <span className="err" id={`${id}-e`} role="alert">
        {err ?? ""}
      </span>
    </div>
  );
  const inv = (k: keyof Errors) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `q-${k}-e` } : {};

  return (
    <div
      className="back"
      id="rq"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="dlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rqT"
        tabIndex={-1}
        ref={dlg}
      >
        <div className="dlg-head">
          <h2 id="rqT">{title}</h2>
          <button type="button" className="x" aria-label={t.close} onClick={close}>
            ×
          </button>
        </div>
        {done ? (
          <div className="dlg-body">
            <div className="ok" role="status">
              <h3 className="h3">{t.okT}</h3>
              <p className="muted">{kind === "voucher" ? `${t.okP} ${t.voucherNote}` : t.okP}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="dlg-body">
              <p className="help">
                {offer ? `${offer}. ` : ""}
                {t.minData}
              </p>
              <div className="grid2">
                {field(
                  "q-name",
                  t.name,
                  <input
                    className="input"
                    id="q-name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    {...inv("name")}
                  />,
                  errors.name,
                )}
                {field(
                  "q-email",
                  t.email,
                  <input
                    className="input"
                    id="q-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    {...inv("email")}
                  />,
                  errors.email,
                )}
              </div>
              {field(
                "q-phone",
                t.phone,
                <input
                  className="input"
                  id="q-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                />,
              )}
              <div className="grid2">
                {kind !== "voucher" &&
                  field(
                    "q-date",
                    t.date,
                    <input
                      className="input"
                      id="q-date"
                      name="date"
                      type="date"
                      min={today()}
                      {...inv("date")}
                    />,
                    errors.date,
                  )}
                {kind === "spa" && treatments.length > 0
                  ? field(
                      "q-treatment",
                      t.treatment,
                      <select className="input" id="q-treatment" name="treatment">
                        {treatments.map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>,
                    )
                  : field(
                      "q-quantity",
                      kind === "voucher" ? t.quantity : t.diners,
                      <select
                        className="input"
                        id="q-quantity"
                        name="quantity"
                        defaultValue={kind === "table" ? 2 : 1}
                      >
                        {Array.from({ length: kind === "table" ? 8 : 4 }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ),
                        )}
                      </select>,
                    )}
              </div>
              {field(
                "q-note",
                t.note,
                <textarea className="input" id="q-note" name="note" maxLength={1000} />,
              )}
              <div className="hp" aria-hidden="true">
                <label htmlFor="q-website">Web</label>
                <input id="q-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="check">
                <input type="checkbox" id="q-consent" name="consent" {...inv("consent")} />
                <span>
                  {t.consentBefore}
                  <a href={privacyHref} target="_blank" rel="noopener">
                    {t.privacyPolicy}
                  </a>
                  .
                </span>
              </label>
              <span className="err" id="q-consent-e" role="alert">
                {errors.consent ?? ""}
              </span>
              {kind === "voucher" && <p className="help">{t.voucherNote}</p>}
              {errors.form && (
                <p className="form-msg" role="alert">
                  {errors.form}
                </p>
              )}
            </div>
            <div className="dlg-foot">
              <button type="button" className="btn btn-ghost" onClick={close}>
                {t.cancel}
              </button>
              <button type="submit" className="btn btn-primary" aria-busy={busy}>
                {busy ? t.sending : t.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
