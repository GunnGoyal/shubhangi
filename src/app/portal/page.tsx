import { PortalClient } from "./PortalClient";

export const metadata = {
  title: "Client Portal",
};

export default function PortalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl text-[var(--color-mahogany)]">
        Client portal
      </h1>
      <p className="mt-4 text-sm text-[var(--color-stone)]">
        Prototype client area — project data is in memory for demo only
        (resets when the dev server restarts).
      </p>
      <PortalClient />
    </div>
  );
}
