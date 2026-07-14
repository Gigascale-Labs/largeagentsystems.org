const AREAS = [
  {
    number: "01",
    title: "Monitoring",
    description:
      "Monitoring large agent systems presents several new challenges, including scaling via federated interpretability, behavioural interpretability for partially-observable agents, and privacy-preserving interpretability.",
  },
  {
    number: "02",
    title: "Steering",
    description:
      "Actively intervening in large systems avoids bad outcomes, when the system is too unconstrained to design against failure.",
  },
  {
    number: "03",
    title: "Simulation",
    description:
      "Large agent systems are too complex to predict many behaviours, so we simulate outcomes instead.",
  },
  {
    number: "04",
    title: "Redesign",
    description:
      "Modifying system mechanisms, entry rules, etc. to keep outcomes pro-human.",
  },
];

export function FocusAreas() {
  return (
    <section
      id="focus"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Focus Areas
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
          Focus areas.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area) => (
            <div key={area.title} className="border-t-2 border-accent pt-5">
              <span className="font-mono text-xs text-muted">
                {area.number}
              </span>
              <h3 className="mt-2 font-serif text-xl font-semibold">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
