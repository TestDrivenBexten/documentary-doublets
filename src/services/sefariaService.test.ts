import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchVerseTexts, fetchHebrewWordDefinition } from "./sefariaService";
import type { SefariaRawWordEntry } from "../types/SefariaTypes";

function getFirstCallUrl(mockFn: ReturnType<typeof vi.fn>): string {
  return mockFn.mock.calls[0][0] as string;
}

// ---------------------------------------------------------------------------
// fetchVerseTexts
// ---------------------------------------------------------------------------

describe("fetchVerseTexts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds the correct API ref for a whole-chapter reference (Genesis 16)", async () => {
    // Arrange
    const verseResponse = { ok: true, json: () => Promise.resolve({ versions: [] }) };
    const mockFetch = vi.fn().mockResolvedValue(verseResponse);
    vi.stubGlobal("fetch", mockFetch);

    // Act
    await fetchVerseTexts("Genesis 16");

    // Assert
    const calledUrl = getFirstCallUrl(mockFetch);
    expect(calledUrl).toContain(encodeURIComponent("Genesis 16"));
  });

  it("builds the correct API ref for a single-verse reference (Genesis 16.1)", async () => {
    // Arrange
    const verseResponse = { ok: true, json: () => Promise.resolve({ versions: [] }) };
    const mockFetch = vi.fn().mockResolvedValue(verseResponse);
    vi.stubGlobal("fetch", mockFetch);

    // Act
    await fetchVerseTexts("Genesis 16:1");

    // Assert
    const calledUrl = getFirstCallUrl(mockFetch);
    expect(calledUrl).toContain(encodeURIComponent("Genesis 16.1"));
  });

  it("builds the correct API ref for a multi-word book with a verse range (Song of Songs 1.1-7)", async () => {
    // Arrange
    const verseResponse = { ok: true, json: () => Promise.resolve({ versions: [] }) };
    const mockFetch = vi.fn().mockResolvedValue(verseResponse);
    vi.stubGlobal("fetch", mockFetch);

    // Act
    await fetchVerseTexts("Song of Songs 1:1-7");

    // Assert
    const calledUrl = getFirstCallUrl(mockFetch);
    expect(calledUrl).toContain(encodeURIComponent("Song of Songs 1.1-7"));
  });
});

// ---------------------------------------------------------------------------
// fetchHebrewWordDefinition
// ---------------------------------------------------------------------------

describe("fetchHebrewWordDefinition", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when word is empty", async () => {
    // Arrange
    // (no fetch mock needed — guard fires before any network call)

    // Act & Assert
    await expect(fetchHebrewWordDefinition("")).rejects.toThrow("word must be non-empty");
  });

  it("throws when the API returns a non-ok status", async () => {
    // Arrange
    const notFoundResponse = { ok: false, status: 404, statusText: "Not Found" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(notFoundResponse));

    // Act & Assert
    await expect(fetchHebrewWordDefinition("שָׁלוֹם")).rejects.toThrow("Sefaria API error: 404 Not Found");
  });

  it("returns mapped lexicon entries on a successful response", async () => {
    // Arrange
    const rawEntries: SefariaRawWordEntry[] = [
      {
        headword: "שָׁלוֹם",
        parent_lexicon: "BDB Augmented Strong",
        transliteration: "shalom",
        pronunciation: "šālôm",
        content: { morphology: "noun", senses: [{ definition: "peace", num: "1" }] },
      },
    ];
    const successResponse = { ok: true, json: () => Promise.resolve(rawEntries) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(successResponse));

    // Act
    const result = await fetchHebrewWordDefinition("שָׁלוֹם");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].headword).toBe("שָׁלוֹם");
    expect(result[0].transliteration).toBe("shalom");
    expect(result[0].morphology).toBe("noun");
    expect(result[0].senses[0].definition).toBe("peace");
  });

  it("returns an empty array when the API returns no entries", async () => {
    // Arrange
    const emptyResponse = { ok: true, json: () => Promise.resolve([]) };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(emptyResponse));

    // Act
    const result = await fetchHebrewWordDefinition("אֵל");

    // Assert
    expect(result).toEqual([]);
  });

  it("URL-encodes the word in the fetch request", async () => {
    // Arrange
    const emptyResponse = { ok: true, json: () => Promise.resolve([]) };
    const mockFetch = vi.fn().mockResolvedValue(emptyResponse);
    vi.stubGlobal("fetch", mockFetch);

    // Act
    await fetchHebrewWordDefinition("שָׁלוֹם");

    // Assert
    const calledUrl = getFirstCallUrl(mockFetch);
    expect(calledUrl).toContain(encodeURIComponent("שָׁלוֹם"));
  });
});
