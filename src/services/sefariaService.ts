import { SefariaV3TextResponse, LexiconEntry, LexiconSense, SefariaRawWordEntry, VerseTexts } from "../types/SefariaTypes";
import { rawWordEntryToLexiconEntry } from "./sefariaMapper";

const BASE_URL = "https://www.sefaria.org";

export type { VerseTexts } from "../types/SefariaTypes";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function buildApiRef(verseNumbering: string): string {
  const [left, right] = verseNumbering.split(":");
  const bookChapter = left.trim().replace(" ", ".");
  const nums = right.split(",").flatMap((seg) =>
    seg.split("-").map((n) => parseInt(n.trim(), 10))
  );
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const verseRange = min === max ? `${min}` : `${min}-${max}`;
  return `${bookChapter}.${verseRange}`;
}

export async function fetchVerseTexts(
  verseNumbering: string
): Promise<Map<number, VerseTexts>> {
  const ref = buildApiRef(verseNumbering);
  // Derive start verse from the built ref (e.g. "Genesis.16.1-14" → 1)
  const versePart = ref.split(".").at(-1) ?? "1";
  const startVerse = parseInt(versePart.split("-")[0], 10);

  const encoded = encodeURIComponent(ref);
  const res = await fetch(
    `${BASE_URL}/api/v3/texts/${encoded}?version=english&version=hebrew&return_format=text_only`
  );
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as SefariaV3TextResponse;

  const enVersion = data.versions.find((v) => v.language === "en");
  const heVersion = data.versions.find((v) => v.language === "he");
  const enTexts = Array.isArray(enVersion?.text) ? (enVersion.text as string[]) : [];
  const heTexts = Array.isArray(heVersion?.text) ? (heVersion.text as string[]) : [];

  const map = new Map<number, VerseTexts>();
  enTexts.forEach((t, i) => {
    map.set(startVerse + i, {
      text: stripHtml(t),
      heText: stripHtml(heTexts[i] ?? ""),
    });
  });
  return map;
}

export async function getTexts(tref: string): Promise<SefariaV3TextResponse> {
  const encoded = encodeURIComponent(tref);
  const res = await fetch(`${BASE_URL}/api/v3/texts/${encoded}?return_format=text_only`);
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SefariaV3TextResponse>;
}

export type { SefariaRawWordEntry } from "../types/SefariaTypes";

export async function fetchHebrewWordDefinition(word: string): Promise<LexiconEntry[]> {
  if (!word) {
    throw new Error("word must be non-empty");
  }
  const encoded = encodeURIComponent(word);
  const res = await fetch(`${BASE_URL}/api/words/${encoded}`);
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  const raw = (await res.json()) as SefariaRawWordEntry[];
  return raw.map(rawWordEntryToLexiconEntry);
}
