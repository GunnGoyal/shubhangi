import { nanoid } from "nanoid";
import { hashPassword } from "@/lib/password";

export type User = {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  role: "client" | "admin";
  mfaEnabled: boolean;
};

export type SessionRecord = {
  id: string;
  userId: string;
  tenantId: string;
  expiresAt: Date;
};

export type ClientProject = {
  id: string;
  tenantId: string;
  ownerUserId: string;
  title: string;
  summary: string;
  phase: string;
};

export type WebAuthnCredential = {
  id: string;
  userId: string;
  tenantId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  transports: string | null;
};

export type WebAuthnChallenge = {
  userId: string;
  challenge: string;
  expiresAt: Date;
};

const users: User[] = [];
const sessions = new Map<string, SessionRecord>();
const projects: ClientProject[] = [];
const contactInquiries: { id: string; name: string; email: string; message: string }[] =
  [];
const auditLogBuffer: unknown[] = [];
const webauthnCredentials: WebAuthnCredential[] = [];
const webauthnChallenges = new Map<string, WebAuthnChallenge>();

let ready = false;

export async function ensurePrototypeStore() {
  if (ready) return;
  const hash = await hashPassword(
    process.env.SEED_DEMO_PASSWORD ?? "ChangeMe-Demo-2026!",
  );

  users.push({
    id: "user-demo-client",
    tenantId: "tenant-hearthline",
    email: "client@hearthline.studio",
    passwordHash: hash,
    role: "client",
    mfaEnabled: false,
  });

  projects.push(
    {
      id: "proj-riverside",
      tenantId: "tenant-hearthline",
      ownerUserId: "user-demo-client",
      title: "Riverside Residence",
      summary: "Timber-frame pavilion with limestone courtyards.",
      phase: "Design Development",
    },
    {
      id: "proj-civic",
      tenantId: "tenant-hearthline",
      ownerUserId: "user-demo-client",
      title: "Civic Arts Annex",
      summary: "Adaptive reuse of a 1920s warehouse into gallery space.",
      phase: "Schematic Design",
    },
  );

  ready = true;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function setUserMfaEnabled(userId: string, enabled: boolean) {
  const user = getUserById(userId);
  if (user) user.mfaEnabled = enabled;
}

export function saveSession(record: SessionRecord) {
  sessions.set(record.id, record);
}

export function getSessionRecord(id: string): SessionRecord | undefined {
  const row = sessions.get(id);
  if (!row || row.expiresAt <= new Date()) {
    sessions.delete(id);
    return undefined;
  }
  return row;
}

export function deleteSession(id: string) {
  sessions.delete(id);
}

export function listProjectsForTenantOwner(tenantId: string, ownerUserId: string) {
  return projects.filter(
    (p) => p.tenantId === tenantId && p.ownerUserId === ownerUserId,
  );
}

export function getProjectForTenantOwner(
  projectId: string,
  tenantId: string,
  ownerUserId: string,
) {
  return projects.find(
    (p) =>
      p.id === projectId &&
      p.tenantId === tenantId &&
      p.ownerUserId === ownerUserId,
  );
}

export function addContactInquiry(name: string, email: string, message: string) {
  contactInquiries.push({ id: nanoid(), name, email, message });
}

export function pushAuditEntry(entry: unknown) {
  auditLogBuffer.push(entry);
  if (auditLogBuffer.length > 500) auditLogBuffer.shift();
}

export function listWebAuthnCredentials(userId: string) {
  return webauthnCredentials.filter((c) => c.userId === userId);
}

export function saveWebAuthnChallenge(challenge: WebAuthnChallenge) {
  webauthnChallenges.set(challenge.userId, challenge);
}

export function getWebAuthnChallenge(userId: string) {
  const row = webauthnChallenges.get(userId);
  if (!row || row.expiresAt < new Date()) {
    webauthnChallenges.delete(userId);
    return undefined;
  }
  return row;
}

export function clearWebAuthnChallenge(userId: string) {
  webauthnChallenges.delete(userId);
}

export function addWebAuthnCredential(cred: WebAuthnCredential) {
  webauthnCredentials.push(cred);
}

export function getWebAuthnCredentialByCredentialId(credentialId: string) {
  return webauthnCredentials.find((c) => c.credentialId === credentialId);
}

export function updateWebAuthnCounter(id: string, counter: number) {
  const cred = webauthnCredentials.find((c) => c.id === id);
  if (cred) cred.counter = counter;
}
