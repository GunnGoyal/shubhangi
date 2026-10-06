import { z } from "zod";
import {
  clientIp,
  enforceCors,
  enforceRateLimit,
  handleApiError,
  jsonError,
  jsonOk,
} from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { verifyTurnstile, captchaRequired } from "@/lib/captcha";
import { sanitizePlainText } from "@/lib/sanitize";
import { getSession, verifyCsrf } from "@/lib/session";
import { addContactInquiry } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(320),
  message: z.string().min(20).max(4000),
  captchaToken: z.string().optional(),
  csrfToken: z.string().optional(),
});

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const limited = enforceRateLimit(request, "contact", 5, 60_000);
  if (limited) return limited;

  const ip = clientIp(request);

  try {
    const json = await request.json();
    const data = schema.parse(json);

    const session = await getSession();
    if (session) {
      const ok = await verifyCsrf(session, data.csrfToken);
      if (!ok) {
        return jsonError(403, "csrf_invalid", origin);
      }
    }

    if (captchaRequired()) {
      const captchaOk = await verifyTurnstile(data.captchaToken ?? "", ip);
      if (!captchaOk) {
        return jsonError(400, "captcha_failed", origin);
      }
    }

    addContactInquiry(
      sanitizePlainText(data.name),
      sanitizePlainText(data.email),
      sanitizePlainText(data.message),
    );

    writeAuditLog({
      action: "contact.submit",
      outcome: "success",
      ip,
      metadata: { email: data.email },
    });

    return jsonOk({ ok: true }, origin);
  } catch (err) {
    return handleApiError(err, origin);
  }
}
