import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
};

const services = [
  {
    title: "Master planning",
    body: "Feasibility, zoning analysis, and massing studies for campuses and large residential parcels.",
  },
  {
    title: "Architecture",
    body: "Schematic design through construction administration with integrated structural and MEP partners.",
  },
  {
    title: "Interiors",
    body: "Fixed and loose furnishings, lighting, and material libraries aligned with architectural intent.",
  },
  {
    title: "Landscape coordination",
    body: "Courtyard, terrace, and native planting strategies with specialist landscape architects.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <h1 className="font-serif text-4xl text-[var(--color-mahogany)] md:text-5xl">
        Services
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--color-stone)]">
        Engagements are tailored to each client. Most projects include an
        integrated team from concept through occupancy.
      </p>
      <ul className="mt-14 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {services.map((s) => (
          <li key={s.title} className="grid gap-4 py-10 md:grid-cols-3">
            <h2 className="font-serif text-2xl text-[var(--color-wood)]">
              {s.title}
            </h2>
            <p className="md:col-span-2 text-sm leading-relaxed text-[var(--color-stone)]">
              {s.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
