import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="text-xs tracking-[0.35em] text-[var(--color-stone)] uppercase">
        Studio
      </p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl text-[var(--color-mahogany)] md:text-5xl">
        We build calm environments for complex lives.
      </h1>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <p className="text-sm leading-relaxed text-[var(--color-stone)]">
          Founded in 2008, Hearthline Architecture brings together architects,
          interior designers, and landscape collaborators under one roof. Our
          work spans custom residences, boutique hospitality, and modest civic
          buildings — always with an emphasis on durable assemblies and honest
          detailing.
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-stone)]">
          We do not chase trends. Instead we study regional craft, the path of
          the sun, and how rooms gather people. The result is architecture that
          feels inevitable: quiet on first impression, richer with every visit.
        </p>
      </div>
      <dl className="mt-16 grid gap-8 border-t border-[var(--color-border)] pt-12 sm:grid-cols-3">
        <div>
          <dt className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
            Principals
          </dt>
          <dd className="mt-2 font-serif text-xl text-[var(--color-mahogany)]">
            Elena Marsh &amp; Jonah Hale
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
            Licenses
          </dt>
          <dd className="mt-2 text-sm text-[var(--color-stone)]">
            Oregon, Washington, California
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-widest text-[var(--color-stone)] uppercase">
            Recognition
          </dt>
          <dd className="mt-2 text-sm text-[var(--color-stone)]">
            AIA Northwest Design Awards · 2024, 2022
          </dd>
        </div>
      </dl>
    </div>
  );
}
