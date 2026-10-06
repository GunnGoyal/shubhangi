import { z } from "zod";
import {
  clientIp,
  enforceCors,
  enforceRateLimit,
  handleApiError,
  jsonError,
  jsonOk,
} from "@/lib/api";
import { writeAuditLog, alertOnCriticalAudit } from "@/lib/audit";
import { verifyPassword } from "@/lib/password";
import { createSession, regenerateSession, getSession } from "@/lib/session";
import { ensurePrototypeStore, getUserByEmail } from "@/lib/store";

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(12).max(256),
});

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const limited = enforceRateLimit(request, "auth-login", 10, 60_000);
  if (limited) return limited;

  const ip = clientIp(request);

  try {
    await ensurePrototypeStore();
    const json = await request.json();
    const { email, password } = bodySchema.parse(json);

    const user = getUserByEmail(email);
    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      writeAuditLog({
        action: "auth.login",
        outcome: "failure",
        ip,
        metadata: { email },
      });
      alertOnCriticalAudit({ action: "auth.bruteforce", outcome: "denied" });
      return jsonError(401, "invalid_credentials", origin);
    }

    const existing = await getSession();
    const session = existing
      ? await regenerateSession(existing.sessionId, user.id)
      : await createSession(user.id);

    writeAuditLog({
      action: "auth.login",
      outcome: "success",
      tenantId: user.tenantId,
      userId: user.id,
      ip,
    });

    return jsonOk(
      {
        mfaRequired: user.mfaEnabled,
        csrfToken: session.csrfToken,
        email: user.email,
      },
      origin,
    );
  } catch (err) {
    return handleApiError(err, origin);
  }
}
