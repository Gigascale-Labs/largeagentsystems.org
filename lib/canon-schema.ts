/**
 * Schema for the LAS paper canon (`data/las-canon.csv`) and the
 * contribute-a-source intake pipeline (addendum Task F).
 *
 * The canon currently carries only `claim_type` as a tagged dimension.
 * `system_type`, `participant_mix`, `observability`, `focus_area`, and
 * `threat_model` are part of the base spec's Task A schema but have not
 * been tagged against the corpus yet, so they're modelled as optional
 * here rather than invented.
 */

export const CLAIM_TYPES = [
  "theoretical/conceptual framework",
  "empirical study",
  "survey/taxonomy",
  "proposed method/system",
  "position/opinion",
  "threat model articulation",
  "policy/regulatory analysis",
  "dataset/tool",
  "live deployment",
] as const;

export type ClaimType = (typeof CLAIM_TYPES)[number];

/** Multi-value dimension columns store semicolon-separated values on disk. */
export type MultiValue<T extends string> = T[];

export interface CanonDimensions {
  /** Not yet tagged against the corpus — see module doc. */
  system_type?: MultiValue<string>;
  participant_mix?: MultiValue<string>;
  observability?: MultiValue<string>;
  focus_area?: MultiValue<string>;
  threat_model?: MultiValue<string>;
  /** Tagged for all 45 corpus entries as of the addendum. */
  claim_type?: MultiValue<ClaimType>;
}

export interface CanonEntry extends CanonDimensions {
  title: string;
  itemType: string;
  creators: string;
  date: string;
  url: string;
  tags: string;
  summary: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

/**
 * A source submitted through the contribute-a-source intake pipeline.
 * Never merged directly into the canon — see docs/las-canon-addendum.md,
 * Task F, for the intake -> tag -> queue -> review -> merge flow.
 */
export interface PendingSubmission extends CanonEntry {
  submitted_by: string;
  status: SubmissionStatus;
  /** Required when status is "rejected", so the same bad submission
   * isn't reconsidered from scratch. */
  rejection_reason?: string;
}
