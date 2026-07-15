export function ComplexSystem() {
  return (
    <section
      id="framing"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Framing
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            A new type of system.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-foreground/80 md:text-lg">
          <p>
            Human systems were designed for humans. Large-scale changes to
            the participant mix on large systems has historically led to
            sudden, unforeseen, severe systemic failures - including the
            GFC, the 2010 Flash Crash, and political polarisation, partially
            attributed to foreign interference using bot farms.
          </p>
          <p>
            In the age of agentic AI, those changes could be catastrophic. A
            humanity disempowered by its tools may be unable to meaningfully
            change course when economic incentives turn against it. A rapid
            concentration of power could upend social contracts, leading to
            prolonged instability and diminishing the world&apos;s ability
            to respond to other threats. A collection of distributed agents
            could develop superintelligence, with unknowable consequences.
          </p>
        </div>
      </div>
    </section>
  );
}
