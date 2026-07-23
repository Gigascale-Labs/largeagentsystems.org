import type { PendingSubmission } from "./canon-schema";

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PENDING_QUEUE_TABLE_ID =
  process.env.AIRTABLE_PENDING_QUEUE_TABLE_ID || "Pending Queue";

/**
 * Writes a submission into Airtable's Pending Queue table (Task F's intake
 * step) via the REST API. Only called from the submitSource server action —
 * once per form submission, never on a page load — so it stays well within
 * the free-plan 1,000 calls/month quota (see docs/airtable-spec-for-ai.md).
 */
export async function addPendingSubmission(
  submission: PendingSubmission,
): Promise<void> {
  if (!API_KEY || !BASE_ID) {
    throw new Error(
      "Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID. See .env.example.",
    );
  }

  const fields: Record<string, string> = {
    title: submission.title,
    itemType: submission.itemType,
    creators: submission.creators,
    date: submission.date,
    url: submission.url,
    summary: submission.summary,
    tag_confidence: submission.tag_confidence,
    submitted_by: submission.submitted_by,
    status: submission.status,
  };
  if (submission.tags) fields.tags = submission.tags;
  if (submission.submitter_note) fields.submitter_note = submission.submitter_note;

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PENDING_QUEUE_TABLE_ID)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    throw new Error(`Airtable API error ${res.status}: ${await res.text()}`);
  }
}
