"use client";

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { useCallback, useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  summary: string;
  phase: string;
};

export function PortalClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) {
      setLoggedIn(false);
      return;
    }
    const data = await res.json();
    setCsrfToken(data.csrfToken);
    setMfaEnabled(data.mfaEnabled);
    setEmail(data.email);
    setLoggedIn(true);

    const projRes = await fetch("/api/projects");
    if (projRes.ok) {
      const projData = await projRes.json();
      setProjects(projData.projects ?? []);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials.");
      return;
    }
    const data = await res.json();
    setCsrfToken(data.csrfToken);
    setMfaEnabled(data.mfaRequired);
    setLoggedIn(true);
    await loadSession();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    setProjects([]);
    setMfaVerified(false);
    setCsrfToken(null);
  }

  async function registerPasskey() {
    if (!csrfToken) return;
    const optRes = await fetch("/api/auth/webauthn/register/options", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken },
    });
    if (!optRes.ok) return;
    const options = await optRes.json();
    const att = await startRegistration({ optionsJSON: options });
    await fetch("/api/auth/webauthn/register/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(att),
    });
    setMfaEnabled(true);
  }

  async function verifyPasskey() {
    const optRes = await fetch("/api/auth/webauthn/authenticate/options", {
      method: "POST",
    });
    if (!optRes.ok) return;
    const options = await optRes.json();
    const att = await startAuthentication({ optionsJSON: options });
    const verRes = await fetch("/api/auth/webauthn/authenticate/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(att),
    });
    setMfaVerified(verRes.ok);
  }

  if (!loggedIn) {
    return (
      <form onSubmit={login} className="mt-10 max-w-md space-y-5">
        <p className="text-xs text-[var(--color-stone)]">
          Demo: client@hearthline.studio / password from{" "}
          <code className="text-[var(--color-wood)]">SEED_DEMO_PASSWORD</code>{" "}
          (default in dev: ChangeMe-Demo-2026!)
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-[var(--color-border)] bg-white/40 px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Password (min 12 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={12}
          className="w-full border border-[var(--color-border)] bg-white/40 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-800">{error}</p>}
        <button
          type="submit"
          className="rounded-sm bg-[var(--color-mahogany)] px-6 py-2 text-xs tracking-widest text-[var(--color-cream)] uppercase"
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-beige)]/40 p-4">
        <p className="text-sm">
          Signed in as <strong>{email}</strong>
        </p>
        <button
          type="button"
          onClick={logout}
          className="text-xs tracking-widest text-[var(--color-mahogany)] uppercase"
        >
          Sign out
        </button>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl text-[var(--color-mahogany)]">
          Multi-factor authentication (WebAuthn)
        </h2>
        <p className="text-sm text-[var(--color-stone)]">
          Register a passkey for this account, then verify to unlock sensitive
          actions.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={registerPasskey}
            className="border border-[var(--color-mahogany)] px-4 py-2 text-xs tracking-widest uppercase"
          >
            Register passkey
          </button>
          {mfaEnabled && (
            <button
              type="button"
              onClick={verifyPasskey}
              className="bg-[var(--color-wood)] px-4 py-2 text-xs tracking-widest text-[var(--color-cream)] uppercase"
            >
              Verify passkey
            </button>
          )}
        </div>
        {mfaVerified && (
          <p className="text-sm text-[var(--color-mahogany)]">MFA verified.</p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-[var(--color-mahogany)]">
          Your projects
        </h2>
        <p className="mt-2 text-xs text-[var(--color-stone)]">
          Row-level isolation: only projects owned by your account in your tenant
          are returned (BOLA-safe API).
        </p>
        <ul className="mt-6 space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="border-l-2 border-[var(--color-mahogany)] pl-4"
            >
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-[var(--color-stone)]">{p.summary}</p>
              <p className="mt-1 text-xs tracking-wide text-[var(--color-wood)] uppercase">
                {p.phase}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
