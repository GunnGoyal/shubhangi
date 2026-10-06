import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { corsHeaders, isOriginAllowed } from "@/lib/cors";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export function jsonError(
  status: number,
  code: string,
  origin: string | null,
) {
  return NextResponse.json(
    { error: code },
    { status, headers: corsHeaders(origin) },
  );
}

export function jsonOk<T>(data: T, origin: string | null, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(origin),
  });
}

export function enforceCors(request: Request): string | null | NextResponse {
  const origin = request.headers.get("origin");
  if (origin && !isOriginAllowed(origin)) {
    return jsonError(403, "origin_forbidden", origin);
  }
  return origin;
}

export function enforceRateLimit(
  request: Request,
  route: string,
  limit = 60,
  windowMs = 60_000,
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const result = rateLimit(rateLimitKey(ip, route), limit, windowMs);
  if (!result.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfterSec),
          ...corsHeaders(request.headers.get("origin")),
        },
      },
    );
  }
  return null;
}

export function handleApiError(
  err: unknown,
  origin: string | null,
): NextResponse {
  if (err instanceof ZodError) {
    return jsonError(400, "invalid_request", origin);
  }
  console.error("[api]", err instanceof Error ? err.message : "unknown");
  return jsonError(500, "internal_error", origin);
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
