export function FieldMap() {
  return (
    <section
      id="map"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-3xl border-t-2 border-accent pt-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Resource
        </p>
        <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
          Explore the field map.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70">
          A map of the people, organizations, and research directions working
          on large agent systems.
        </p>
        <a
          href="https://map.largeagentsystems.org/map"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block bg-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-background transition-colors hover:bg-accent"
        >
          Open the map
        </a>
      </div>
    </section>
  );
}
