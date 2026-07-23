/**
 * Best-effort metadata lookup for a contribute-a-source submission. Never
 * throws — a failed or partial fetch just means a reviewer fills in more
 * by hand, per Task F's don't-force-fit rule.
 */

export interface FetchedMetadata {
  title: string;
  creators: string;
  date: string;
  summary: string;
}

const EMPTY: FetchedMetadata = { title: "", creators: "", date: "", summary: "" };

// Blocks the obvious literal-IP/hostname SSRF targets. Not a defense
// against DNS rebinding — this endpoint only ever extracts a title/summary
// from the response, and every submission sits in a human-reviewed queue
// before anything is public, which bounds the blast radius of a miss here.
const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^\[?::1\]?$/,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
];

function isFetchableUrl(raw: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (BLOCKED_HOSTNAME_PATTERNS.some((p) => p.test(parsed.hostname))) return null;
  return parsed;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "largeagentsystems.org-contribute-bot" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function cleanText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMetaContent(html: string, key: string): string | undefined {
  const tag = html.match(
    new RegExp(`<meta\\s+[^>]*(?:property|name)=["']${key}["'][^>]*>`, "i"),
  )?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1];
}

async function fetchArxivMetadata(arxivId: string): Promise<FetchedMetadata> {
  const res = await fetchWithTimeout(
    `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}`,
    8000,
  );
  const xml = await res.text();

  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1] ?? "";
  const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1];
  const published = entry.match(/<published>(\d{4})/)?.[1];
  const authors = [...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map(
    (m) => cleanText(m[1]),
  );

  return {
    title: title ? cleanText(title) : "",
    creators: authors.join("; "),
    date: published ?? "",
    summary: summary ? cleanText(summary) : "",
  };
}

async function fetchGenericMetadata(url: string): Promise<FetchedMetadata> {
  const res = await fetchWithTimeout(url, 8000);
  const html = (await res.text()).slice(0, 200_000);

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const ogTitle = extractMetaContent(html, "og:title");
  const ogDescription =
    extractMetaContent(html, "og:description") ?? extractMetaContent(html, "description");

  return {
    title: cleanText(ogTitle ?? titleTag ?? ""),
    creators: "",
    date: "",
    summary: cleanText(ogDescription ?? ""),
  };
}

export async function fetchSourceMetadata(rawUrl: string): Promise<FetchedMetadata> {
  const url = isFetchableUrl(rawUrl);
  if (!url) return EMPTY;

  try {
    const arxivId = url.hostname.includes("arxiv.org")
      ? url.pathname.match(/\/abs\/([0-9]{4}\.[0-9]{4,5}(v\d+)?)/)?.[1]
      : undefined;

    return arxivId ? await fetchArxivMetadata(arxivId) : await fetchGenericMetadata(url.toString());
  } catch {
    return EMPTY;
  }
}
