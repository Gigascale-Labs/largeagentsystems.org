import type { Metadata } from "next";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { CanonExplorer } from "../components/canon-explorer";
import { ContributeForm } from "../components/contribute-form";
import { getCanonEntries } from "@/lib/canon-data";

export const metadata: Metadata = {
  title: "Sources — LargeAgentSystems.org",
  description:
    "Cross-tabulate the LAS paper canon by system type, threat model, focus area, and more — find the gaps in the corpus.",
};

export default function SourcesPage() {
  const entries = getCanonEntries();

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Sources
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Cross-tabulate the canon.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
            {entries.length} papers, tagged across six closed-set dimensions
            plus free-text tags. Pick a row and a column, and an empty cell
            is a gap — either in the literature, or just in this reading
            list.
          </p>

          <div className="mt-12">
            <CanonExplorer entries={entries} />
          </div>

          <div className="mt-24 border-t-2 border-accent pt-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Contribute
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
              Point us at a source.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
              One of the field&apos;s barriers is a lack of data — pure-AI
              systems are rare, agent presence on mixed systems is hard to
              spot, and simulation papers rarely publish their runs. If you
              know a paper, preprint, or report that belongs in the canon,
              send it over. We&apos;ll pull what metadata we can, a
              maintainer tags it by hand, and it&apos;s merged in if it fits.
            </p>
            <div className="mt-10">
              <ContributeForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
