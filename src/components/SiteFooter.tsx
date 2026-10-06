import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-beige)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-[var(--color-mahogany)]">
            Hearthline Architecture
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-stone)]">
            Residential and civic design rooted in material honesty, natural
            light, and enduring craft.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-[var(--color-charcoal)] uppercase">
            Studio
          </p>
          <p className="mt-3 text-sm text-[var(--color-stone)]">
            48 Mercer Street, Suite 12
            <br />
            Portland, OR 97204
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-[var(--color-charcoal)] uppercase">
            Connect
          </p>
          <p className="mt-3 text-sm text-[var(--color-stone)]">
            <Link href="/contact" className="hover:text-[var(--color-mahogany)]">
              Inquiries
            </Link>
            <br />
            <Link href="/portal" className="hover:text-[var(--color-mahogany)]">
              Client login
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] px-6 py-4 text-center text-xs text-[var(--color-stone)]">
        © {new Date().getFullYear()} Hearthline Architecture. All rights reserved.
      </div>
    </footer>
  );
}
