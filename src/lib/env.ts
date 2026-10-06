import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SESSION_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
  WEBAUTHN_RP_ID: z.string().optional(),
  WEBAUTHN_RP_NAME: z.string().default("Hearthline Architecture"),
  WEBAUTHN_ORIGIN: z.string().url().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  TURNSTILE_SITE_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  SEED_DEMO_PASSWORD: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("Invalid environment configuration.");
  }
  cached = parsed.data;
  return cached;
}

export function requireSecrets(): {
  sessionSecret: string;
  csrfSecret: string;
} {
  const env = getEnv();
  const sessionSecret =
    env.SESSION_SECRET ??
    (env.NODE_ENV === "development"
      ? "dev-only-session-secret-min-32-chars!!"
      : undefined);
  const csrfSecret =
    env.CSRF_SECRET ??
    (env.NODE_ENV === "development"
      ? "dev-only-csrf-secret-min-32-chars!!!!"
      : undefined);

  if (!sessionSecret || !csrfSecret) {
    throw new Error("SESSION_SECRET and CSRF_SECRET must be set in production.");
  }

  return { sessionSecret, csrfSecret };
}

export function getWebAuthnConfig() {
  const env = getEnv();
  const origin =
    env.WEBAUTHN_ORIGIN ??
    (env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);
  const rpID = env.WEBAUTHN_RP_ID ?? "localhost";

  if (!origin) {
    throw new Error("WEBAUTHN_ORIGIN must be set in production.");
  }

  return {
    rpName: env.WEBAUTHN_RP_NAME,
    rpID,
    origin,
  };
}

export function getAllowedOrigins(): string[] {
  const env = getEnv();
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  }
  const origin = env.WEBAUTHN_ORIGIN ?? "http://localhost:3000";
  return [origin];
}
