/**
 * Schema for the LAS paper canon (`data/las-canon.csv`) and the
 * contribute-a-source intake pipeline.
 *
 * All six dimension columns are tagged for the 45 corpus entries, per
 * `las-canon-and-open-problems-spec.md` (Task A) and
 * `las-canon-dimension-tagging-spec.md`. `claim_type` uses the 9-value
 * paper-type taxonomy from the canon addendum rather than that spec's
 * 4-value diagnosis/mechanism/evidence/policy scheme — see
 * docs/las-canon-addendum.md for why the two conflicting definitions
 * exist and which one this repo treats as authoritative.
 */

export const SYSTEM_TYPES = [
  "production economy",
  "social network",
  "labour market",
  "financial system",
] as const;

export const PARTICIPANT_MIXES = ["pure-AI", "mixed human+AI"] as const;

export const OBSERVABILITY_LEVELS = [
  "aggregates observable",
  "interactions observable",
  "agents observable",
] as const;

export const FOCUS_AREAS = [
  "Monitoring",
  "Steering",
  "Simulation",
  "Redesign",
] as const;

export const THREAT_MODELS = [
  "Gradual Disempowerment",
  "Systemic Instability",
  "Inequality",
  "Collective Superintelligence",
  "Partially Observable Systems",
  "Power Concentration",
  "Outdated Models",
] as const;

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

export type SystemType = (typeof SYSTEM_TYPES)[number];
export type ParticipantMix = (typeof PARTICIPANT_MIXES)[number];
export type ObservabilityLevel = (typeof OBSERVABILITY_LEVELS)[number];
export type FocusArea = (typeof FOCUS_AREAS)[number];
export type ThreatModel = (typeof THREAT_MODELS)[number];
export type ClaimType = (typeof CLAIM_TYPES)[number];

/** Multi-value dimension columns store semicolon-separated values on disk. */
export type MultiValue<T extends string> = T[];

export interface CanonDimensions {
  system_type?: MultiValue<SystemType>;
  participant_mix?: MultiValue<ParticipantMix>;
  observability?: MultiValue<ObservabilityLevel>;
  focus_area?: MultiValue<FocusArea>;
  threat_model?: MultiValue<ThreatModel>;
  claim_type?: MultiValue<ClaimType>;
}

export type TagConfidence = "full-text" | "summary-only";

export interface CanonEntry extends CanonDimensions {
  title: string;
  itemType: string;
  creators: string;
  date: string;
  url: string;
  tags: string;
  summary: string;
  /** Whether tagging was grounded in the fetched paper (`full-text`) or
   * the corpus's existing `summary` field alone (`summary-only`). All 45
   * corpus entries are currently `summary-only`. */
  tag_confidence: TagConfidence;
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
