import { SefariaV3TextResponse, LexiconEntry, LexiconSense } from "../types";

const BASE_URL = "https://www.sefaria.org";

export async function getTexts(tref: string): Promise<SefariaV3TextResponse> {
  const encoded = encodeURIComponent(tref);
  const res = await fetch(`${BASE_URL}/api/v3/texts/${encoded}`);
  if (!res.ok) {
    throw new Error(`Sefaria API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SefariaV3TextResponse>;
}

interface SefariaRawWordEntry {
  headword: string;
  parent_lexicon: string;
  transliteration?: string;
  pronunciation?: string;
  content?: { morphology?: string; senses?: LexiconSense[] };
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
  const raw = await res.json() as SefariaRawWordEntry[];
  return raw.map((entry) => ({
    headword: entry.headword,
    parent_lexicon: entry.parent_lexicon,
    transliteration: entry.transliteration,
    pronunciation: entry.pronunciation,
    morphology: entry.content?.morphology,
    senses: entry.content?.senses ?? [],
  }));
}
