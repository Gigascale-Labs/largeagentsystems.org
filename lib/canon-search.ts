/**
 * Matches a query against a canon list on /survey: the canon itself, or the
 * transfer corpus below it. Each list has its own search box and its own
 * records; the two never search each other.
 *
 * The query language is `lib/search-query.ts`, the same one /papers uses.
 *
 * The three observability dimensions are not searchable fields. Their values
 * are long definitions ("partially observable - agents and interactions
 * only"), and the cross-table already filters on them.
 */

import type { CanonEntry } from "./canon-schema.ts";
import { runQuery } from "./search-query.ts";

/**
 * One canon entry as the search matches it, with fields named for what a
 * person types.
 *
 * There is no id and no url. An unqualified term matches every field, and
 * every url contains its host, so a search for "arxiv" would match every
 * arXiv paper by its address rather than its content. Matches are mapped
 * back to entries by position instead: see `searchCanon`.
 */
export interface CanonSearchRecord {
  title: string;
  creator: string[];
  summary: string;
  tag: string[];
  institution: string[];
  date: string;
  system: string[];
  mix: string[];
  focus: string[];
  threat: string[];
  claim: string[];
}

/** The fields a `field:value` clause can name. The page prints this as help. */
export const CANON_SEARCH_FIELDS: ReadonlyArray<{ name: string; holds: string }> =
  [
    { name: "title", holds: "the paper's title" },
    { name: "creator", holds: "any author's name" },
    { name: "summary", holds: "the summary" },
    { name: "tag", holds: "any of its tags" },
    { name: "institution", holds: "any author's institution" },
    { name: "date", holds: "the publication date" },
    { name: "system", holds: "its system type" },
    { name: "mix", holds: "its participant mix" },
    { name: "focus", holds: "its focus area" },
    { name: "threat", holds: "its threat models" },
    { name: "claim", holds: "its claim type" },
  ];

/** Splits a semicolon-separated cell ("A; B") into its values. */
function splitCell(value: string | undefined): string[] {
  return (value ?? "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** One record per entry, in the same order as `entries`. */
export function toCanonSearchRecords(entries: CanonEntry[]): CanonSearchRecord[] {
  return entries.map((entry) => ({
    title: entry.title ?? "",
    creator: splitCell(entry.creators),
    summary: entry.summary ?? "",
    tag: splitCell(entry.tags),
    institution: entry.institutions ?? [],
    date: entry.date ?? "",
    system: entry.system_type ?? [],
    mix: entry.participant_mix ?? [],
    focus: entry.focus_area ?? [],
    threat: entry.threat_model ?? [],
    claim: entry.claim_type ?? [],
  }));
}

export type CanonSearchOutcome =
  /** No query. The list shows every entry. */
  | { status: "all" }
  /** The query parsed. `indexes` holds the positions, in the list the records
   * were built from, of the entries it matched. */
  | { status: "matched"; indexes: Set<number> }
  /** The query did not parse. The page prints `message` under the box. */
  | { status: "error"; message: string };

/** Runs `query` over one list's records. Does not throw. */
export function searchCanon(
  query: string,
  records: CanonSearchRecord[],
): CanonSearchOutcome {
  const outcome = runQuery(query, records);
  if (outcome.status !== "matched") return outcome;
  // liqe returns the objects it was given, so each match finds its position.
  const position = new Map(records.map((record, i) => [record, i] as const));
  return {
    status: "matched",
    indexes: new Set(outcome.rows.map((row) => position.get(row) ?? -1)),
  };
}
