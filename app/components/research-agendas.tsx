const CLUSTERS = [
  {
    name: "Tomašev, Franklin & Osindero",
    institution: "Google DeepMind",
    formal: true,
    summary:
      "Runs from a framework for the AI agent economy (Virtual Agent Economies), to cataloguing how that economy's structure can be exploited (AI Agent Traps), to governance mechanisms for delegation and accountability within it (Intelligent AI Delegation, Distributional AGI Safety). The claim-type mix — conceptual framework, risk taxonomy, proposed method — suggests a group moving from framework-building toward operational mechanism design.",
    papers: [
      {
        title: "Virtual Agent Economies",
        url: "https://arxiv.org/abs/2509.10147",
      },
      {
        title: "AI Agent Traps",
        url: "https://www.rivista.ai/wp-content/uploads/2026/04/ssrn-6372438.pdf",
      },
      {
        title: "Intelligent AI Delegation",
        url: "https://arxiv.org/abs/2602.11865",
      },
      {
        title: "Distributional AGI Safety",
        url: "https://arxiv.org/abs/2512.16856",
      },
    ],
  },
  {
    name: "Bisconti, Galisai, Pierucci, Bracale & Prandi",
    institution: "DEXAI – Icaro Lab",
    formal: true,
    summary:
      "Two papers building a single theoretical program in sequence: the first argues safety analysis needs to move from model-level to system-level and proposes the ESRH taxonomy of failure modes; the second goes a level deeper, proposing a formal 'microphysics' of agent-to-agent interaction as the mechanism generating those failures. Both are conceptual-framework papers — a layered apparatus being built out, not yet tested empirically within this pair.",
    papers: [
      {
        title: "Beyond Single-Agent Safety: A Taxonomy of Risks in LLM-to-LLM Interactions",
        url: "https://arxiv.org/abs/2512.02682",
      },
      {
        title: "Agentic Microphysics: A Manifesto for Generative AI Safety",
        url: "https://arxiv.org/abs/2604.15236",
      },
    ],
  },
  {
    name: "Lewis Hammond & Alan Chan",
    institution: "Cooperative AI Foundation (Hammond) & Centre for the Governance of AI (Chan)",
    formal: false,
    summary:
      "Moves from mapping the risk landscape (a foundational multi-institution survey of multi-agent risks) to accountability infrastructure for that landscape (IDs for AI Systems) — survey followed by proposed system, both co-authored by the same pair. Unlike the two clusters above, this one crosses an institutional line: Hammond and Chan collaborate from two separate organizations, not one shared lab — an informal cross-institutional partnership rather than a single group's output.",
    papers: [
      {
        title: "Multi-Agent Risks from Advanced AI",
        url: "https://arxiv.org/abs/2502.14143",
      },
      { title: "IDs for AI Systems", url: "https://arxiv.org/abs/2406.12137" },
    ],
  },
];

// Author sets sharing exactly one paper with a cluster above, and only
// one author with it — under our >=2-shared-author threshold for a
// cluster, so flagged here rather than silently folded in or dropped.
const BORDERLINE = [
  {
    note: "Hammond alone (not Chan) also co-authors Habermolt: Delegating Deliberation to AI Representatives — a single-author bridge to the cluster above, not a second shared paper with Chan.",
  },
  {
    note: "Noam Kolt (University of Toronto) co-authors IDs for AI Systems (with Hammond & Chan, above) and, separately, Regulating AI Agents — but shares only himself, not a second author, across the two. IDs for AI Systems is itself a broad, ten-author, multi-institution coalition paper (GovAI, Cooperative AI Foundation, Cambridge, Toronto and others) — more a meeting point than a single group's work, which is why it bridges to several otherwise-unconnected authors here.",
  },
  {
    note: "David Krueger (University of Cambridge) co-authors IDs for AI Systems and, separately, Gradual Disempowerment — same single-author bridge pattern as Kolt, toward a different (x-risk) throughline.",
  },
];

export function ResearchAgendas() {
  return (
    <section
      id="agendas"
      className="scroll-mt-20 border-b border-rule px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Research Agendas
        </p>
        <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
          Groups whose work we&apos;ve indexed.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
          Clusters below share at least two authors across at least two
          papers in our corpus — a &ldquo;who&rsquo;s doing what&rdquo; map,
          not a claim about a unifying theory of the field. This reflects
          who&apos;s visible in the corpus we&apos;ve indexed so far, not
          who&apos;s active in the field overall — a group with a coherent
          agenda but only one paper currently in the canon won&apos;t appear
          here. Each cluster is also cross-checked against its authors&apos;
          institutions: two of the three below turn out to be one lab&apos;s
          output start to finish; the third is an informal partnership that
          crosses an institutional line.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2">
          {CLUSTERS.map((cluster, i) => (
            <div
              key={cluster.name}
              className={`bg-background p-8${
                i === CLUSTERS.length - 1 && CLUSTERS.length % 2 === 1
                  ? " md:col-span-2"
                  : ""
              }`}
            >
              <h3 className="font-serif text-lg font-semibold">
                {cluster.name}
              </h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent">
                {cluster.institution}
                {" — "}
                {cluster.formal ? "single institution" : "cross-institutional"}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                {cluster.summary}
              </p>
              <ul className="mt-6 space-y-2 border-t border-rule pt-4">
                {cluster.papers.map((paper) => (
                  <li key={paper.url}>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
                    >
                      {paper.title} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Borderline — not shown as clusters above
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/60">
            {BORDERLINE.map((item) => (
              <li key={item.note}>{item.note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
