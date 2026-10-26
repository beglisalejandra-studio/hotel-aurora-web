"use client";

import { useEffect, useRef, useState } from "react";

export type DockText = {
  talk: string;
  assistant: string;
  assistantT: string;
  assistantFaq: string;
  assistantNote: string;
  faqNote: string;
  hi: string;
  ask: string;
  askSend: string;
  human: string;
  humanA: string;
  thinking: string;
  assistantDown: string;
  call: string;
  close: string;
  waNote: string;
};

type Msg = { who: "me" | "bot"; text: string };

/**
 * «Hablar con el hotel»: WhatsApp, llamada y un panel de dudas. Sin clave de IA, el panel responde con las preguntas
 * frecuentes del panel de gestión; con clave (ANTHROPIC_API_KEY en el servidor), además acepta preguntas libres.
 * No se guardan las conversaciones.
 */
export function Dock({
  lang,
  t,
  faqs,
  ai,
  wa,
  tel,
}: {
  lang: string;
  t: DockText;
  faqs: { q: string; a: string }[];
  ai: boolean;
  wa: string | null;
  tel: string | null;
}) {
  const [menu, setMenu] = useState(false);
  const [chat, setChat] = useState(false);
  const [log, setLog] = useState<Msg[]>([{ who: "bot", text: t.hi }]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const btn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (document.querySelector(".back:not([hidden])")) return;
      if (chat) {
        setChat(false);
        btn.current?.focus();
      } else if (menu) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chat, menu]);

  useEffect(() => {
    if (chat) closeBtn.current?.focus();
  }, [chat]);
  useEffect(() => {
    logRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [log]);

  const chips = faqs.slice(0, 3);
  const add = (...m: Msg[]) => setLog((l) => [...l, ...m]);

  async function askAi(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    if (!text || busy) return;
    const recent = [...log.slice(1), { who: "me" as const, text }].slice(-8);
    const history = recent.slice(recent.findIndex((m) => m.who === "me"));
    add({ who: "me", text });
    setQ("");
    setBusy(true);
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: history.map((m) => ({
            role: m.who === "me" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const j = (await r.json().catch(() => null)) as { answer?: string } | null;
      add({ who: "bot", text: r.ok && j?.answer ? j.answer : t.assistantDown });
    } catch {
      add({ who: "bot", text: t.assistantDown });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dock" id="dock">
      <div className="chat" id="chat" hidden={!chat} role="dialog" aria-labelledby="chatT">
        <div className="chat-head">
          <strong id="chatT">{ai ? t.assistantT : t.assistantFaq}</strong>
          <button
            type="button"
            className="x"
            ref={closeBtn}
            aria-label={t.close}
            onClick={() => {
              setChat(false);
              btn.current?.focus();
            }}
          >
            ×
          </button>
        </div>
        <p className="chat-note">{ai ? t.assistantNote : t.faqNote}</p>
        <div className="chat-log" ref={logRef} aria-live="polite">
          {log.map((m, i) => (
            <div key={i} className={`msg ${m.who}`}>
              {m.text}
            </div>
          ))}
          {busy && <div className="msg bot">{t.thinking}</div>}
        </div>
        <div className="chips">
          {chips.map((c) => (
            <button
              key={c.q}
              type="button"
              className="chip"
              onClick={() => add({ who: "me", text: c.q }, { who: "bot", text: c.a })}
            >
              {c.q}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            onClick={() => add({ who: "me", text: t.human }, { who: "bot", text: t.humanA })}
          >
            {t.human}
          </button>
        </div>
        {ai && (
          <form className="chat-form" onSubmit={askAi}>
            <label className="sr" htmlFor="chatQ">
              {t.ask}
            </label>
            <input
              id="chatQ"
              className="input"
              value={q}
              maxLength={500}
              autoComplete="off"
              placeholder={t.ask}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
              {t.askSend}
            </button>
          </form>
        )}
      </div>
      <div className="dock-menu" id="dockMenu" hidden={!menu}>
        {wa && (
          <a href={wa} rel="noopener" target="_blank">
            WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setMenu(false);
            setChat(true);
          }}
        >
          {ai ? t.assistant : t.assistantFaq}
        </button>
        {tel && <a href={tel}>{t.call}</a>}
        {wa && <p>{t.waNote}</p>}
      </div>
      <button
        type="button"
        className="dock-btn"
        id="dockBtn"
        ref={btn}
        aria-expanded={menu || chat}
        aria-controls="dockMenu"
        onClick={() => {
          setChat(false);
          setMenu((m) => !m);
        }}
      >
        {t.talk}
      </button>
    </div>
  );
}
