import { getEnv } from "@/lib/env";

export async function verifyTurnstile(
  token: string,
  ip?: string,
): Promise<boolean> {
  const secret = getEnv().TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Development: skip when not configured
    return getEnv().NODE_ENV === "development";
  }
  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

export function captchaRequired(): boolean {
  return Boolean(getEnv().TURNSTILE_SECRET_KEY);
}

export function captchaSiteKey(): string | null {
  return getEnv().TURNSTILE_SITE_KEY ?? null;
}
