# Plan: Sefaria API Service (React TypeScript)

Fetch English and Hebrew verse text from the Sefaria public API at runtime, using each source's existing `verseNumbering` string as the query key. The static JSON files keep their current verse text as offline fallback. Sefaria text enriches (overwrites) the text at runtime.

---

## API Facts

- **Endpoint**: `GET https://www.sefaria.org/api/texts/{ref}` — public, CORS-enabled, no auth required
- **Ref format**: `Genesis.16.1-14` (spaces → `.`, colon → `.`, ranges with `-`)
- **Response fields used**:
  - `text: string[]` — English verses (may contain HTML tags like `<small>`, `<sup>`, `<span>`, footnotes)
  - `he: string[]` — Hebrew verses (may contain `<span>` markers for parashah breaks)
  - `sections: [chapter, startVerse]` — verse at index `i` = `sections[1] + i`
- **CORS**: Enabled on sefaria.org — works from browser `fetch()`

### Important: CSP Impact

The security plan's `connect-src 'self'` must be updated to `connect-src 'self' https://www.sefaria.org` or the API calls will be blocked. Update both `index.html` meta tag and `vite.config.ts` server headers when implementing the security plan.

---

## ref Parsing Logic

`verseNumbering` (from JSON) → broadest single API call covering all verse segments:

| verseNumbering | Parsed | API ref |
|---|---|---|
| `"Genesis 16:1-2,4-14"` | book=Genesis, ch=16, min=1, max=14 | `Genesis.16.1-14` |
| `"Genesis 16:3,15-16"` | book=Genesis, ch=16, min=3, max=16 | `Genesis.16.3-16` |
| `"Genesis 21:8-19"` | book=Genesis, ch=21, min=8, max=19 | `Genesis.21.8-19` |

> **Scope**: single-chapter refs only. Multi-chapter refs (where the chapter changes mid-range) are a known non-goal for this iteration.

---

## Steps

### Phase 1 — Extend the `Verse` type

**Modify `src/types/Doublet.ts`**:
- Add `heText?: string` to the `Verse` type (optional — not all verses will have it if API is offline)

No changes to `Source` or `Doublet` types.

### Phase 2 — Create the Sefaria service module (*parallel with Phase 1*)

**New file: `src/services/sefariaService.ts`**

Exports and internals:

1. **`SefariaApiResponse` interface** (internal) — minimal shape of the API response:
   ```ts
   { text: string[]; he: string[]; sections: number[] }
   ```

2. **`VerseTexts` type** (exported) — result per verse:
   ```ts
   { text: string; heText: string }
   ```

3. **`stripHtml(html: string): string`** (internal) — removes HTML tags using regex replace, **not innerHTML**. Pattern: `/<[^>]*>/g` → `''`. Collapses excess whitespace. Safe per OWASP A03.

4. **`buildApiRef(verseNumbering: string): string`** (internal) — converts human ref to Sefaria ref:
   - Split on `":"` → left = book + chapter (`"Genesis 16"`) → replace `" "` with `"."` → `"Genesis.16"`
   - Right side = verse range string (e.g., `"1-2,4-14"`) → split on `","` → collect all numbers → find global min and max → construct `"min-max"` (or just `"min"` if single verse)
   - Combine: `"Genesis.16.1-14"`

5. **`fetchVerseTexts(verseNumbering: string): Promise<Map<number, VerseTexts>>`** (exported) — main interface:
   - Calls `buildApiRef(verseNumbering)` to get the URL path
   - Fetches `https://www.sefaria.org/api/texts/{ref}`
   - Checks `response.ok` and throws on non-2xx
   - Parses JSON as `SefariaApiResponse`
   - Builds a `Map<number, VerseTexts>` where key = verse number:
     - `startVerse = sections[1]`
     - For each index `i` in `text[]`: key = `startVerse + i`, value = `{ text: stripHtml(text[i]), heText: stripHtml(he[i] ?? '') }`
   - Returns the map

Style matches existing `sortUtils.ts` — plain exported functions, no class.

### Phase 3 — Enrich doublets in `src/App.tsx` (*depends on Phases 1 & 2*)

**Add an `enrichSourceWithSefaria` async helper** (local to App.tsx):
- Takes a `Source`, calls `fetchVerseTexts(source.verseNumbering)`
- Maps over `source.verses`, producing new `Verse` objects:
  - `text`: from Sefaria map if found, else keep existing JSON text (fallback)
  - `heText`: from Sefaria map if found
- Returns a new `Source` with enriched verses (immutable — spread existing source)

**Update `useEffect`**:
- Current flow: fetch `index.json` → fetch each doublet JSON → `setDoublets`
- New flow: fetch `index.json` → fetch each doublet JSON → for each doublet, enrich all its sources via `enrichSourceWithSefaria` (parallel with `Promise.all`) → `setDoublets`
- `.catch()` on Sefaria enrichment: log the error and fall back to the original JSON source unchanged (so the app works offline)
- Add `error` state for the outer fetch failure (also satisfies the error-handling gap from the security plan)

**No changes to any component files** — `heText` is added to `Verse` as optional; existing components ignore it until display work is done in a later iteration.

---

## Files to Modify / Create

| File | Action | What changes |
|---|---|---|
| `src/types/Doublet.ts` | Modify | Add `heText?: string` to `Verse` |
| `src/services/sefariaService.ts` | **Create** | Full service module |
| `src/App.tsx` | Modify | Sefaria enrichment in `useEffect`; error state |

**JSON files in `public/doublets/`** — no changes. Verses stay as-is (offline fallback).

---

## Verification

1. **Dev server**: Run `npm start` — app loads, doublets display. Check Network tab: Sefaria API calls appear and return 200.
2. **Text override**: Compare a verse in the UI against the JSON file — Sefaria text (JPS default) should appear, not the NRSVue text from JSON.
3. **Hebrew stored**: In browser console, log `doublets[0].sources[0].verses[0].heText` — should be a non-empty Hebrew string.
4. **Fallback**: Temporarily break the Sefaria URL in the service → app still loads with JSON text, no crash.
5. **No HTML in verse text**: Verify that footnote tags from Sefaria (`<small>`, `<sup>`, etc.) do not appear as raw HTML in rendered verse text.
6. **TypeScript**: `npm run build` — no type errors.

---

## Out of Scope

- Displaying Hebrew in the UI (follow-up task — requires RTL layout changes in `SourceDisplay.tsx`)
- Multi-chapter refs (no current doublet spans chapters)
- Translation version selection UI
- Caching API responses (consider if network calls become a concern)

---

## Security Note

When implementing the OWASP plan alongside this, update `connect-src` in the CSP meta tag and Vite dev server headers from `'self'` to `'self' https://www.sefaria.org`.
