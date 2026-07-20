const CLUSTERS = [
  {
    name: "Tomašev, Franklin & Osindero",
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
    name: "Lewis Hammond (with Alan Chan)",
    summary:
      "Moves from mapping the risk landscape (a foundational multi-institution survey of multi-agent risks, with Chan) to accountability infrastructure for that landscape (IDs for AI Systems, again with Chan) to a specific applied delegation mechanism (Habermolt). Survey, proposed system, and applied deployment in sequence — a program moving from mapping risk to building tooling to testing delegation in practice.",
    papers: [
      {
        title: "Multi-Agent Risks from Advanced AI",
        url: "https://arxiv.org/abs/2502.14143",
      },
      { title: "IDs for AI Systems", url: "https://arxiv.org/abs/2406.12137" },
      {
        title: "Habermolt: Delegating Deliberation to AI Representatives",
        url: "https://arxiv.org/abs/2605.24413",
      },
    ],
  },
  {
    name: "Noam Kolt",
    summary:
      "Runs from technical accountability infrastructure (a co-author on IDs for AI Systems) to legal analysis of how existing regulation fails to address agentic AI specifically — a technical-to-legal governance throughline. Bridges into the Hammond cluster above via the shared IDs paper.",
    papers: [
      { title: "IDs for AI Systems", url: "https://arxiv.org/abs/2406.12137" },
      {
        title: "Regulating AI Agents",
        url: "https://arxiv.org/abs/2603.23471",
      },
    ],
  },
  {
    name: "David Krueger",
    summary:
      "Also bridges into the Hammond cluster via IDs for AI Systems, but points toward a different throughline — from accountability infrastructure to a specific long-horizon catastrophic threat model: the gradual, incremental loss of human influence without any single triggering event.",
    papers: [
      { title: "IDs for AI Systems", url: "https://arxiv.org/abs/2406.12137" },
      {
        title:
          "Gradual Disempowerment: Systemic Existential Risks from Incremental AI Development",
        url: "https://arxiv.org/abs/2501.16946",
      },
    ],
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
          Clusters below share authorship across two or more papers in our
          corpus — a &ldquo;who&rsquo;s doing what&rdquo; map, not a claim
          about a unifying theory of the field. This reflects who&apos;s
          visible in the corpus we&apos;ve indexed so far, not who&apos;s
          active in the field overall — a group with a coherent agenda but
          only one paper currently in the canon won&apos;t appear here.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2">
          {CLUSTERS.map((cluster) => (
            <div key={cluster.name} className="bg-background p-8">
              <h3 className="font-serif text-lg font-semibold">
                {cluster.name}
              </h3>
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
      </div>
    </section>
  );
}
