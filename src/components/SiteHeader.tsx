import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-cream)]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="group">
          <span className="block font-serif text-xl tracking-[0.2em] text-[var(--color-mahogany)] uppercase">
            Hearthline
          </span>
          <span className="block text-[0.65rem] tracking-[0.35em] text-[var(--color-stone)] uppercase">
            Architecture
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-[var(--color-charcoal)] transition hover:text-[var(--color-mahogany)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="rounded-sm border border-[var(--color-mahogany)] px-4 py-2 text-xs font-medium tracking-widest text-[var(--color-mahogany)] uppercase transition hover:bg-[var(--color-mahogany)] hover:text-[var(--color-cream)]"
          >
            Client Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
