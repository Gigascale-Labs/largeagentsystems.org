import { readFileSync } from "fs";
import { join } from "path";
import type { CanonEntry } from "./canon-schema";

const MULTI_VALUE_COLUMNS = [
  "system_type",
  "participant_mix",
  "observability",
  "focus_area",
  "threat_model",
  "claim_type",
  "institutions",
] as const;

/** Minimal RFC 4180 CSV parser: quoted fields, embedded commas/newlines, "" escapes. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function splitMultiValue(value: string): string[] {
  return value
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Reads and parses `data/las-canon.csv` into structured entries. Server-only (uses `fs`). */
export function getCanonEntries(): CanonEntry[] {
  const csvPath = join(process.cwd(), "data", "las-canon.csv");
  const text = readFileSync(csvPath, "utf8");
  const rows = parseCSV(text);
  const header = rows[0];

  return rows.slice(1).map((row) => {
    const raw: Record<string, string> = {};
    header.forEach((col, i) => {
      raw[col] = row[i] ?? "";
    });

    const entry: Record<string, unknown> = { ...raw };
    for (const col of MULTI_VALUE_COLUMNS) {
      entry[col] = raw[col] ? splitMultiValue(raw[col]) : undefined;
    }

    return entry as unknown as CanonEntry;
  });
}
