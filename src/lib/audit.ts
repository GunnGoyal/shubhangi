import { nanoid } from "nanoid";
import { hashIp } from "@/lib/crypto";
import { pushAuditEntry } from "@/lib/store";

type AuditOutcome = "success" | "failure" | "denied";

export function writeAuditLog(params: {
  action: string;
  outcome: AuditOutcome;
  tenantId?: string | null;
  userId?: string | null;
  resourceType?: string;
  resourceId?: string;
  ip?: string | null;
  metadata?: Record<string, unknown>;
}) {
  pushAuditEntry({
    id: nanoid(),
    tenantId: params.tenantId ?? null,
    userId: params.userId ?? null,
    action: params.action,
    resourceType: params.resourceType ?? null,
    resourceId: params.resourceId ?? null,
    ipHash: params.ip ? hashIp(params.ip) : null,
    outcome: params.outcome,
    metadata: params.metadata ?? null,
    createdAt: new Date().toISOString(),
  });
}

export function alertOnCriticalAudit(entry: {
  action: string;
  outcome: AuditOutcome;
}) {
  if (
    entry.outcome === "denied" &&
    (entry.action === "auth.bruteforce" || entry.action === "bola.denied")
  ) {
    console.warn("[security-alert]", entry.action);
  }
}
