# Airtable Intake Pipeline — Task F Status

**Updated 2026-07-23.** Contribute-a-Source (Task F, see `docs/las-canon-addendum.md`)
runs on Airtable: a `Pending Queue` table for submissions, manual reviewer
tagging, and an automation that promotes approved rows into `Canon`. The
write path (site form → Pending Queue) and the read path for `Canon` sync
(Airtable → JSON, daily) are both live. What's left is listed under **What's
Left** below.

## Infrastructure

| Item | ID |
|---|---|
| Base: LAS Canon | `apps8rBIORsmE7ij8` |
| Table: Canon | `tbl2XEeh8Rlnrlw0j` (45 rows) |
| Table: Pending Queue | `tblhFC8znRYLb80wG` |
| Airtable-hosted form (secondary entry point) | https://airtable.com/apps8rBIORsmE7ij8/pagBBh0fev2iJbqNR/form |

**Two intake paths, both write into Pending Queue:**
1. **Site form** (`/sources`) — `app/components/contribute-form.tsx` →
   `app/sources/actions.ts` → `lib/submission-store.ts`, which `POST`s
   directly to the Pending Queue table via Airtable's REST API. Primary
   path. Sets `status: "pending"` itself.
2. **Airtable-hosted form** — secondary/backup. Only captures `url` +
   `submitted_by`; every other field including `status` is left blank on
   creation, which the "Auto-Tagging on Record Creation" automation is
   *supposed* to fix (see What's Left).

**Canon sync:** `scripts/sync-airtable.mjs` pulls `Canon` → `data/las-canon.airtable.json`
(committed to git, not gitignored). Runs daily via
`.github/workflows/sync-airtable-daily.yml` (06:00 UTC + manual dispatch).
`lib/canon-data.ts` does **not** read this file yet — the site still reads
`data/las-canon.csv` for display. That's the one still-open half of the
read side (see What's Left).

**Tagging is manual**, not automated: Airtable Automations can't make
outbound webhook calls, so the original design (auto-tag via an external
service on record creation) isn't buildable as specified. A human reviewer
fills in the bibliographic fields and picks dimension values from each
field's choice list, same as an automated tagger would have.

### Table fields

Both tables mirror `lib/canon-schema.ts`'s `CanonEntry` (Canon) and
`PendingSubmission` (Pending Queue, `CanonEntry` + `submitted_by`, `status`,
`rejection_reason`, `submitter_note`). Field choice lists as currently
configured in Airtable:

| Field | Choices |
|---|---|
| `itemType` | bookSection, conferencePaper, dataset, journalArticle, preprint, report, webpage |
| `system_type` | production economy, social network, labour market, financial system |
| `participant_mix` | pure-AI, mixed human+AI |
| `observability` | aggregates observable, interactions observable, agents observable |
| `focus_area` | Monitoring, Steering, Simulation, Redesign |
| `threat_model` | Gradual Disempowerment, Systemic Instability, Inequality, Collective Superintelligence, Partially Observable Systems, Power Concentration, Outdated Models |
| `claim_type` | theoretical/conceptual framework, empirical study, survey/taxonomy, proposed method/system, position/opinion, threat model articulation, policy/regulatory analysis, dataset/tool, live deployment |
| `tag_confidence` | summary-only, full-text |
| `status` (Pending Queue only) | pending, approved, rejected |

**Known drift from `lib/canon-schema.ts`:** its `FOCUS_AREAS` includes
`"Design"`, which isn't a choice in either Airtable table yet — undecided
whether to add it to Airtable or drop it from the TS schema. Also:
`CanonEntry.institutions` exists in the TS schema and CSV data but isn't a
field in either Airtable table. (`CLAIM_TYPES` previously lacked
`"live deployment"` against the addendum's confirmed-authoritative 9-value
scheme — fixed 2026-07-23.)

## What's Left

**Airtable UI (manual — no available tool can do these):**
- [ ] Repurpose "Auto-Tagging on Record Creation": replace its dead webhook
  action with a single "Update record" action setting `status → "pending"`.
  Matters only for rows from the Airtable-hosted form; the site form
  already sets status in code.
- [ ] Add a Grid view on Pending Queue filtered to `status = pending`, for
  reviewers to work from.
- [ ] Delete or fix the stray Pending Queue row with `url: "test"`.
- [ ] Add `"Design"` to `focus_area` choices in both tables, and an
  `institutions` field to match `lib/canon-schema.ts` — or decide these
  shouldn't exist in Airtable and drop them from the TS schema instead.

**Code:**
- [x] `CLAIM_TYPES` in `lib/canon-schema.ts` now includes `"live deployment"`
  (9 values), matching the addendum's confirmed-authoritative scheme.
- [ ] Point `lib/canon-data.ts` at `data/las-canon.airtable.json` instead of
  `data/las-canon.csv` (with the CSV kept as fallback until this is
  confirmed stable — see "CSV retirement" below).

**Config / infra:**
- [ ] Set `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_PENDING_QUEUE_TABLE_ID`
  in `.env.local` (local dev) and in the production hosting environment —
  the site's contribute form fails without them, which wasn't true before
  this pipeline existed.
- [ ] Run one real submission through `next dev` once the key is available
  locally — only validated against the live Airtable schema directly so
  far (create + delete a throwaway record), not through the actual UI.
- [ ] Run one submission all the way through: site form → Pending Queue →
  manually tag → approve → confirm the promotion automation actually fires
  and creates the Canon row (it's built but has never fired for real).

**CSV retirement:** don't delete `data/las-canon.csv` until `lib/canon-data.ts`
reads only the Airtable JSON and that's been stable for a while — it's the
fallback if the Airtable pipeline breaks.

## Known constraints

- **API quota:** Airtable free plan caps at 1,000 calls/month. The daily
  sync is 1 call/day (~30/month); each contribute-form submission is 1
  more call. Site pages must never call the Airtable API on page load —
  only the sync script (scheduled) and the submit server action (one call
  per submission) do.
- **Mojibake:** several `summary` values in `data/las-canon.csv` (and thus
  Canon) have `â€"`-style encoding corruption. Copied verbatim into
  Airtable; fix in the CSV first, then re-sync — don't hand-clean in
  Airtable.
- **Credentials:** personal API token from https://airtable.com/account/tokens/pat.
  The GitHub Actions sync needs its own `AIRTABLE_API_KEY` repo secret,
  scoped to `data.records:read` with explicit access granted to the LAS
  Canon base (a PAT's access list doesn't auto-include bases from a
  different Airtable account/session).
