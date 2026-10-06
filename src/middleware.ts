import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

function buildCsp(): string {
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
    : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com";
  const connectSrc = isDev
    ? "connect-src 'self' https://challenges.cloudflare.com ws: wss:"
    : "connect-src 'self' https://challenges.cloudflare.com";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    connectSrc,
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function securityHeaders(response: NextResponse) {
  response.headers.set("Content-Security-Policy", buildCsp());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return response;
}

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const limited = rateLimit(rateLimitKey(ip, "api-global"), 300, 60_000);
    if (!limited.ok) {
      return securityHeaders(
        NextResponse.json(
          { error: "rate_limited" },
          {
            status: 429,
            headers: { "Retry-After": String(limited.retryAfterSec) },
          },
        ),
      );
    }
  }

  return securityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
