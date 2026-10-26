import { sendLeadEmail } from "@/lib/email/resend";
import type { LeadSink } from "@/lib/leads/sink";

export const resendSink: LeadSink = {
  name: "resend",
  async deliver(lead) {
    await sendLeadEmail(lead);
  },
};
