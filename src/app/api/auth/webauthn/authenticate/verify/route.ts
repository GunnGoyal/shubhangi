import { enforceCors, jsonError, jsonOk, handleApiError, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { getSession } from "@/lib/session";
import { finishAuthentication } from "@/lib/webauthn";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) return jsonError(401, "unauthenticated", origin);

  try {
    const body = await request.json();
    await finishAuthentication(session.userId, body);

    writeAuditLog({
      action: "mfa.webauthn.auth.complete",
      outcome: "success",
      tenantId: session.tenantId,
      userId: session.userId,
      ip: clientIp(request),
    });

    return jsonOk({ verified: true }, origin);
  } catch (err) {
    writeAuditLog({
      action: "mfa.webauthn.auth.complete",
      outcome: "failure",
      tenantId: session.tenantId,
      userId: session.userId,
      ip: clientIp(request),
    });
    return handleApiError(err, origin);
  }
}
