# LAS Canon & Site — Addendum Implementation Notes

Implementation record for `las-canon-and-open-problems-spec.md`'s addendum
(Tasks A amendment, C, D, E, F, and the Disciplines caveat correction).
The base spec itself, and its full Task A/B execution, live outside this
repo; this file documents what was actually implementable here, against
the real 45-paper canon (`data/las-canon.csv`), and what remains blocked
pending further work upstream.

## Task A amendment: `claim_type`

Tagged for all 45 corpus entries in `data/las-canon.csv`, using the closed
set from the addendum (`theoretical/conceptual framework`, `empirical
study`, `survey/taxonomy`, `proposed method/system`, `position/opinion`,
`threat model articulation`, `policy/regulatory analysis`,
`dataset/tool`, `live deployment`). Multi-value entries use the
semicolon-separated format specified for the other five dimension
columns. No paper needed a value outside the closed set.

The other five Task A dimension columns (`system_type`,
`participant_mix`, `observability`, `focus_area`, `threat_model`) are not
tagged in this corpus yet — that tagging is base-spec Task A work with a
closed-set definition that isn't available in this repo. `data/las-canon.csv`
and `lib/canon-schema.ts` model them as present-but-currently-empty
columns rather than inventing value sets for them.

## Task C: Research Agendas / Groups

Method: clustered `data/las-canon.csv` by shared authorship
(`creators`), normalizing name variants (e.g. "P. Bisconti" /
"Piercosma Bisconti"), keeping author sets with 2+ papers in the corpus.
Implemented as `app/components/research-agendas.tsx`, wired into the site
nav and homepage.

Five clusters found:

1. **Tomašev, Franklin & Osindero** (4 papers) — Virtual Agent Economies,
   AI Agent Traps, Intelligent AI Delegation, Distributional AGI Safety.
2. **Bisconti, Galisai, Pierucci, Bracale & Prandi** (2 papers) — Beyond
   Single-Agent Safety (ESRH), Agentic Microphysics. Bisconti has a third
   corpus paper (AI Agents Under EU Law) with a different co-author set —
   noted separately rather than folded into this cluster.
3. **Lewis Hammond**, with Alan Chan co-authoring 2 of 3 (3 papers) —
   Multi-Agent Risks from Advanced AI, IDs for AI Systems, Habermolt.
4. **Noam Kolt** (2 papers) — IDs for AI Systems, Regulating AI Agents.
   Bridges into Hammond's cluster via the shared IDs paper.
5. **David Krueger** (2 papers) — IDs for AI Systems, Gradual
   Disempowerment. Also bridges via the shared IDs paper, toward a
   different (x-risk) throughline than Kolt's regulatory one.

These are the two clusters named as illustrative examples in the
addendum (1 and 2), plus three more found by running the method against
the full corpus rather than stopping at the examples.

Caveat (per spec): the section is framed as "groups whose work we've
indexed," not "the groups working on this" — see the framing copy in the
component itself.

## Task D: Dimension Heatmap (spec only, not implemented)

Functional requirement, recorded for whoever builds the interface later —
matches the addendum verbatim:

- User selects two dimensions from `system_type`, `participant_mix`,
  `observability`, `focus_area`, `threat_model`, `claim_type`.
- Grid: rows = dimension 1 values, columns = dimension 2 values, cell =
  count of papers carrying both values. A paper with multiple values in
  either dimension counts toward every cell its values touch.
- Cell shading by count, so sparse/empty cells are visually distinct.
- Clicking a cell surfaces the matching paper list via the same query
  logic as the Task A filter table — not a second, separately-built
  system.
- Open: exact page placement, and tech stack (depends on the still-unresolved
  choice for the rest of the site).

## Task E: Foundational Works — blocked on its own gate

Not run. The gate requires confirming every major `focus_area`,
`threat_model`, and `system_type` value has 2-3+ papers in the corpus,
using the Task D coverage matrix or an equivalent per-value check. None
of those three dimensions are tagged in this corpus yet (see the Task A
amendment note above), so the gate can't be evaluated, let alone passed.
This blocks both the targeted-expansion step and the citation-ranking
step. Revisit once base-spec Task A's tagging for those three dimensions
exists.

## Task F: Contribute-a-Source Intake (backend design)

`lib/canon-schema.ts` adds `PendingSubmission`, extending the canon entry
shape with `submitted_by` and `status` (`pending` / `approved` /
`rejected`), plus `rejection_reason` for rejected entries so a bad
submission isn't reconsidered from scratch — matching the addendum's
schema requirement.

Flow (backend logic only, no submission UI, no auto-approval, per the
addendum's explicit scope limits):

1. Intake: a URL (+ optional submitter note) enters a pending queue,
   never written directly to canon.
2. Fetch title/authors/date/abstract from the URL.
3. Tag all six dimension columns using the same don't-force-fit logic as
   Task A, plus the free-text `tags` field.
4. Entry sits in the pending queue with auto-generated tags until human
   review.
5. On approval, the entry (with any human corrections) is appended to
   `data/las-canon.csv` in the same schema as existing rows.

Steps 2-3 (URL metadata fetch, automatic tagging) need an actual
fetch/LLM-tagging service wired into the site's backend — a real
infrastructure decision (hosting, queue storage, API keys) that isn't
specified elsewhere in this repo. This doc and the schema in
`lib/canon-schema.ts` are the design; wiring the live pipeline is
follow-up work.

## Disciplines caveat correction

The "Large agent problems are highly cross-disciplinary" list in
`app/components/disciplines.tsx` (network science, social network
analysis, macroprudential regulation, market microstructure, multi-agent
evaluations, behavioural evaluations, population modelling) is
illustrative/inspirational framing text, not a rigorously scoped
taxonomy. Flagged with a code comment in that file: don't use it as a
checklist to audit the corpus or its tagging, and don't treat it as a
formal dimension system for filtering or the heatmap. It can stay as
motivating copy on the site.
