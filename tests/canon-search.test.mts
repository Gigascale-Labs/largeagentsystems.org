/**
 * Tests for the /survey canon search.
 *
 * Run with `npm test`. No network, no files: the search runs in the browser
 * over the entries the page already holds, so these are pure function calls.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  searchCanon,
  toCanonSearchRecords,
} from "../lib/canon-search.ts";
import type { CanonEntry } from "../lib/canon-schema.ts";

function entry(over: Partial<CanonEntry>): CanonEntry {
  return {
    title: "",
    itemType: "journalArticle",
    creators: "",
    date: "",
    url: "",
    tags: "",
    summary: "",
    tag_confidence: "summary-only",
    ...over,
  };
}

const entries: CanonEntry[] = [
  entry({
    title: "Virtual Agent Economies",
    creators: "Nenad Tomasev; Joel Z. Leibo",
    date: "2025",
    url: "https://arxiv.org/abs/2509.10147",
    tags: "Agentic Economies; Foundations & Taxonomies",
    summary: "Markets of AI agents trading with each other.",
    institutions: ["Google DeepMind"],
    focus_area: ["Simulation"],
  }),
  entry({
    title: "Collective intelligence in human crowds",
    creators: "Francis Galton",
    date: "1907",
    url: "https://www.nature.com/articles/075450a0",
    tags: "Collective Intelligence",
    summary: "The median guess of a crowd lands near the true weight.",
  }),
  // Same title as the first on purpose: matches map back by position, not by
  // any field, so a duplicate title must not merge two entries.
  entry({
    title: "Virtual Agent Economies",
    creators: "Someone Else",
    url: "https://example.org/copy",
    summary: "A second entry with a repeated title.",
  }),
];

const records = toCanonSearchRecords(entries);

function matched(query: string): number[] {
  const outcome = searchCanon(query, records);
  assert.equal(outcome.status, "matched", `"${query}" should parse`);
  return outcome.status === "matched" ? [...outcome.indexes].sort() : [];
}

describe("toCanonSearchRecords", () => {
  it("splits creators and tags on semicolons", () => {
    assert.deepEqual(records[0].creator, ["Nenad Tomasev", "Joel Z. Leibo"]);
    assert.deepEqual(records[0].tag, ["Agentic Economies", "Foundations & Taxonomies"]);
  });

  it("gives an entry with no dimensions empty lists, not undefined", () => {
    assert.deepEqual(records[1].institution, []);
    assert.deepEqual(records[1].focus, []);
  });

  it("keeps one record per entry, in order", () => {
    assert.equal(records.length, entries.length);
  });
});

describe("searchCanon", () => {
  it("returns all for an empty or blank query", () => {
    assert.equal(searchCanon("", records).status, "all");
    assert.equal(searchCanon("   ", records).status, "all");
  });

  it("matches a bare term in any field", () => {
    assert.deepEqual(matched("crowd"), [1]);            // summary
    assert.deepEqual(matched("deepmind"), [0]);         // institution
  });

  it("matches a field clause only in that field", () => {
    assert.deepEqual(matched("creator:leibo"), [0]);
    assert.deepEqual(matched("focus:simulation"), [0]);
    assert.deepEqual(matched("tag:collective"), [1]);
    assert.deepEqual(matched("title:crowd"), [1]);
    assert.deepEqual(matched("title:markets"), []);     // "markets" is in a summary
  });

  it("matches a quoted phrase in any case", () => {
    assert.deepEqual(matched('"collective INTELLIGENCE"'), [1]);
  });

  it("does not match a url's host", () => {
    assert.deepEqual(matched("arxiv"), []);
  });

  it("maps a repeated title back to both entries, separately", () => {
    assert.deepEqual(matched('title:"virtual agent economies"'), [0, 2]);
  });

  it("supports OR, NOT and brackets", () => {
    assert.deepEqual(matched("galton OR leibo"), [0, 1]);
    assert.deepEqual(matched("economies NOT leibo"), [2]);
    assert.deepEqual(matched("(galton OR leibo) AND tag:agentic"), [0]);
  });

  it("reports a query that does not parse instead of throwing", () => {
    const outcome = searchCanon('"unclosed', records);
    assert.equal(outcome.status, "error");
  });
});
