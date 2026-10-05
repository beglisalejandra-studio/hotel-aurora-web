import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_CONSENT,
  hasDecided,
  parseConsent,
  serializeConsent,
  type Consent,
} from "@/lib/analytics/consent";
import {
  __resetAnalyticsForTests,
  registerAdapter,
  setConsentProvider,
  track,
  type AnalyticsEvent,
} from "@/lib/analytics/track";

afterEach(() => __resetAnalyticsForTests());

const consent = (analytics: boolean, marketing: boolean): Consent => ({
  ...DEFAULT_CONSENT,
  analytics,
  marketing,
});

describe("consentimiento", () => {
  it("por defecto todo lo no esencial está DENEGADO", () => {
    expect(parseConsent(undefined)).toEqual(DEFAULT_CONSENT);
    expect(DEFAULT_CONSENT.analytics).toBe(false);
    expect(DEFAULT_CONSENT.marketing).toBe(false);
  });
  it("ida y vuelta de la cookie", () => {
    const cookie = serializeConsent({ analytics: true, marketing: false }).split(";")[0] as string;
    expect(parseConsent(`otra=1; ${cookie}`)).toMatchObject({ analytics: true, marketing: false });
    expect(hasDecided(`x=1; ${cookie}`)).toBe(true);
    expect(hasDecided("x=1")).toBe(false);
  });
  it("cookie corrupta o de otra versión → vuelve a denegar", () => {
    expect(parseConsent("consent=%7Bmal")).toEqual(DEFAULT_CONSENT);
    expect(
      parseConsent(
        `consent=${encodeURIComponent(JSON.stringify({ v: 99, analytics: true, marketing: true }))}`,
      ),
    ).toEqual(DEFAULT_CONSENT);
  });
  it("la cookie es SameSite=Lax y Secure por defecto", () => {
    const c = serializeConsent({ analytics: false, marketing: false });
    expect(c).toMatch(/SameSite=Lax/);
    expect(c).toMatch(/; Secure/);
  });
});

describe("track", () => {
  const collect = () => {
    const got: AnalyticsEvent[] = [];
    registerAdapter((e) => got.push(e));
    return got;
  };

  it("no despacha sin consentimiento", () => {
    const got = collect();
    expect(track("cta_click", { cta_id: "hero" })).toBe(false);
    expect(got).toHaveLength(0);
  });

  it("despacha con consentimiento de analítica y añade event_id + versión de esquema", () => {
    const got = collect();
    setConsentProvider(() => consent(true, false));
    expect(track("cta_click", { cta_id: "hero", location: "above-fold" })).toBe(true);
    expect(got[0]).toMatchObject({ name: "cta_click", schema_version: 1 });
    expect(got[0]?.event_id).toBeTruthy();
  });

  it("los eventos de marketing exigen consentimiento de marketing", () => {
    const got = collect();
    setConsentProvider(() => consent(true, false));
    expect(track("purchase", { currency: "EUR", value: 10, transaction_id: "t1" })).toBe(false);
    setConsentProvider(() => consent(true, true));
    expect(track("purchase", { currency: "EUR", value: 10, transaction_id: "t2" })).toBe(true);
    expect(got).toHaveLength(1);
  });

  it("deduplica por event_id (sin conversiones dobles)", () => {
    const got = collect();
    setConsentProvider(() => consent(true, true));
    expect(
      track("purchase", { currency: "EUR", value: 5, transaction_id: "t3" }, { eventId: "evt-1" }),
    ).toBe(true);
    expect(
      track("purchase", { currency: "EUR", value: 5, transaction_id: "t3" }, { eventId: "evt-1" }),
    ).toBe(false);
    expect(got).toHaveLength(1);
  });

  it("rechaza parámetros desconocidos (evita colar PII)", () => {
    setConsentProvider(() => consent(true, true));
    const got = collect();
    // @ts-expect-error -- `email` no pertenece al esquema: debe rechazarse en ejecución
    expect(track("form_submit", { form_id: "contacto", success: true, email: "a@b.com" })).toBe(
      false,
    );
    expect(got).toHaveLength(0);
  });

  it("consent_update se registra siempre (es la prueba del consentimiento)", () => {
    const got = collect();
    expect(track("consent_update", { analytics: false, marketing: false })).toBe(true);
    expect(got).toHaveLength(1);
  });

  it("un adaptador que falla no rompe el resto", () => {
    setConsentProvider(() => consent(true, true));
    registerAdapter(() => {
      throw new Error("proveedor caído");
    });
    const got = collect();
    expect(track("download", { file_id: "guia" })).toBe(true);
    expect(got).toHaveLength(1);
  });
});
