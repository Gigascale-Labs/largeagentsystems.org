export function PartHeader({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-20 border-t-4 border-accent px-6 pb-10 pt-16 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
