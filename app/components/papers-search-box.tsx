"use client";

import { SEARCH_FIELDS } from "@/lib/papers-search";
import { SearchBox } from "./search-box";

/**
 * The /papers search box: `SearchBox` with the paper fields and examples.
 * This component talks to no server. `lib/papers-search.ts` matches the query
 * in the browser.
 */

const EXAMPLES: ReadonlyArray<{ query: string; means: string }> = [
  { query: "market design", means: "both words, anywhere in a paper" },
  { query: '"market design"', means: "that phrase, in any case" },
  { query: "swarm OR stigmergy", means: "either word" },
  { query: "agent NOT market", means: "the first without the second" },
  { query: "title:alignment", means: "one field only" },
  { query: "(a OR b) AND c", means: "brackets group" },
];

export function PapersSearchBox({
  query,
  onQueryChange,
  status,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  /** The line under the box: what matched, or why nothing did. */
  status: string;
}) {
  return (
    <SearchBox
      id="paper-search"
      query={query}
      onQueryChange={onQueryChange}
      status={status}
      placeholder={'e.g. "large agent systems" AND title:market'}
      examples={EXAMPLES}
      fields={SEARCH_FIELDS}
    />
  );
}
