import { z } from "zod";
import { SefariaV3TextResponse, LexiconEntry, LexiconSense, VerseTexts } from "../types/SefariaTypes";
import { rawWordEntryToLexiconEntry } from "./sefariaMapper";
import { stripHtml } from "../utils/stripHtml";

const BASE_URL = "https://www.sefaria.org";

export type { VerseTexts } from "../types/SefariaTypes";

// ---------------------------------------------------------------------------
// Zod schemas — runtime validation of Sefaria API responses
// ---------------------------------------------------------------------------

const SefariaV3TextVersionSchema = z.object({
  language: z.string(),
  versionTitle: z.string(),
  text: z.union([z.string(), z.array(z.string())]),
});

const SefariaV3TextResponseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  versions: z.array(SefariaV3TextVersionSchema),
});

const LexiconSenseSchema: z.ZodType<LexiconSense> = z.lazy(() =>
  z.object({
    definition: z.string().optional(),
    num: z.string().optional(),
    senses: z.array(LexiconSenseSchema).optional(),
  })
);

const SefariaRawWordEntrySchema = z.object({
  headword: z.string(),
  parent_lexicon: z.string(),
  transliteration: z.string().optional(),
  pronunciation: z.string().optional(),
  content: z
    .object({
      morphology: z.string().optional(),
      senses: z.array(LexiconSenseSchema).optional(),
    })
    .optional(),
});

const SefariaRawWordEntriesSchema = z.array(SefariaRawWordEntrySchema);

function buildApiRef(verseNumbering: string): string {
  if (!verseNumbering.includes(":")) {
    return verseNumbering.trim();
  }
  const [left, right] = verseNumbering.split(":");
  const bookChapter = left.trim();
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
  const startVerse = parseInt(versePart.split("-")[0], 10) || 1;

  const encoded = encodeURIComponent(ref);
  const res = await fetch(
    `${BASE_URL}/api/v3/texts/${encoded}?version=english&version=hebrew&return_format=text_only`
  );
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  const data = SefariaV3TextResponseSchema.parse(await res.json());

  const enVersion = data.versions.find((v) => v.language === "en");
  const heVersion = data.versions.find((v) => v.language === "he");
  const enText = enVersion?.text;
  const heText = heVersion?.text;
  const enTexts = Array.isArray(enText) ? enText : enText ? [enText] : [];
  const heTexts = Array.isArray(heText) ? heText : heText ? [heText] : [];

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
  return SefariaV3TextResponseSchema.parse(await res.json());
}

export async function fetchHebrewWordDefinition(word: string): Promise<LexiconEntry[]> {
  if (!word) {
    throw new Error("word must be non-empty");
  }
  const encoded = encodeURIComponent(word);
  const res = await fetch(`${BASE_URL}/api/words/${encoded}`);
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  const raw = SefariaRawWordEntriesSchema.parse(await res.json());
  return raw.map(rawWordEntryToLexiconEntry);
}
