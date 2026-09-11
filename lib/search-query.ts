/**
 * The query engine behind every search box on the site. Supports quoted
 * phrases, AND / OR / NOT, brackets, `field:value`, and wildcards.
 *
 * `liqe` parses and matches. It is a grammar, so a query it cannot parse
 * raises; `runQuery` catches that and returns a message instead.
 *
 * The query does not leave the browser. Each page holds every row it lists,
 * so this filters what is already on screen. There is no endpoint, and this
 * site's server never sees a query.
 *
 * Three steps run before liqe matches anything:
 *
 * | Step | What it does |
 * |---|---|
 * | Cap | Truncates the query at `MAX_QUERY_CHARS` |
 * | Clean | Runs `sanitizeText`, which strips invisible and control characters |
 * | Rewrite | Turns each quoted phrase into a case-insensitive regex |
 *
 * The third step corrects a liqe behaviour. Measured: liqe compiles an
 * unquoted term to `/term/ui` and a quoted one to `/term/u`, so
 * `"large agent systems"` matched 0 of 52 papers while `"Large Agent Systems"`
 * matched 1. See `caseInsensitivePhrases`.
 *
 * Used by `lib/papers-search.ts` (/papers) and `lib/canon-search.ts` (/survey).
 */

import { filter, parse } from "liqe";
import { sanitizeText } from "./sanitize.ts";

/**
 * Query length cap. 200 characters holds a query of several clauses.
 *
 * The language includes regular expressions, so an unbounded query can cost
 * unbounded time. That time falls on the browser of whoever typed it, because
 * the match runs client-side. I did not measure the worst-case cost of a
 * pathological regex under this cap; timing `/(a+)+$/` over 480 papers would
 * settle whether 200 is low enough.
 */
export const MAX_QUERY_CHARS = 200;

/**
 * Escapes a phrase for use inside a regular expression body.
 *
 * The set includes `/` as well as the usual metacharacters. liqe reads a regex
 * out of a `/body/flags` string, so an unescaped slash inside a phrase ends the
 * body early and changes what matches.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

type AstNode = Record<string, unknown>;

/**
 * Rewrites every quoted phrase in the parse tree as a case-insensitive regular
 * expression.
 *
 * liqe compiles an unquoted term to `/term/ui` and a quoted one to `/term/u`.
 * Quoting a phrase therefore makes it case-sensitive, which is not what a
 * person quoting a phrase asks for.
 *
 * The rewrite escapes the phrase and adds the `ui` flags. It leaves wildcard
 * handling alone: liqe expands `*` and `?` only in unquoted terms, and a `?`
 * inside a phrase must stay a literal. `tests/papers-search.test.mts` covers
 * both, with `"What is the limit?"` matching 1 of 3 test papers.
 */
function caseInsensitivePhrases(node: unknown): void {
  if (!node || typeof node !== "object") return;
  const current = node as AstNode;

  const expression = current.expression as AstNode | undefined;
  if (
    current.type === "Tag" &&
    expression?.type === "LiteralExpression" &&
    expression.quoted === true &&
    typeof expression.value === "string"
  ) {
    current.expression = {
      type: "RegexExpression",
      location: expression.location,
      value: `/${escapeRegex(expression.value)}/ui`,
    };
    return;
  }

  for (const key of ["left", "right", "operand", "expression"]) {
    caseInsensitivePhrases(current[key]);
  }
}

export type QueryOutcome<T> =
  /** No query. The page shows every row. */
  | { status: "all" }
  /** The query parsed. `rows` holds the records it matched, as the same
   * objects that were passed in, so a caller can map them back by identity. */
  | { status: "matched"; rows: readonly T[] }
  /** The query did not parse. The page prints `message` under the box. */
  | { status: "error"; message: string };

/**
 * Runs `query` over `records`. Does not throw.
 *
 * A query the grammar rejects returns `status: "error"`. A half-typed query is
 * the normal state of a search box while someone types into it.
 */
export function runQuery<T extends object>(
  query: string,
  records: T[],
): QueryOutcome<T> {
  const cleaned = sanitizeText(query.slice(0, MAX_QUERY_CHARS), MAX_QUERY_CHARS);
  if (!cleaned) return { status: "all" };

  try {
    const ast = parse(cleaned);
    caseInsensitivePhrases(ast);
    return { status: "matched", rows: filter(ast, records) };
  } catch {
    // liqe's message names a column in a string the reader cannot see
    // ("Syntax error at line 1 column 8"), so this replaces it.
    return {
      status: "error",
      message:
        "That query did not parse. Check the quotes and brackets are closed.",
    };
  }
}
