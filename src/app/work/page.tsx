import type { Metadata } from "next";
import { DecorativePanel } from "@/components/DecorativePanel";

export const metadata: Metadata = {
  title: "Work",
};

const projects = [
  {
    title: "Riverside Residence",
    location: "Willamette Valley, OR",
    typology: "Single-family",
    note: "Limestone plinth, cedar cladding, and a continuous clerestory.",
  },
  {
    title: "Civic Arts Annex",
    location: "Portland, OR",
    typology: "Cultural",
    note: "Timber liner within a restored brick shell.",
  },
  {
    title: "Harbor House",
    location: "Astoria, OR",
    typology: "Hospitality",
    note: "Twelve suites organized around a sheltered courtyard.",
  },
  {
    title: "Maple Street Townhomes",
    location: "Seattle, WA",
    typology: "Multifamily",
    note: "Modular bay rhythm in board-formed concrete and ash.",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-serif text-4xl text-[var(--color-mahogany)] md:text-5xl">
        Work
      </h1>
      <p className="mt-6 max-w-2xl text-sm text-[var(--color-stone)]">
        A selection of built and in-progress commissions. Imagery is omitted by
        design — material and proportion speak first.
      </p>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => (
          <article key={p.title} className="space-y-4">
            <DecorativePanel
              title={p.title}
              subtitle={`${p.typology} · ${p.location}`}
              variant={i % 2 === 0 ? "linen" : "stone"}
            />
            <p className="text-sm text-[var(--color-stone)]">{p.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
