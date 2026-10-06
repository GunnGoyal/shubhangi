import Link from "next/link";
import { DecorativePanel } from "@/components/DecorativePanel";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.4em] text-[var(--color-stone)] uppercase">
              Architecture &amp; interiors
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-[var(--color-mahogany)] md:text-6xl">
              Spaces shaped by light, timber, and time.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-[var(--color-stone)]">
              Hearthline is a Portland-based studio practicing residential,
              hospitality, and civic work. We design with restraint — letting
              cream plaster, honed stone, and dark wood carry the narrative.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/work"
                className="rounded-sm bg-[var(--color-mahogany)] px-8 py-3 text-xs font-medium tracking-widest text-[var(--color-cream)] uppercase"
              >
                View work
              </Link>
              <Link
                href="/contact"
                className="rounded-sm border border-[var(--color-mahogany)] px-8 py-3 text-xs font-medium tracking-widest text-[var(--color-mahogany)] uppercase"
              >
                Start a project
              </Link>
            </div>
          </div>
          <DecorativePanel
            title="Material palette"
            subtitle="Limestone · white oak · brushed brass · linen plaster"
            variant="mahogany"
          />
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-beige)]/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Discovery",
              d: "Site, climate, and craft culture inform every line.",
            },
            {
              n: "02",
              t: "Design",
              d: "Iterative models and full-scale mock-ups before documentation.",
            },
            {
              n: "03",
              t: "Delivery",
              d: "Resident architects on site through substantial completion.",
            },
          ].map((item) => (
            <div key={item.n} className="border-l border-[var(--color-mahogany)]/30 pl-6">
              <p className="text-xs tracking-widest text-[var(--color-stone)]">
                {item.n}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[var(--color-mahogany)]">
                {item.t}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-stone)]">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <DecorativePanel
            title="Civic Arts Annex"
            subtitle="Adaptive reuse · gallery &amp; maker studios"
            variant="stone"
          />
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-3xl text-[var(--color-mahogany)]">
              Selected commission
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone)]">
              A 1920s warehouse transformed through a new timber liner and
              clerestory rhythm — no ornament, only proportion and shadow.
            </p>
            <Link
              href="/work"
              className="mt-6 text-sm font-medium tracking-wide text-[var(--color-mahogany)] underline-offset-4 hover:underline"
            >
              Explore the portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
