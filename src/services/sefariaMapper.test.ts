import { describe, it, expect } from "vitest";
import { verseTextsToVerses, rawWordEntryToLexiconEntry } from "./sefariaMapper";
import { VerseTexts, SefariaRawWordEntry } from "../types/SefariaTypes";

// ---------------------------------------------------------------------------
// verseTextsToVerses
// ---------------------------------------------------------------------------

describe("verseTextsToVerses", () => {
  it("maps verse numbers and text correctly", () => {
    // Arrange
    const map = new Map<number, VerseTexts>([
      [1, { text: "In the beginning", heText: "בְּרֵאשִׁית" }],
      [2, { text: "And the earth", heText: "וְהָאָרֶץ" }],
    ]);

    // Act
    const result = verseTextsToVerses(map, 1);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ chapter: 1, verse: 1, englishText: "In the beginning", hebrewText: "בְּרֵאשִׁית" });
    expect(result[1]).toEqual({ chapter: 1, verse: 2, englishText: "And the earth", hebrewText: "וְהָאָרֶץ" });
  });

  it("assigns the supplied chapter number to every verse", () => {
    // Arrange
    const map = new Map<number, VerseTexts>([[5, { text: "Some text", heText: "טֶקסט" }]]);

    // Act
    const result = verseTextsToVerses(map, 16);

    // Assert
    expect(result[0].chapter).toBe(16);
  });

  it("sorts verses by verse number regardless of insertion order", () => {
    // Arrange
    const map = new Map<number, VerseTexts>([
      [3, { text: "Third", heText: "" }],
      [1, { text: "First", heText: "" }],
      [2, { text: "Second", heText: "" }],
    ]);

    // Act
    const result = verseTextsToVerses(map, 1);

    // Assert
    expect(result.map((v) => v.verse)).toEqual([1, 2, 3]);
  });

  it("converts empty heText to undefined", () => {
    // Arrange
    const map = new Map<number, VerseTexts>([[1, { text: "Text", heText: "" }]]);

    // Act
    const result = verseTextsToVerses(map, 1);

    // Assert
    expect(result[0].hebrewText).toBeUndefined();
  });

  it("returns an empty array for an empty map", () => {
    // Arrange
    const map = new Map<number, VerseTexts>();

    // Act
    const result = verseTextsToVerses(map, 1);

    // Assert
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// rawWordEntryToLexiconEntry
// ---------------------------------------------------------------------------

describe("rawWordEntryToLexiconEntry", () => {
  it("maps all top-level fields", () => {
    // Arrange
    const raw: SefariaRawWordEntry = {
      headword: "אֱלֹהִים",
      parent_lexicon: "BDB Augmented Strong",
      transliteration: "elohim",
      pronunciation: "ʾĕlōhîm",
      content: { morphology: "noun", senses: [] },
    };

    // Act
    const result = rawWordEntryToLexiconEntry(raw);

    // Assert
    expect(result.headword).toBe("אֱלֹהִים");
    expect(result.parent_lexicon).toBe("BDB Augmented Strong");
    expect(result.transliteration).toBe("elohim");
    expect(result.pronunciation).toBe("ʾĕlōhîm");
    expect(result.morphology).toBe("noun");
  });

  it("extracts senses from content", () => {
    // Arrange
    const raw: SefariaRawWordEntry = {
      headword: "אֵל",
      parent_lexicon: "BDB Dictionary",
      content: {
        senses: [{ definition: "God, god", num: "1" }],
      },
    };

    // Act
    const result = rawWordEntryToLexiconEntry(raw);

    // Assert
    expect(result.senses).toHaveLength(1);
    expect(result.senses[0].definition).toBe("God, god");
  });

  it("defaults senses to [] when content is absent", () => {
    // Arrange
    const raw: SefariaRawWordEntry = {
      headword: "שָׁלוֹם",
      parent_lexicon: "Klein Dictionary",
    };

    // Act
    const result = rawWordEntryToLexiconEntry(raw);

    // Assert
    expect(result.senses).toEqual([]);
  });

  it("leaves morphology undefined when content is absent", () => {
    // Arrange
    const raw: SefariaRawWordEntry = {
      headword: "שָׁלוֹם",
      parent_lexicon: "Klein Dictionary",
    };

    // Act
    const result = rawWordEntryToLexiconEntry(raw);

    // Assert
    expect(result.morphology).toBeUndefined();
  });

  it("passes through optional fields as undefined when not supplied", () => {
    // Arrange
    const raw: SefariaRawWordEntry = {
      headword: "דָּבָר",
      parent_lexicon: "BDB Augmented Strong",
    };

    // Act
    const result = rawWordEntryToLexiconEntry(raw);

    // Assert
    expect(result.transliteration).toBeUndefined();
    expect(result.pronunciation).toBeUndefined();
  });
});
