import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { PendingSubmission } from "./canon-schema";

const STORE_PATH = join(process.cwd(), "data", "pending-submissions.json");

/**
 * File-backed pending-submission queue (Task F's intake step). Works on a
 * normal persistent Node server (`next start` on a long-lived container/VM).
 * On a read-only or ephemeral filesystem — most serverless/edge hosts —
 * writes here won't survive past the request, so this needs swapping for a
 * real datastore before deploying to one of those; that's an infrastructure
 * decision this repo hasn't made yet.
 */
export function getPendingSubmissions(): PendingSubmission[] {
  if (!existsSync(STORE_PATH)) return [];
  return JSON.parse(readFileSync(STORE_PATH, "utf8"));
}

export function addPendingSubmission(submission: PendingSubmission): void {
  const all = getPendingSubmissions();
  all.push(submission);
  writeFileSync(STORE_PATH, JSON.stringify(all, null, 2));
}
