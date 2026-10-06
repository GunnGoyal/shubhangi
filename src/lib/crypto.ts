import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function secureCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashIp(ip: string): string {
  const salt = process.env.AUDIT_IP_SALT ?? "audit-ip-salt-change-in-prod";
  return sha256(`${salt}:${ip}`);
}
