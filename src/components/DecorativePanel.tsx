type Props = {
  title: string;
  subtitle?: string;
  variant?: "mahogany" | "linen" | "stone";
};

export function DecorativePanel({
  title,
  subtitle,
  variant = "linen",
}: Props) {
  const bg =
    variant === "mahogany"
      ? "bg-[var(--color-mahogany)] text-[var(--color-cream)]"
      : variant === "stone"
        ? "bg-[var(--color-warm-grey)] text-[var(--color-charcoal)]"
        : "bg-[var(--color-beige)] text-[var(--color-charcoal)]";

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-[var(--color-border)] ${bg}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[linear-gradient(135deg,transparent_40%,var(--color-wood)_40%,var(--color-wood)_42%,transparent_42%)] bg-[length:24px_24px]" />
      </div>
      <div className="relative flex min-h-[180px] flex-col justify-end p-8 md:min-h-[240px]">
        <div className="mb-4 h-px w-16 bg-current opacity-40" />
        <p className="font-serif text-2xl md:text-3xl">{title}</p>
        {subtitle ? (
          <p className="mt-2 max-w-md text-sm opacity-80">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
