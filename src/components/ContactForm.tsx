"use client";

import { useState } from "react";
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    const captchaEl = form.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]',
    );

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        captchaToken: captchaEl?.value ?? undefined,
      }),
    });

    setStatus(res.ok ? "sent" : "error");
    if (res.ok) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
          Name
        </label>
        <input
          name="name"
          required
          minLength={2}
          className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-[var(--color-charcoal)] outline-none focus:border-[var(--color-mahogany)]"
        />
      </div>
      <div>
        <label className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-2 text-[var(--color-charcoal)] outline-none focus:border-[var(--color-mahogany)]"
        />
      </div>
      <div>
        <label className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
          Project narrative
        </label>
        <textarea
          name="message"
          required
          minLength={20}
          rows={5}
          className="mt-2 w-full resize-y border border-[var(--color-border)] bg-[var(--color-cream)]/50 p-3 text-[var(--color-charcoal)] outline-none focus:border-[var(--color-mahogany)]"
        />
      </div>
      {siteKey ? (
        <div
          className="cf-turnstile"
          data-sitekey={siteKey}
          data-theme="light"
        />
      ) : (
        <p className="text-xs text-[var(--color-stone)]">
          CAPTCHA is enforced in production via Cloudflare Turnstile.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-[var(--color-mahogany)] px-8 py-3 text-xs font-medium tracking-widest text-[var(--color-cream)] uppercase transition hover:bg-[var(--color-wood)] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "sent" && (
        <p className="text-sm text-[var(--color-mahogany)]" role="status">
          Thank you. We will respond within two business days.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-800" role="alert">
          We could not send your message. Please try again later.
        </p>
      )}
    </form>
  );
}
