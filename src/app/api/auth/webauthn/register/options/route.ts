import { enforceCors, jsonError, jsonOk, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { getSession, verifyCsrf } from "@/lib/session";
import { beginRegistration } from "@/lib/webauthn";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  if (!session) return jsonError(401, "unauthenticated", origin);

  const csrf = request.headers.get("x-csrf-token");
  if (!(await verifyCsrf(session, csrf))) {
    return jsonError(403, "csrf_invalid", origin);
  }

  const options = await beginRegistration(session.userId, session.email);
  writeAuditLog({
    action: "mfa.webauthn.register.start",
    outcome: "success",
    tenantId: session.tenantId,
    userId: session.userId,
    ip: clientIp(request),
  });

  return jsonOk(options, origin);
}
