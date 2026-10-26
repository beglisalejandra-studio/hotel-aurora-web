"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MAP_LEVELS } from "@/lib/map";

type MewsApi = {
  open(): void;
  setLanguageCode(code: string): void;
  setCurrencyCode(code: string): void;
  setStartDate(d: Date): void;
  setEndDate(d: Date): void;
  setAdultCount(n: number): void;
  showRooms(): void;
  showRates(roomId: string): void;
  enableTracking(): void;
  disableTracking(): void;
};
type MewsGlobal = {
  Distributor(
    options: { configurationIds: string[] },
    cb: (api: MewsApi) => void,
    config?: { dataBaseUrl: string },
  ): void;
};

export type EnhanceProps = {
  lang: "es" | "en";
  mews: { configurationId: string; demo: boolean } | null;
  t: { bookingLoading: string; bookingError: string; mapHintMouse: string; mapHintTouch: string };
};

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) =>
  r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [
  ...r.querySelectorAll<T>(s),
];
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* navegación privada: se ignora */
    }
  },
};

/* ---------- Tema Día / Madrugada (con la transición circular de la maqueta) ---------- */
function currentTheme() {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function renderTheme() {
  const dark = currentTheme() === "dark";
  $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(dark)));
}
function setTheme(next: "light" | "dark", x: number, y: number) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = next;
    store.set("aurora-theme", next);
    renderTheme();
  };
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };
  if (typeof doc.startViewTransition !== "function" || reduce()) return apply();
  root.classList.add("theme-vt");
  const vt = doc.startViewTransition(apply);
  vt.ready
    .then(() => {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 900,
          easing: "cubic-bezier(.16,1,.3,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove("theme-vt"));
}

/* ---------- Ir a una sección: llega a su contenido, no al relleno superior (pedido de la persona, 2026-10-25) ---------- */
function goSec(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const gap = Math.min(40, innerWidth * 0.06);
  const top = el.getBoundingClientRect().top + scrollY + pad - gap - ($("#hdr")?.offsetHeight ?? 0);
  scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce() ? "smooth" : "auto" });
  return true;
}

/* ---------- Menú móvil ---------- */
function closeMenu() {
  $("#nav")?.classList.remove("open");
  $("#menuBtn")?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("noscroll");
}

/* ---------- Reserva: el widget oficial de Mews se descarga solo al pulsar «Reservar» ---------- */
let mewsApi: Promise<MewsApi> | null = null;
function loadMews(cfg: NonNullable<EnhanceProps["mews"]>): Promise<MewsApi> {
  if (mewsApi) return mewsApi;
  mewsApi = new Promise<MewsApi>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://api.mews.com/distributor/distributor.min.js";
    s.onload = () => {
      const Mews = (window as unknown as { Mews?: MewsGlobal }).Mews;
      if (!Mews) return reject(new Error("Mews no disponible"));
      Mews.Distributor(
        { configurationIds: [cfg.configurationId] },
        (api) => resolve(api),
        cfg.demo ? { dataBaseUrl: "https://api.mews-demo.com" } : undefined,
      );
    };
    s.onerror = () => reject(new Error("No se pudo cargar Mews"));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("Tiempo de espera agotado")), 15000);
  }).catch((e: unknown) => {
    mewsApi = null;
    throw e;
  });
  return mewsApi;
}
function toast(text: string) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
  }, 6000);
}
function readConsent(): { an?: boolean; mk?: boolean } | null {
  try {
    return JSON.parse(store.get("aurora-consent") ?? "null") as {
      an?: boolean;
      mk?: boolean;
    } | null;
  } catch {
    return null;
  }
}
const asDate = (v?: string) => {
  const m = v ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(v) : null;
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
async function openBooking(
  props: EnhanceProps,
  opener: HTMLElement | null,
  pre: { arrive?: string; depart?: string; adults?: number; roomId?: string } = {},
) {
  if (!props.mews) return toast(props.t.bookingError);
  opener?.setAttribute("aria-busy", "true");
  const slow = setTimeout(() => toast(props.t.bookingLoading), 600);
  try {
    const api = await loadMews(props.mews);
    api.setLanguageCode(props.lang === "es" ? "es-ES" : "en-GB");
    api.setCurrencyCode("EUR");
    // Las cookies de seguimiento de Mews siguen la decisión del visitante sobre la analítica y el marketing
    const consent = readConsent();
    if (consent?.an || consent?.mk) api.enableTracking();
    else api.disableTracking();
    const a = asDate(pre.arrive);
    const d = asDate(pre.depart);
    if (a && d && d > a) {
      api.setStartDate(a);
      api.setEndDate(d);
    }
    if (pre.adults) api.setAdultCount(pre.adults);
    if (pre.roomId) api.showRates(pre.roomId);
    api.open();
    $("#toast")?.setAttribute("hidden", "");
  } catch {
    toast(props.t.bookingError);
  } finally {
    clearTimeout(slow);
    opener?.removeAttribute("aria-busy");
  }
}

/* ---------- Revelado una vez al entrar en pantalla ---------- */
let io: IntersectionObserver | null = null;
function observeReveal() {
  if (reduce() || !("IntersectionObserver" in window)) {
    $$(".rv").forEach((el) => el.classList.add("in"));
    return;
  }
  io ??= new IntersectionObserver(
    (es) =>
      es.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io?.unobserve(en.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  $$(".rv:not(.in)").forEach((el) => io?.observe(el));
}

/* ---------- Geometría del recorrido: escala a la que recepción (S1) y patio (S2) llenan el escenario ---------- */
function walkGeometry(): () => void {
  const walk = $("#walk");
  const stage = $("#stage");
  if (!walk || !stage || !CSS.supports("animation-timeline:view()")) return () => {};
  let raf = 0;
  const px = (el: Element, p: "width" | "height") => parseFloat(getComputedStyle(el)[p]) || 0;
  const geo = () => {
    raf = 0;
    const h = $(".hall-img", stage);
    const c = $(".court-img", stage);
    if (!h || !c) return;
    const [hw, hh, cw, ch] = [px(h, "width"), px(h, "height"), px(c, "width"), px(c, "height")];
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    if (!hw || !hh || !cw || !ch || !sw || !sh) return;
    walk.style.setProperty("--S1", (Math.max(sw / hw, sh / hh) * 1.01).toFixed(3));
    walk.style.setProperty("--S2", (Math.max(sw / cw, sh / ch) * 1.01).toFixed(3));
  };
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(geo);
  };
  const ro = new ResizeObserver(queue);
  ro.observe(stage);
  const mq = matchMedia("(max-width:900px)");
  mq.addEventListener("change", queue);
  addEventListener("load", queue);
  queue();
  return () => {
    ro.disconnect();
    mq.removeEventListener("change", queue);
    removeEventListener("load", queue);
  };
}

/* ---------- Pestañas del spa (flechas izquierda/derecha) ---------- */
function spaTabs(): () => void {
  const list = $("#spaTabs");
  if (!list) return () => {};
  const tabs = $$<HTMLButtonElement>("[role=tab]", list);
  const select = (i: number, focus: boolean) => {
    tabs.forEach((b, j) => {
      const on = i === j;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      const p = document.getElementById(b.getAttribute("aria-controls") ?? "");
      if (p) p.hidden = !on;
    });
    if (focus) tabs[i]?.focus();
  };
  const onClick = (e: Event) => {
    const b = (e.target as Element).closest<HTMLButtonElement>("[role=tab]");
    if (b) select(tabs.indexOf(b), true);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((b) => b.getAttribute("aria-selected") === "true");
    select((i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length, true);
  };
  list.addEventListener("click", onClick);
  list.addEventListener("keydown", onKey);
  return () => {
    list.removeEventListener("click", onClick);
    list.removeEventListener("keydown", onKey);
  };
}

/* ---------- Paquetes: la tarjeta elegida cambia la foto ---------- */
function packages(): () => void {
  const pk = $("#pk");
  if (!pk) return () => {};
  const pick = (k: string) => {
    $$(".pk-card", pk).forEach((c) => {
      const on = c.dataset.pk === k;
      c.classList.toggle("is-on", on);
      $(".pk-pick", c)?.setAttribute("aria-pressed", String(on));
    });
    $$(".pk-img", pk).forEach((i) => {
      const on = i.dataset.pk === k;
      i.classList.toggle("is-on", on);
      if (on) i.removeAttribute("aria-hidden");
      else i.setAttribute("aria-hidden", "true");
    });
  };
  const onClick = (e: Event) => {
    const card = (e.target as Element).closest<HTMLElement>(".pk-card");
    if (card?.dataset.pk) pick(card.dataset.pk);
  };
  pk.addEventListener("click", onClick);
  return () => pk.removeEventListener("click", onClick);
}

/* ---------- Pista de habitaciones ---------- */
function roomTrack(): () => void {
  const track = $("#track");
  const prev = $("#rPrev");
  const next = $("#rNext");
  if (!track || !prev || !next) return () => {};
  const by = (d: number) => () =>
    track.scrollBy({ left: d * 340, behavior: reduce() ? "auto" : "smooth" });
  const p = by(-1);
  const n = by(1);
  prev.addEventListener("click", p);
  next.addEventListener("click", n);
  return () => {
    prev.removeEventListener("click", p);
    next.removeEventListener("click", n);
  };
}

/* ---------- Mapa navegable: arrastrar mueve, + y − (o dos dedos) acercan; un clic abre la app de mapas ---------- */
function mapNav(t: EnhanceProps["t"]): () => void {
  const box = $("#map");
  const pin = $<HTMLAnchorElement>("#mapPin");
  const hint = $("#mapHint");
  if (!box || !pin || !hint) return () => {};
  const LV = MAP_LEVELS as Record<number, { x0: number; y0: number; w: number; h: number }>;
  const HX = Number(box.dataset.hx);
  const HY = Number(box.dataset.hy);
  const ZMAX = 17;
  const lvs = $$<HTMLImageElement>(".map-lv", box);
  const zb = $$<HTMLButtonElement>(".map-zb", box);
  const ll = box.dataset.ll ?? "";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1))
    pin.href = `https://maps.apple.com/?ll=${ll}&q=${encodeURIComponent(box.dataset.name ?? "")}`;
  else if (/Android/.test(ua)) {
    pin.href = `geo:${ll}?q=${ll}(${encodeURIComponent(box.dataset.name ?? "")})`;
    pin.removeAttribute("target");
  }
  let z = 14.5;
  let cx = HX;
  let cy = HY;
  let zmin = 11.5;
  let moved = 0;
  let hintT = 0;
  const cl = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const say = (msg: string, ms = 1800) => {
    hint.textContent = msg;
    hint.classList.add("show");
    clearTimeout(hintT);
    hintT = window.setTimeout(() => hint.classList.remove("show"), ms);
  };
  const lvl = (L: number) => LV[L] ?? LV[16]!;
  function bounds() {
    const cw = box!.clientWidth;
    const ch = box!.clientHeight;
    const l = lvl(12);
    zmin = 12 + Math.log2(Math.max(cw / l.w, ch / l.h));
    z = cl(z, zmin, ZMAX);
    const L = cl(Math.round(z), 12, 16);
    const v = lvl(L);
    const f = 2 ** (16 - L);
    const k = 2 ** (z - 16);
    const [x0, x1, y0, y1] = [v.x0 * f, (v.x0 + v.w) * f, v.y0 * f, (v.y0 + v.h) * f];
    const hw = cw / 2 / k;
    const hh = ch / 2 / k;
    cx = x1 - x0 > 2 * hw ? cl(cx, x0 + hw, x1 - hw) : (x0 + x1) / 2;
    cy = y1 - y0 > 2 * hh ? cl(cy, y0 + hh, y1 - hh) : (y0 + y1) / 2;
  }
  function render() {
    bounds();
    const cw = box!.clientWidth;
    const ch = box!.clientHeight;
    const L = cl(Math.round(z), 12, 16);
    lvs.forEach((img) => {
      const Z = Number(img.dataset.z);
      const show = Z === L || Z === L - 1;
      img.classList.toggle("on", show);
      if (!show) return;
      const v = lvl(Z);
      const k = 2 ** (z - Z);
      const f = 2 ** (16 - Z);
      img.style.transform = `translate(${cw / 2 + (v.x0 - cx / f) * k}px,${ch / 2 + (v.y0 - cy / f) * k}px) scale(${k})`;
      img.style.zIndex = Z === L ? "1" : "0";
    });
    const k16 = 2 ** (z - 16);
    pin!.style.transform = `translate(${cw / 2 + (HX - cx) * k16}px,${ch / 2 + (HY - cy) * k16}px) translate(-50%,calc(-100% - 9px))`;
    if (zb[0]) zb[0].disabled = z >= ZMAX - 0.01;
    if (zb[1]) zb[1].disabled = z <= zmin + 0.01;
  }
  function zoomAt(sx: number, sy: number, dz: number) {
    const cw = box!.clientWidth;
    const ch = box!.clientHeight;
    const k = 2 ** (z - 16);
    const wx = cx + (sx - cw / 2) / k;
    const wy = cy + (sy - ch / 2) / k;
    z = cl(z + dz, zmin, ZMAX);
    const k2 = 2 ** (z - 16);
    cx = wx - (sx - cw / 2) / k2;
    cy = wy - (sy - ch / 2) / k2;
    render();
  }
  const pan = (dx: number, dy: number) => {
    const k = 2 ** (z - 16);
    cx -= dx / k;
    cy -= dy / k;
    render();
  };
  const at = (x: number, y: number) => {
    const r = box.getBoundingClientRect();
    return [x - r.left, y - r.top] as const;
  };
  if (box.clientWidth < 500) z = 14;
  const ro = new ResizeObserver(render);
  ro.observe(box);
  render();
  let anim = 0;
  const ac = new AbortController();
  const o = { signal: ac.signal };
  zb.forEach((btn) =>
    btn.addEventListener(
      "click",
      () => {
        const from = z;
        const to = cl(Math.round((z + Number(btn.dataset.zoom)) * 2) / 2, zmin, ZMAX);
        const t0 = performance.now();
        const cw = box.clientWidth / 2;
        const ch = box.clientHeight / 2;
        cancelAnimationFrame(anim);
        if (reduce()) return zoomAt(cw, ch, to - z);
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / 260);
          const e = 1 - (1 - k) ** 3;
          zoomAt(cw, ch, from + (to - from) * e - z);
          if (k < 1) anim = requestAnimationFrame(step);
        };
        anim = requestAnimationFrame(step);
      },
      o,
    ),
  );
  let drag: [number, number] | null = null;
  box.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || (e.target as Element).closest(".map-zoom"))
        return;
      drag = [e.clientX, e.clientY];
      moved = 0;
    },
    o,
  );
  box.addEventListener(
    "pointermove",
    (e) => {
      if (!drag) return;
      const dx = e.clientX - drag[0];
      const dy = e.clientY - drag[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 8 && !box.classList.contains("is-drag")) {
        box.classList.add("is-drag");
        box.setPointerCapture(e.pointerId);
      }
      drag = [e.clientX, e.clientY];
      if (moved > 8) pan(dx, dy);
    },
    o,
  );
  const end = () => {
    drag = null;
    box.classList.remove("is-drag");
  };
  box.addEventListener("pointerup", end, o);
  box.addEventListener("pointercancel", end, o);
  box.addEventListener(
    "click",
    (e) => {
      if ((e.target as Element).closest(".map-zoom, .map-pin")) return;
      if (moved > 8) {
        moved = 0;
        return;
      }
      pin.click();
    },
    o,
  );
  pin.addEventListener(
    "click",
    (e) => {
      if (moved > 8) {
        e.preventDefault();
        moved = 0;
      }
    },
    o,
  );
  box.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const [x, y] = at(e.clientX, e.clientY);
      zoomAt(x, y, -e.deltaY * 0.01);
    },
    { passive: false, signal: ac.signal },
  );
  box.addEventListener(
    "pointerenter",
    (e) => {
      if (e.pointerType === "mouse" && !box.dataset.seen) {
        box.dataset.seen = "1";
        say(t.mapHintMouse, 2600);
      }
    },
    o,
  );
  let t0: { x: number; y: number; d: number } | null = null;
  let start: [number, number] = [0, 0];
  const two = (tl: TouchList) => {
    const a = tl[0]!;
    const b = tl[1]!;
    return {
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
      d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
    };
  };
  box.addEventListener(
    "touchstart",
    (e) => {
      if ((e.target as Element).closest(".map-zoom")) return;
      if (e.touches.length === 2) {
        t0 = two(e.touches);
        moved = 10;
      } else if (e.touches[0]) {
        t0 = null;
        moved = 0;
        start = [e.touches[0].clientX, e.touches[0].clientY];
      }
    },
    { passive: true, signal: ac.signal },
  );
  box.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2 && t0) {
        e.preventDefault();
        const n = two(e.touches);
        const [x, y] = at(n.x, n.y);
        pan(n.x - t0.x, n.y - t0.y);
        if (t0.d) zoomAt(x, y, Math.log2(n.d / t0.d));
        t0 = n;
        return;
      }
      const p = e.touches[0];
      if (
        e.touches.length === 1 &&
        p &&
        Math.abs(p.clientY - start[1]) + Math.abs(p.clientX - start[0]) > 24
      )
        say(t.mapHintTouch);
    },
    { passive: false, signal: ac.signal },
  );
  box.addEventListener(
    "touchend",
    (e) => {
      if (e.touches.length < 2) t0 = null;
    },
    o,
  );
  box.addEventListener(
    "keydown",
    (e) => {
      const k = e.key;
      if (k === "ArrowLeft") pan(80, 0);
      else if (k === "ArrowRight") pan(-80, 0);
      else if (k === "ArrowUp") pan(0, 80);
      else if (k === "ArrowDown") pan(0, -80);
      else if (k === "+" || k === "=") zoomAt(box.clientWidth / 2, box.clientHeight / 2, 0.5);
      else if (k === "-") zoomAt(box.clientWidth / 2, box.clientHeight / 2, -0.5);
      else if (k === "Home") {
        cx = HX;
        cy = HY;
        render();
      } else if (k === "Enter") pin.click();
      else return;
      e.preventDefault();
    },
    o,
  );
  return () => {
    ac.abort();
    ro.disconnect();
    cancelAnimationFrame(anim);
  };
}

/**
 * Comportamientos de la maqueta aprobada sobre el HTML que pinta el servidor (el contenido se lee sin JavaScript).
 * Escuchas globales una sola vez; lo propio de cada página se vuelve a montar al cambiar de página.
 */
export function Enhance(props: EnhanceProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const ac = new AbortController();
    const o = { signal: ac.signal };
    renderTheme();
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", renderTheme, o);
    document.addEventListener(
      "click",
      (e) => {
        const el = e.target as Element;
        const th = el.closest<HTMLElement>("[data-theme-toggle]");
        if (th) {
          const r = th.getBoundingClientRect();
          setTheme(
            currentTheme() === "dark" ? "light" : "dark",
            r.left + r.width / 2,
            r.top + r.height / 2,
          );
          return;
        }
        const lb = el.closest<HTMLElement>("[data-lang]");
        if (lb) {
          const to = lb.dataset.lang;
          if (to === props.lang) return;
          const path = location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
          router.push(`${to === "en" ? `/en${path === "/" ? "" : path}` : path}${location.hash}`);
          return;
        }
        if (el.closest("#menuBtn")) {
          const open = $("#nav")?.classList.toggle("open") ?? false;
          $("#menuBtn")?.setAttribute("aria-expanded", String(open));
          document.body.classList.toggle("noscroll", open);
          return;
        }
        const bk = el.closest<HTMLElement>("[data-open-booking]");
        if (bk) {
          e.preventDefault();
          closeMenu();
          void openBooking(props, bk, { roomId: bk.dataset.mewsRoom || undefined });
          return;
        }
        const a = el.closest<HTMLAnchorElement>("a[href*='#']");
        if (a && a.origin === location.origin && a.pathname === location.pathname) {
          const id = decodeURIComponent(a.hash.slice(1));
          if (id && id !== "main" && document.getElementById(id)) {
            e.preventDefault();
            closeMenu();
            history.pushState(null, "", a.hash);
            goSec(id);
          }
        }
        if (el.closest("#nav a")) closeMenu();
      },
      o,
    );
    document.addEventListener(
      "submit",
      (e) => {
        const f = e.target as HTMLFormElement;
        if (f.id !== "heroBar") return;
        e.preventDefault();
        const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.value;
        void openBooking(props, (e as SubmitEvent).submitter as HTMLElement | null, {
          arrive: v("arrive"),
          depart: v("depart"),
          adults: Math.min(Number(v("guests") || 2), 4),
        });
      },
      o,
    );
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && !$(".back:not([hidden])")) closeMenu();
      },
      o,
    );
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    closeMenu();
    // Cabecera con filete al hacer scroll (sin escuchar el scroll)
    const hdr = $("#hdr");
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(sentinel);
    const so = new IntersectionObserver(([en]) =>
      hdr?.classList.toggle("scrolled", !en?.isIntersecting),
    );
    so.observe(sentinel);
    observeReveal();
    const off = [walkGeometry(), spaTabs(), packages(), roomTrack(), mapNav(props.t)];
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      setTimeout(() => goSec(id, false), 60);
    }
    return () => {
      so.disconnect();
      sentinel.remove();
      off.forEach((f) => f());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
