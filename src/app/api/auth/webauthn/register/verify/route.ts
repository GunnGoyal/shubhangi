import { enforceCors, jsonError, jsonOk, handleApiError, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { getSession, verifyCsrf } from "@/lib/session";
import { setUserMfaEnabled } from "@/lib/store";
import { finishRegistration } from "@/lib/webauthn";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) return jsonError(401, "unauthenticated", origin);

  const csrf = request.headers.get("x-csrf-token");
  if (!(await verifyCsrf(session, csrf))) {
    return jsonError(403, "csrf_invalid", origin);
  }

  try {
    const body = await request.json();
    await finishRegistration(session.userId, session.tenantId, body);
    setUserMfaEnabled(session.userId, true);

    writeAuditLog({
      action: "mfa.webauthn.register.complete",
      outcome: "success",
      tenantId: session.tenantId,
      userId: session.userId,
      ip: clientIp(request),
    });

    return jsonOk({ ok: true }, origin);
  } catch (err) {
    writeAuditLog({
      action: "mfa.webauthn.register.complete",
      outcome: "failure",
      tenantId: session.tenantId,
      userId: session.userId,
      ip: clientIp(request),
    });
    return handleApiError(err, origin);
  }
}
