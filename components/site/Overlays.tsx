import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { telHref, waHref } from "@/lib/site-data";
import type { SiteData } from "@/lib/sanity/types";
import { Dock } from "./Dock";
import { RequestDialog } from "./RequestDialog";

/** Capas comunes a todas las páginas: contacto flotante, solicitudes y el aviso breve de la reserva. */
export function Overlays({ lang, data }: { lang: Locale; data: SiteData }) {
  const t = ui(lang);
  const s = data.settings;
  const faqs = (data.faqs ?? [])
    .map((f) => ({ q: tr(f.question, lang), a: tr(f.answer, lang) }))
    .filter((f) => f.q && f.a);
  return (
    <>
      <Dock
        lang={lang}
        faqs={faqs}
        ai={Boolean(process.env.ANTHROPIC_API_KEY)}
        wa={waHref(s, t.wa.info)}
        tel={telHref(s)}
        t={{
          talk: t.talk,
          assistant: t.assistant,
          assistantT: t.assistantT,
          assistantFaq: t.assistantFaq,
          assistantNote: t.assistantNote,
          faqNote: t.faqNote,
          hi: t.hi,
          ask: t.ask,
          askSend: t.askSend,
          human: t.human,
          humanA: t.humanA(s?.phone ?? ""),
          thinking: t.thinking,
          assistantDown: t.assistantDown,
          call: t.call,
          close: t.close,
          waNote: t.waNote,
        }}
      />
      <RequestDialog
        lang={lang}
        privacyHref={localePath(lang, "/privacidad")}
        t={{
          tableT: t.tableT,
          spaT: t.spaT,
          voucherT: t.voucherT,
          send: t.send,
          sending: t.sending,
          cancel: t.cancel,
          close: t.close,
          name: t.name,
          email: t.email,
          phone: t.phone,
          date: t.date,
          diners: t.diners,
          treatment: t.treatment,
          quantity: t.quantity,
          note: t.note,
          minData: t.minData,
          consentBefore: t.consentBefore,
          privacyPolicy: t.privacyPolicy,
          errReq: t.errReq,
          errMail: t.errMail,
          errDate: t.errDate,
          errConsent: t.errConsent,
          errSend: t.errSend,
          errRate: t.errRate,
          okT: t.okT,
          okP: t.okP,
          voucherNote: t.voucherNote,
        }}
      />
      <p className="toast" id="toast" role="status" hidden />
    </>
  );
}
