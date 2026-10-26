"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { pickAspect, shouldLoadVideo, type Aspect } from "./hero-media-logic";

/**
 * Hero con imagen o video. Contrato (ver creative/manifest.json y la skill web-media-pipeline):
 *  - POSTER inmediato (next/image con prioridad): es el LCP y el respaldo si el video no se carga.
 *  - Video = mejora progresiva: lazy (solo al entrar en viewport), MUDO + playsInline + loop, preload="none".
 *  - No se carga con prefers-reduced-motion, ahorro de datos ni redes 2G.
 *  - Botón visible de pausa/reproducción (WCAG 2.2.2: contenido en movimiento de más de 5 s).
 *  - Variante por proporción de pantalla (16:9, 1:1, 9:16).
 *  - `children` = overlay (titular + CTA) SIEMPRE visible sobre el media; cuida el contraste AA.
 */
export interface HeroMediaSource {
  src: string;
  type: "video/mp4" | "video/webm";
}

export interface HeroMediaProps {
  poster: { src: string; width: number; height: number; alt: string };
  /** Fuentes por proporción; todas opcionales. Sin ninguna, solo se muestra el poster. */
  variants?: Partial<Record<Aspect, HeroMediaSource[]>>;
  /** Solo si el video tiene audio/voz (el autoplay exige mudo: captions para cualquier contenido hablado). */
  captions?: { src: string; srclang: string; label: string }[];
  autoplay?: boolean;
  priority?: boolean;
  pauseLabel?: string;
  playLabel?: string;
  className?: string;
  children?: ReactNode;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

export function HeroMedia({
  poster,
  variants,
  captions,
  autoplay = true,
  priority = true,
  pauseLabel = "Pausar video de fondo",
  playLabel = "Reproducir video de fondo",
  className = "",
  children,
}: HeroMediaProps) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true); // por defecto conservador hasta conocer la preferencia
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [aspect, setAspect] = useState<Aspect | null>(null);

  const available = (Object.keys(variants ?? {}) as Aspect[]).filter(
    (a) => (variants?.[a]?.length ?? 0) > 0,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setAspect(pickAspect(el.clientWidth, el.clientHeight, available));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `available` se deriva de `variants`
  }, [variants]);

  const conn =
    (typeof navigator !== "undefined"
      ? (navigator as Navigator & { connection?: NetworkInformation }).connection
      : undefined) ?? {};
  const sources = aspect ? (variants?.[aspect] ?? []) : [];
  const load = shouldLoadVideo({
    reducedMotion: reduced,
    saveData: Boolean(conn.saveData),
    effectiveType: conn.effectiveType,
    inView,
    autoplay,
    hasSources: sources.length > 0,
  });

  useEffect(() => {
    const v = video.current;
    if (!load || !v) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false), // el navegador bloqueó el autoplay: queda el poster y el botón de reproducir
    );
  }, [load, aspect]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={box} className={`relative isolate overflow-hidden ${className}`}>
      <Image
        src={poster.src}
        width={poster.width}
        height={poster.height}
        alt={poster.alt}
        priority={priority}
        sizes="100vw"
        className="h-full w-full object-cover"
      />
      {load && (
        <video
          key={aspect ?? "none"}
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={poster.src}
          aria-hidden="true"
          tabIndex={-1}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
          {captions?.map((c) => (
            <track key={c.src} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} />
          ))}
        </video>
      )}
      {children && <div className="relative z-10">{children}</div>}
      {load && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? pauseLabel : playLabel}
          className="absolute bottom-3 right-3 z-20 rounded-md bg-black/70 px-3 py-2 text-sm font-medium text-white"
        >
          {playing ? "Pausar" : "Reproducir"}
        </button>
      )}
    </div>
  );
}
