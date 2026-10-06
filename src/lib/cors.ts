import { getAllowedOrigins } from "@/lib/env";

export function corsHeaders(origin: string | null): HeadersInit {
  const allowed = getAllowedOrigins();
  if (!origin || !allowed.includes(origin)) {
    return {};
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}
