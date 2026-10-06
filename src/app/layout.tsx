import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const source = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Hearthline Architecture",
    template: "%s · Hearthline Architecture",
  },
  description:
    "Residential and civic architecture studio — material-led design without compromise.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${source.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-cream)] text-[var(--color-charcoal)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
