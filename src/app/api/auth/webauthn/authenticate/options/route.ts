import { enforceCors, jsonError, jsonOk, enforceRateLimit, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { getSession } from "@/lib/session";
import { beginAuthentication } from "@/lib/webauthn";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const limited = enforceRateLimit(request, "webauthn-auth", 15, 60_000);
  if (limited) return limited;

  const session = await getSession();
  if (!session) return jsonError(401, "unauthenticated", origin);

  const options = await beginAuthentication(session.userId);
  writeAuditLog({
    action: "mfa.webauthn.auth.start",
    outcome: "success",
    tenantId: session.tenantId,
    userId: session.userId,
    ip: clientIp(request),
  });

  return jsonOk(options, origin);
}
