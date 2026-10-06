import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h1 className="font-serif text-4xl text-[var(--color-mahogany)]">
            Contact
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-[var(--color-stone)]">
            Share your site, timeline, and ambitions. New residential inquiries
            for 2027 openings are reviewed quarterly.
          </p>
          <address className="mt-10 not-italic text-sm text-[var(--color-stone)]">
            <strong className="text-[var(--color-charcoal)]">Studio</strong>
            <br />
            48 Mercer Street, Suite 12
            <br />
            Portland, OR 97204
            <br />
            <a
              href="mailto:studio@hearthline.studio"
              className="text-[var(--color-mahogany)] hover:underline"
            >
              studio@hearthline.studio
            </a>
          </address>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
