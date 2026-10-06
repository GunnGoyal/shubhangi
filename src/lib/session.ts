import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import {
  deleteSession,
  ensurePrototypeStore,
  getSessionRecord,
  getUserById,
  saveSession,
} from "@/lib/store";
import { hmacSha256 } from "@/lib/crypto";
import { requireSecrets } from "@/lib/env";

const COOKIE_NAME = "hl_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export type SessionUser = {
  sessionId: string;
  userId: string;
  tenantId: string;
  email: string;
  role: "client" | "admin";
  mfaEnabled: boolean;
  csrfToken: string;
};

function signSessionId(sessionId: string): string {
  const { sessionSecret } = requireSecrets();
  const sig = hmacSha256(sessionSecret, sessionId);
  return `${sessionId}.${sig}`;
}

function parseSignedSession(value: string): string | null {
  const [sessionId, sig] = value.split(".");
  if (!sessionId || !sig) return null;
  const { sessionSecret } = requireSecrets();
  const expected = hmacSha256(sessionSecret, sessionId);
  if (sig !== expected) return null;
  return sessionId;
}

function cookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function csrfTokenForSession(sessionId: string): string {
  const { csrfSecret } = requireSecrets();
  return hmacSha256(csrfSecret, `csrf:${sessionId}`);
}

export async function createSession(userId: string): Promise<SessionUser> {
  await ensurePrototypeStore();
  const user = getUserById(userId);
  if (!user) throw new Error("User not found");

  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  saveSession({
    id: sessionId,
    userId: user.id,
    tenantId: user.tenantId,
    expiresAt,
  });

  const jar = await cookies();
  jar.set(COOKIE_NAME, signSessionId(sessionId), cookieOptions());

  return {
    sessionId,
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role,
    mfaEnabled: user.mfaEnabled,
    csrfToken: csrfTokenForSession(sessionId),
  };
}

export async function regenerateSession(
  oldSessionId: string,
  userId: string,
): Promise<SessionUser> {
  deleteSession(oldSessionId);
  return createSession(userId);
}

export async function destroySession(sessionId?: string) {
  if (sessionId) deleteSession(sessionId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
}

export async function getSession(): Promise<SessionUser | null> {
  await ensurePrototypeStore();
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const sessionId = parseSignedSession(raw);
  if (!sessionId) return null;

  const session = getSessionRecord(sessionId);
  if (!session) return null;

  const user = getUserById(session.userId);
  if (!user) return null;

  return {
    sessionId: session.id,
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role,
    mfaEnabled: user.mfaEnabled,
    csrfToken: csrfTokenForSession(sessionId),
  };
}

export async function verifyCsrf(
  session: SessionUser,
  token: string | null | undefined,
): Promise<boolean> {
  if (!token) return false;
  return token === csrfTokenForSession(session.sessionId);
}
