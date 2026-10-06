import { enforceCors, jsonOk, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { destroySession, getSession } from "@/lib/session";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const session = await getSession();
  const ip = clientIp(request);

  if (session) {
    writeAuditLog({
      action: "auth.logout",
      outcome: "success",
      tenantId: session.tenantId,
      userId: session.userId,
      ip,
    });
    await destroySession(session.sessionId);
  } else {
    await destroySession();
  }

  return jsonOk({ ok: true }, origin);
}
