import type { Metadata } from "next";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { ContributeForm } from "../components/contribute-form";

export const metadata: Metadata = {
  title: "Contribute a Source — LargeAgentSystems.org",
  description:
    "Submit a paper, preprint, or report for the LAS canon. Every submission is reviewed by a maintainer before it's added.",
};

export default function ContributePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Contribute
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Point us at a source.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
            One of the field&apos;s barriers is a lack of data — pure-AI
            systems are rare, agent presence on mixed systems is hard to
            spot, and simulation papers rarely publish their runs. If you
            know a paper, preprint, or report that belongs in the canon,
            send it over. We&apos;ll pull what metadata we can, a maintainer
            tags it by hand, and it&apos;s merged in if it fits.
          </p>

          <div className="mt-12">
            <ContributeForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
