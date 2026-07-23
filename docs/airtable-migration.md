# Airtable Migration — Setup Notes

Status: **infrastructure staged, not load-bearing yet.** The site still
reads `data/las-canon.csv` and `lib/canon-schema.ts`; nothing here is wired
into `next build` or `next dev`. This is the future direction described in
the attached note ("Move the Contribute-a-Source Pipeline to Airtable"),
built out early so the Airtable side exists and can be iterated on
alongside the still-changing canon/tagging spec, without yet cutting the
site over.

**Do not delete `data/las-canon.csv` or `lib/canon-schema.ts`.** The base
spec work (Tasks A–F, tracked in `docs/las-canon-addendum.md`) is still
being revised on its own branch. Airtable stays a mirror, kept in sync one
way (Airtable → JSON, pulled manually for now), until that spec work
stabilizes and Task F (Contribute-a-Source intake) actually needs a
running backend. At that point the site's data-serving layer switches to
reading the synced JSON (or Airtable directly, if the traffic math changes)
and the CSV can retire.

## What exists

**Base:** `LAS Canon` (`apps8rBIORsmE7ij8`), in the connected Airtable
account's "My First Workspace". Two tables, field-for-field mirrors of the
two types in `lib/canon-schema.ts`:

- **Canon** (`tbl2XEeh8Rlnrlw0j`) — mirrors `CanonEntry`. Seeded with all 45
  rows currently in `data/las-canon.csv` (`title`, `itemType`, `creators`,
  `date`, `url`, `tags`, `summary`, the six closed-set dimension columns as
  `multipleSelects`, `tag_confidence` as `singleSelect`).
- **Pending Queue** (`tblhFC8znRYLb80wG`) — mirrors `PendingSubmission`
  (`CanonEntry` + `submitted_by`, `status`, `rejection_reason`). This is
  the Task F intake queue. Currently empty.

Field choice lists (`system_type`, `participant_mix`, `observability`,
`focus_area`, `threat_model`, `claim_type`, `itemType`, `tag_confidence`)
were copied from the `as const` arrays in `lib/canon-schema.ts` at the time
of writing. **If that file's dimension values change on the spec branch,
the Airtable choice lists need updating to match** — there's no
schema-sync automation for this yet, it's a manual `update_field` /
Airtable-UI edit.

One pre-existing data-quality note, carried over as-is rather than fixed
here: several `summary` values in `data/las-canon.csv` have mojibake
(`â€”` for em dash), likely from a prior copy/paste through the wrong
encoding. Copied verbatim into Airtable rather than cleaned up, since
that's a canon data-quality fix, not an Airtable-migration concern.

## What's still manual (not scriptable via the tools available here)

- **The intake form.** Airtable Forms are a native per-table feature
  (`Pending Queue` → Form view → "Create form") — there's no API/MCP
  tool to create one, so this needs a couple of minutes in the Airtable
  UI. Expose only `url` (required) and `submitted_by`; leave every other
  field hidden so reviewers/auto-tagging fill them in, not submitters.
- **The auto-tagging Automation.** The future-direction note calls for
  "an Automation that triggers auto-tagging on new records." Airtable
  Automations (trigger: record created in Pending Queue; action: call
  a script/webhook to tag against the six dimensions) aren't
  configurable through the current tool access either — set up via the
  Airtable UI's Automations tab, calling out to whatever tagging logic
  the data-pipeline side of Task F ends up using.
- **Promotion from Pending Queue → Canon.** No automation for this yet;
  a reviewer approves a row (`status: approved`) and copies it into
  `Canon` by hand, or this becomes a second Automation later.

## The sync mechanism

`scripts/sync-airtable.mjs` — pulls the `Canon` table down to
`data/las-canon.airtable.json`. Plain Node (`fetch` + `fs`), no new
dependency. This exists so the **site never calls the Airtable API on a
page load** — the free plan's 1,000 calls/month is sized for occasional
syncs, not visitor traffic. One sync run = one API call, regardless of
site traffic.

```bash
cp .env.example .env.local   # fill in AIRTABLE_API_KEY
npm run sync:airtable
```

**Scheduled:** `.github/workflows/sync-airtable-daily.yml` runs this
once a day (06:00 UTC) via GitHub Actions and commits
`data/las-canon.airtable.json` back to the repo if the sync produced a
diff — tracked in git (not gitignored) so the commit history doubles as
a change log. Requires an `AIRTABLE_API_KEY` repo secret (Settings →
Secrets and variables → Actions), scoped with `data.records:read` and
granted access to the LAS Canon base specifically (a PAT's "Access"
list doesn't auto-include bases created in a different Airtable
account/session — this bit us once already). Can also be triggered
manually via `gh workflow run "Daily Airtable Sync"` or the Actions tab.

Not read by any site code yet — that's the "site-side consumption" half
of the original note, still needing coordination with whatever ends up
building the site's actual data layer.

## Next steps, in order

1. Land the site's real data-serving layer (still unresolved per
   `docs/las-canon-addendum.md`) and decide where `las-canon.airtable.json`
   plugs in.
2. Build the intake form + auto-tagging Automation (manual Airtable-UI
   steps above).
3. Once the spec branch stabilizes and this pipeline is handling real
   submissions, retire `data/las-canon.csv` in favor of Airtable as the
   source of truth.
