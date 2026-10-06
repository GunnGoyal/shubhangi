import { enforceCors, enforceRateLimit, jsonError, jsonOk, clientIp } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { storeUpload, validateUploadBuffer } from "@/lib/upload";
import { getSession, verifyCsrf } from "@/lib/session";

export async function POST(request: Request) {
  const origin = enforceCors(request);
  if (origin instanceof Response) return origin;

  const limited = enforceRateLimit(request, "upload", 10, 60_000);
  if (limited) return limited;

  const session = await getSession();
  if (!session) {
    return jsonError(401, "unauthenticated", origin);
  }

  const csrf = request.headers.get("x-csrf-token");
  if (!(await verifyCsrf(session, csrf))) {
    return jsonError(403, "csrf_invalid", origin);
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "invalid_request", origin);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const validation = validateUploadBuffer(buffer, file.type);
  if (!validation.ok) {
    writeAuditLog({
      action: "upload.rejected",
      outcome: "denied",
      tenantId: session.tenantId,
      userId: session.userId,
      ip: clientIp(request),
      metadata: { reason: validation.reason },
    });
    return jsonError(400, "invalid_file", origin);
  }

  const stored = storeUpload(buffer, validation.mime);
  writeAuditLog({
    action: "upload.accepted",
    outcome: "success",
    tenantId: session.tenantId,
    userId: session.userId,
    ip: clientIp(request),
    resourceType: "file",
    resourceId: stored,
  });

  return jsonOk({ fileId: stored }, origin);
}
