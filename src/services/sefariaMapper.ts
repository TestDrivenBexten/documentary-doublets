import { Verse } from "../types/Doublet";
import { LexiconEntry, VerseTexts, SefariaRawWordEntry } from "../types/SefariaTypes";

/**
 * Converts the verse-keyed map returned by fetchVerseTexts into the
 * project's native Verse array, assigning the given chapter number.
 */
export function verseTextsToVerses(
  map: Map<number, VerseTexts>,
  chapter: number
): Verse[] {
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([verseNumber, { text, heText }]) => ({
      chapter,
      verse: verseNumber,
      englishText: text,
      hebrewText: heText || undefined,
    }));
}

/**
 * Maps a raw Sefaria word API entry to the project's native LexiconEntry type.
 */
export function rawWordEntryToLexiconEntry(entry: SefariaRawWordEntry): LexiconEntry {
  return {
    headword: entry.headword,
    parent_lexicon: entry.parent_lexicon,
    transliteration: entry.transliteration,
    pronunciation: entry.pronunciation,
    morphology: entry.content?.morphology,
    senses: entry.content?.senses ?? [],
  };
}
