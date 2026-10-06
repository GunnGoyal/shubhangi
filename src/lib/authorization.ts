import type { SessionUser } from "@/lib/session";
import { writeAuditLog, alertOnCriticalAudit } from "@/lib/audit";
import { getProjectForTenantOwner, listProjectsForTenantOwner } from "@/lib/store";

export function getProjectForUser(
  projectId: string,
  session: SessionUser,
  ip?: string,
) {
  const project = getProjectForTenantOwner(
    projectId,
    session.tenantId,
    session.userId,
  );

  if (!project) {
    writeAuditLog({
      action: "bola.denied",
      outcome: "denied",
      tenantId: session.tenantId,
      userId: session.userId,
      resourceType: "client_project",
      resourceId: projectId,
      ip,
    });
    alertOnCriticalAudit({ action: "bola.denied", outcome: "denied" });
  }

  return project ?? null;
}

export function listProjectsForUser(session: SessionUser) {
  return listProjectsForTenantOwner(session.tenantId, session.userId);
}
