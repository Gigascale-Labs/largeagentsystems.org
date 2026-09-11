/**
 * Matches a query against the reading list on /papers.
 *
 * The query language, its length cap and its input cleaning live in
 * `lib/search-query.ts`, shared with the canon search on /survey. This file
 * holds only what is particular to papers: the record shape, the field names a
 * person can type, and the arXiv id each match is reported by.
 */

import type { PaperDay } from "./papers-schema";
import { runQuery } from "./search-query.ts";

export { MAX_QUERY_CHARS } from "./search-query.ts";

/**
 * One paper as the search matches it. Seven fields, named for what a person
 * types, not for the shape of `Paper`.
 *
 * `url` is absent. Every paper's URL contains "arxiv.org", so an unqualified
 * search for that string would match all 52 papers on file.
 */
export interface PaperSearchRecord {
  id: string;
  date: string;
  title: string;
  author: string[];
  summary: string;
  question: string[];
  anchor: string;
}

/** The fields a `field:value` clause can name. The page prints this as help. */
export const SEARCH_FIELDS: ReadonlyArray<{ name: string; holds: string }> = [
  { name: "title", holds: "the paper's title" },
  { name: "author", holds: "any author's name" },
  { name: "summary", holds: "the one-sentence summary" },
  { name: "question", holds: "any of its open questions" },
  { name: "anchor", holds: "the nearest canon paper's title" },
  { name: "id", holds: "the arXiv id" },
  { name: "date", holds: "the day it was kept, YYYY-MM-DD" },
];

/** Flattens every paper on the page into the records the search matches. */
export function toSearchRecords(days: PaperDay[]): PaperSearchRecord[] {
  return days.flatMap((day) =>
    day.papers.map((paper) => ({
      id: paper.arxiv_id,
      date: day.date,
      title: paper.title,
      author: paper.authors,
      summary: paper.one_sentence,
      question: paper.open_questions,
      anchor: paper.nearest_anchor_title,
    })),
  );
}

export type SearchOutcome =
  /** No query. The page shows every paper. */
  | { status: "all" }
  /** The query parsed. `ids` holds the arXiv ids it matched. */
  | { status: "matched"; ids: Set<string> }
  /** The query did not parse. The page prints `message` under the box. */
  | { status: "error"; message: string };

/**
 * Runs `query` over `records`. Does not throw.
 *
 * A query the grammar rejects returns `status: "error"`. A half-typed query is
 * the normal state of a search box while someone types into it.
 */
export function searchPapers(
  query: string,
  records: PaperSearchRecord[],
): SearchOutcome {
  const outcome = runQuery(query, records);
  if (outcome.status !== "matched") return outcome;
  return { status: "matched", ids: new Set(outcome.rows.map((row) => row.id)) };
}
