# Airtable Intake Pipeline — Specification for AI Implementation

**Status:** Intake form live, tagging pivoted to manual (Airtable can't make outbound webhook calls — see Part 3), promotion automation built. Remaining: repurpose the record-creation automation to stamp `status = "pending"` (Part 3a), and site-side integration (Part 5).

This document specifies the remaining work to complete the Airtable-backed Contribute-a-Source intake pipeline (Task F). The table-side infrastructure (base, tables, canonical data sync, intake form, promotion automation) is already built; this spec covers what's left.

**Audience:** Airtable-focused AI implementing the remaining work.

**Context:** See `docs/airtable-migration.md` for the overall migration strategy, rationale, and constraints.

---

## Part 1: Airtable Infrastructure (Already Built)

### Base & Tables

| Item | ID | Field Count | Status |
|------|-----|-----|--------|
| **Base:** LAS Canon | `apps8rBIORsmE7ij8` | — | ✓ Created |
| **Table:** Canon | `tbl2XEeh8Rlnrlw0j` | 15 | ✓ Seeded with 45 rows |
| **Table:** Pending Queue | `tblhFC8znRYLb80wG` | 16 | ✓ Created; 1 test row as of 2026-07-23 |
| **Form:** Contribute a Source | `pagBBh0fev2iJbqNR` | — | ✓ Live: https://airtable.com/apps8rBIORsmE7ij8/pagBBh0fev2iJbqNR/form |
| **Automation:** Auto-Tagging on Record Creation | — | — | ⚠ Built but non-functional (webhook can't fire); needs repurposing per Part 3a |
| **Automation:** Approved → Canon promotion | — | — | ✓ Built; not yet tested end-to-end (no row has reached `approved` status yet) |

**Known data-quality note:** the one test row in Pending Queue has `url: "test"` — the form's `url` field type didn't reject a non-URL string. Not a blocker, just confirms the form doesn't validate URL format.

### Canon Table Fields

Mirrors `lib/canon-schema.ts` CanonEntry interface. All 45 rows from `data/las-canon.csv` seeded here. Read-only source; updated only via `npm run sync:airtable`.

| Field Name | Type | Notes |
|-----|-----|-----|
| `title` | Text | Paper title |
| `itemType` | Text | Article type (e.g., "journal article", "report") |
| `creators` | Text | Authors/creators, comma-separated |
| `date` | Text | Publication date (format varies in source data) |
| `url` | URL | Direct link to paper |
| `tags` | Text | Free-text tags (comma or semicolon separated) |
| `summary` | Long text | Paper abstract/summary (⚠️ contains mojibake: `â€"` for em-dashes; copied verbatim from CSV; do not clean up) |
| `system_type` | Multiple select | Choices: "production economy", "social network", "labour market", "financial system" |
| `participant_mix` | Multiple select | Choices: "pure-AI", "mixed human+AI" |
| `observability` | Multiple select | Choices: "aggregates observable", "interactions observable", "agents observable" |
| `focus_area` | Multiple select | Choices: "Monitoring", "Steering", "Simulation", "Redesign" |
| `threat_model` | Multiple select | Choices: "Gradual Disempowerment", "Systemic Instability", "Inequality", "Collective Superintelligence", "Partially Observable Systems", "Power Concentration", "Outdated Models" |
| `claim_type` | Multiple select | Choices: "theoretical/conceptual framework", "empirical study", "survey/taxonomy", "proposed method/system", "position/opinion", "threat model articulation", "policy/regulatory analysis", "dataset/tool", "live deployment" |
| `tag_confidence` | Single select | Choices: "summary-only", "full-text"; all 45 rows: "summary-only" |

### Pending Queue Table Fields

Mirrors `lib/canon-schema.ts` PendingSubmission interface (extends CanonEntry). Submission intake form writes here; reviewers update `status` and `rejection_reason`.

Same 15 fields as Canon, plus:

| Field Name | Type | Notes |
|-----|-----|-----|
| `submitted_by` | Text | Email or name of submitter |
| `status` | Single select | Choices: "pending", "approved", "rejected" |
| `rejection_reason` | Long text | Required when status="rejected" |

---

## Part 2: Intake Form (Manual Airtable UI Setup)

### Goal
Create a public or authenticated form on the Pending Queue table that:
- Accepts only `url` (required) and `submitted_by` (required) from end users
- Hides all other fields so reviewers/auto-tagging fill them in, not submitters

### Steps

1. **Open the Pending Queue table** in the Airtable web app
   - Base: LAS Canon (`apps8rBIORsmE7ij8`)
   - Table: Pending Queue (`tblhFC8znRYLb80wG`)

2. **Create a new Form view**
   - Click the "+" next to the grid view tabs
   - Select "Form"
   - Name it (e.g., "Contribute a Source")

3. **Configure form fields**
   - Click the form settings gear icon
   - In the field list:
     - ✓ **Enable and make required:** `url`, `submitted_by`
     - ✗ **Disable (hide) all other fields:** title, itemType, creators, date, tags, summary, all six dimensions, tag_confidence, status, rejection_reason
   - Auto-populate disabled fields with blank/default values on submission
   - Submitters should only see: `url` (text input, required) and `submitted_by` (text input, required)

4. **Set form submission behavior**
   - Redirect after submit: "Show success message" or redirect to a landing page (up to you)
   - Allow multiple submissions: enabled (same person can submit multiple papers)

5. **Test the form**
   - Submit a test entry with url and submitted_by only
   - Verify a new row appears in Pending Queue with those two fields populated
   - Verify all other fields are empty/default

6. **Share the form**
   - Copy the form's public link (gear icon → "Share this form")
   - This link goes in the site's "Contribute" page once site-side integration begins

---

## Part 3: Tagging — Manual, Not Automated (Revised 2026-07-23)

### Why this changed
The original plan called for an Automation that POSTs each new submission to an
external tagging service and writes the six dimension fields back from the
response. The Airtable environment executing these Automations **cannot make
outbound webhook/POST requests**, so that design is not buildable as specified.
Tagging is manual until that constraint changes or a different integration
path is found (e.g., a Zapier/Make bridge, or the tagging service polling
Airtable's API instead of Airtable calling out to it).

### Current pipeline (manual tagging)

1. User submits via the intake form → new row in Pending Queue with `url` +
   `submitted_by` only.
2. **"Auto-Tagging on Record Creation" automation** fires on every new row.
   Repurposed (per Part 3a below) to stamp `status = "pending"` rather than
   attempt tagging — the schema (`SubmissionStatus` in `lib/canon-schema.ts`)
   treats `status` as always one of `"pending" | "approved" | "rejected"`,
   never blank, so this closes a real gap: rows created via the form
   previously had no `status` value at all.
3. **A human reviewer manually tags** the row: fills in the bibliographic
   fields (`title`, `itemType`, `creators`, `date`, `tags`, `summary`) by
   reading the source at `url`, then picks values for the six dimension
   fields from each field's existing choice list (same as the tagging
   service would have returned), and sets `tag_confidence` to
   `"summary-only"` or `"full-text"` depending on how much of the source
   they actually read.
4. Reviewer sets `status` to `"approved"` or `"rejected"` (+ `rejection_reason`
   if rejected).
5. **"Automated Copying of Approved Rows to Canon" automation** fires on the
   status change to `"approved"` and creates the matching Canon row (see
   Part 3b — this one *is* built and working, since it's a same-base
   record-to-record copy, not an outbound call).
6. `npm run sync:airtable` (still manual/unscheduled — see Part 4) pulls
   Canon into the site's JSON file.

### Part 3a: Repurpose the record-creation automation

The existing "Auto-Tagging on Record Creation in Pending Queue" automation
has a trigger (record created in Pending Queue) but its webhook action can
never succeed. Replace the webhook + update-from-response actions with a
single action:

- **Action type:** "Update record"
- **Record:** the triggering record
- **Field to set:** `status` → `"pending"`

This keeps the trigger useful (every new submission gets an explicit,
schema-valid status) instead of leaving a broken no-op automation running,
or turning it off and losing the signal entirely.

### Part 3b: Reviewer worklist

Add a Grid view on Pending Queue filtered to `status = "pending"` so
reviewers have a clean queue to work from. Quick manual step in the
Airtable UI (View menu → Create → Grid, then add the filter) — not
something either AI has a tool to create directly.

### Revisit later
If the tagging service becomes reachable from Airtable (e.g. via a
Zapier/Make automation platform bridge, or the tagging service switching to
polling Airtable's API on a schedule instead of Airtable calling out), the
original webhook design in this section's prior version is still the right
shape for it — request/response format included. Until then, treat manual
tagging as the steady-state, not a stopgap.

---

## Part 4: Sync Scheduling (Infrastructure Coordination)

### Current State
- `scripts/sync-airtable.mjs` pulls Canon table → `data/las-canon.airtable.json` (gitignored, regenerate on demand)
- Invoked manually: `npm run sync:airtable` (requires `AIRTABLE_API_KEY` in `.env.local`)
- One API call per sync, regardless of traffic; fits within free-plan 1,000 calls/month quota

### Next Steps
- **Not yet scheduled.** Sync only when Pending Queue submissions are coming in and approved rows are promoted to Canon
- Once Task F is live and reviewers are moving rows from Pending Queue → Canon:
  - Option A: Schedule via GitHub Actions workflow (daily or weekly, depending on submission volume)
  - Option B: Webhook-triggered from Airtable (Automation runs sync on Canon table update)
  - Option C: Scheduled job on deployment infrastructure (Vercel Cron, Lambda, etc.)
- **Constraint:** Site-side code must be updated first to read from `data/las-canon.airtable.json` instead of `data/las-canon.csv` (see Part 5)

---

## Part 5: Site-Side Integration Checklist

### Goal
The site currently reads `data/las-canon.csv` and `lib/canon-schema.ts`. Once Airtable sync is live, switch to reading `data/las-canon.airtable.json`.

### Pre-Integration Coordination
- [ ] Confirm site's data-serving layer is ready to read JSON (not CSV or direct Airtable API)
- [ ] Verify `data/las-canon.airtable.json` format matches site's JSON parser expectations
- [ ] Determine sync schedule: will it run on every build, on a webhook, or on a CI schedule?

### Integration Steps (Coordinate with Site Team)
- [ ] Update `lib/` loaders to read from `data/las-canon.airtable.json` (with fallback to CSV during transition)
- [ ] Add `npm run sync:airtable` to build pipeline if needed (e.g., `npm run build` → fetches latest from Airtable first)
- [ ] OR: Schedule `npm run sync:airtable` externally (GitHub Actions, CI/CD) and commit output (NO—don't commit gitignored file)
- [ ] OR: Deploy a scheduled sync service that pulls Airtable → static file on a CDN

### CSV Deprecation Path
- **DO NOT DELETE** `data/las-canon.csv` yet. It's the canonical source until site code is fully switched over
- Once site reads only from JSON and no code references CSV, retire the CSV and remove it from the repo

---

## Part 6: Testing Checklist

### Intake Form → Review → Canon Promotion Workflow

1. **Form Submission**
   - [ ] Open the intake form (link from site's Contribute page)
   - [ ] Submit a test entry: url=`https://example.com/test`, submitted_by=`test@example.com`
   - [ ] Verify new row appears in Pending Queue with those fields populated
   - [ ] Verify all other fields are empty

2. **Auto-Tagging Automation**
   - [ ] Check Pending Queue; new row should have all six dimensions filled (if tagging service is live)
   - [ ] If tagging service not yet live, verify automation ran (check Automations history)
   - [ ] If automation failed, check error logs and coordinate with tagging service team

3. **Manual Review in Airtable**
   - [ ] Open Pending Queue view
   - [ ] Find the test row
   - [ ] Manually fill in title, creators, date, itemType (if not auto-filled), tags, summary
   - [ ] Verify dimensions are reasonable
   - [ ] Set status to "approved"

4. **Promotion to Canon**
   - [ ] Copy the approved row from Pending Queue into Canon table
   - [ ] Verify all fields migrated correctly
   - [ ] Run `npm run sync:airtable` (or wait for scheduled sync)
   - [ ] Verify the row appears in `data/las-canon.airtable.json`

5. **Site-Side Verification**
   - [ ] If site code is switched to read JSON, verify the new entry appears on the site
   - [ ] Search/filter by the test entry's dimensions on the site
   - [ ] Verify display is correct

### Schema Consistency

- [ ] Compare Pending Queue and Canon table choice lists against `lib/canon-schema.ts`
- [ ] If `lib/canon-schema.ts` is updated on the spec branch, update Airtable choice lists to match
- [ ] Document this as a manual sync step (no automation for schema changes yet)

---

## Part 7: Known Issues & Workarounds

### Mojibake in Summaries
- **Issue:** `data/las-canon.csv` has mojibake (`â€"` for em-dashes) in several summary fields
- **Status:** Copied verbatim into Airtable; not a migration concern, but a data-quality issue on the spec branch
- **Workaround:** Do not attempt to clean up in Airtable; let the spec team fix in CSV first, then re-sync

### Free-Plan API Quota
- **Limit:** 1,000 API calls/month
- **Current consumption:** 1 call per manual sync; ~12 calls/month if synced weekly
- **Constraint:** Site must NEVER call Airtable API on page load (reads JSON file instead)
- **Workaround:** Sync script pattern ensures all traffic is batch (one call) rather than per-request

### Promotion from Pending Queue → Canon
- **Status:** No automation yet; manual copy-and-paste via Airtable UI
- **Future:** Create a second Automation to auto-promote approved rows (scope for Phase 2)

### Schema Change Propagation
- **Issue:** If `lib/canon-schema.ts` is updated on the spec branch (dimension choices, new fields), Airtable choice lists need manual updates
- **Workaround:** Monitor the spec branch for changes; update Airtable UI when spec stabilizes
- **Future:** Build automated schema sync (scope for Phase 2)

---

## Part 8: Access & Credentials

### Environment Variables
```bash
# .env.example (already in repo)
AIRTABLE_API_KEY=[your personal token from https://airtable.com/account/tokens/pat]
AIRTABLE_BASE_ID=apps8rBIORsmE7ij8
AIRTABLE_CANON_TABLE_ID=Canon
```

### Airtable Workspace & Permissions
- **Workspace:** "My First Workspace" in the connected Airtable account
- **Permissions:** If implementing intake form or automation, ensure the Airtable account has:
  - Base editing (to create/modify form and automation)
  - Webhook access (to call external tagging service)
  - API access (to run `npm run sync:airtable`)

### API Tokens
- Personal token for syncing: generate at https://airtable.com/account/tokens/pat
- Tagging service API key: coordinate with Task F implementation team
- Webhook authentication: plan bearer token or API key for tagging service calls

---

## Part 9: Communication & Coordination

### Points of Contact
- **Spec branch updates:** Monitor for changes to `lib/canon-schema.ts` and `docs/las-canon-addendum.md`; propose Airtable schema sync when spec stabilizes
- **Task F implementation:** Coordinate on tagging service endpoint, request/response format, and webhook authentication
- **Site-side integration:** Clarify data-serving layer, sync schedule, and JSON format expectations

### Handoff Expectations
- Once this spec is complete and intake form + automation are live, the workflow is:
  1. Users submit via form → rows created in Pending Queue
  2. Automation auto-tags using external service
  3. Reviewers manually verify and promote approved rows to Canon
  4. Sync script pulls Canon → JSON file
  5. Site reads JSON (once switched over)

### Rollback Plan
- If Airtable integration breaks, revert site code to read `data/las-canon.csv`
- Do NOT delete CSV until site is 100% stable on JSON reading
- Keep sync script in repo even if not scheduled; it's a manual fallback

---

## Appendix: File References

| File | Purpose | Status |
|-----|---------|--------|
| `lib/canon-schema.ts` | TypeScript schema source of truth | Spec branch; monitor for updates |
| `data/las-canon.csv` | Current authoritative data source | In repo; do not delete yet |
| `data/las-canon.airtable.json` | Synced Canon table (gitignored) | Generated by sync script |
| `scripts/sync-airtable.mjs` | Airtable → JSON pull script | Committed; use as-is |
| `docs/airtable-migration.md` | Overview & rationale | Committed; read first |
| `.env.example` | Config template | Committed; copy to `.env.local` and fill in API key |
| `package.json` | Sync script npm task | Committed; `npm run sync:airtable` ready |

---

## Summary: What You Need to Do

1. **Airtable UI Work**
   - [x] Create intake form on Pending Queue (expose only url + submitted_by) — done, live
   - [x] Create promotion Automation (approved → Canon) — done, untested end-to-end
   - [ ] Repurpose the record-creation Automation to stamp `status = "pending"` (Part 3a) — replaces the dead webhook attempt
   - [ ] Add a `status = "pending"` filtered Grid view for reviewers (Part 3b)
   - [ ] Manually tag the existing test row (or delete it) and push it through the full pipeline once to confirm the promotion Automation actually fires
   - [ ] Fix or delete the test row with `url: "test"` — not a real URL, would pollute Canon if approved as-is

2. **Coordination**
   - [ ] Confirm site-side JSON reading plan with site team
   - [ ] Decide whether to revisit the auto-tagging webhook later (needs an outbound-call-capable integration — Airtable's own Automations can't do it) or commit to manual tagging long-term

3. **Monitoring**
   - [ ] Watch spec branch for `lib/canon-schema.ts` changes; update Airtable choice lists
   - [ ] Track Airtable free-plan API quota usage (current: ~1 call/day via the scheduled GitHub Actions sync, well under 1,000/month limit)

4. **Handoff**
   - Pipeline is live end-to-end except for the pending → status stamp (Part 3a). Once that's in place: users submit → land as "pending" → reviewer manually tags and approves → auto-promoted to Canon → daily sync picks it up.

---

**Last updated:** 2026-07-23  
**Next review:** After Part 3a is applied and one submission has been run through the full pipeline
