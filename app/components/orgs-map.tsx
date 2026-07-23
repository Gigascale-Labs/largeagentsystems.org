export function OrgsMap() {
  return (
    <section
      id="map"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Org Map
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
          Explore the org map.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">
          A map of the people, organizations, and research directions working
          on large agent systems.
        </p>
        <a
          href="https://map.largeagentsystems.org/map"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-foreground px-8 py-3.5 text-sm font-medium uppercase tracking-wide text-background transition-colors hover:bg-accent"
        >
          Open the map
        </a>
      </div>
    </section>
  );
}
