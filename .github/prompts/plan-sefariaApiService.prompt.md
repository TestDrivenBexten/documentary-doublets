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

### Word Lookup Endpoint

- **Endpoint**: `GET https://www.sefaria.org/api/words/{word}` — takes a UTF-8 Hebrew word, URL-encoded
- **Response**: array — one element per lexicon that has an entry for the word (BDB Augmented Strong, BDB Dictionary, Klein Dictionary, Jastrow Dictionary, etc.)
- **Response fields used**:
  - `headword: string` — canonical Hebrew headword form
  - `parent_lexicon: string` — which dictionary (e.g., `"BDB Augmented Strong"`, `"Klein Dictionary"`)
  - `transliteration?: string` — romanized form (e.g., `"ʼĕlôhîym"`)
  - `pronunciation?: string` — pronunciation guide (e.g., `"el-o-heem'"`)
  - `content.morphology?: string` — part of speech (e.g., `"n-m"`)
  - `content.senses: LexiconSense[]` — possibly nested tree of definitions; **may contain HTML** (`<a>`, `<strong>`, `<em>`, `<span dir="rtl">`)
- **Input encoding**: pass the Hebrew string through `encodeURIComponent` before building the URL

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

### Phase 2b — Hebrew word definition lookup (*parallel with Phase 2*) ✅

**Extend `src/services/sefariaService.ts`** (or add alongside Phase 2 in the same file):

1. **`LexiconSense` type** (exported) — recursive tree node matching the API's nested sense structure:
   ```ts
   type LexiconSense = {
     definition?: string;
     num?: string;
     senses?: LexiconSense[];
   };
   ```

2. **`LexiconEntry` type** (exported) — one dictionary's entry for a word:
   ```ts
   type LexiconEntry = {
     headword: string;
     parent_lexicon: string;
     transliteration?: string;
     pronunciation?: string;
     morphology?: string;
     senses: LexiconSense[];
   };
   ```

3. **`SefariaRawWordEntry` interface** (internal) — minimal shape of one element of the raw API array:
   ```ts
   {
     headword: string;
     parent_lexicon: string;
     transliteration?: string;
     pronunciation?: string;
     content?: { morphology?: string; senses?: LexiconSense[] };
   }
   ```

4. **`fetchHebrewWordDefinition(word: string): Promise<LexiconEntry[]>`** (exported):
   - Validates `word` is non-empty; throws `Error('word must be non-empty')` if falsy
   - URL-encodes `word` with `encodeURIComponent` (handles Hebrew Unicode safely; avoids path injection)
   - Fetches `https://www.sefaria.org/api/words/{encodedWord}`
   - Checks `response.ok` and throws on non-2xx
   - Parses JSON as `SefariaRawWordEntry[]`
   - Maps each raw entry to `LexiconEntry`:
     - `headword`, `parent_lexicon`, `transliteration`, `pronunciation` — passed through directly
     - `morphology` — from `entry.content?.morphology`
     - `senses` — from `entry.content?.senses ?? []`
   - Returns the mapped array

> **HTML in senses**: definitions in `senses[].definition` routinely contain HTML. The service returns them **raw** — do not strip here. The display layer (future component) is responsible for sanitizing or stripping before rendering, so callers retain full control.

> **Multiple lexicons**: the array will typically contain 3–5 entries for common biblical Hebrew words. Consumers should filter by `parent_lexicon` if they want a specific dictionary (e.g., prefer `"BDB Augmented Strong"` for biblical Hebrew).

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
| `src/services/sefariaService.ts` | **Create** | Full service module including `fetchHebrewWordDefinition` |
| `src/types/index.ts` | Modify | Add `LexiconSense` and `LexiconEntry` exported types |
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
7. **Word lookup — returns entries**: In browser console, call `fetchHebrewWordDefinition('אֱלֹהִים')` — should resolve to an array of 3+ entries, each with a non-empty `headword`, `parent_lexicon`, and `senses`.
8. **Word lookup — multiple lexicons**: Verify entries from at least two distinct `parent_lexicon` values (e.g., `"BDB Augmented Strong"` and `"Klein Dictionary"`).
9. **Word lookup — raw HTML preserved**: Check that `senses[0].definition` on one entry contains angle brackets (HTML not stripped at the service layer).
10. **Word lookup — empty input guard**: Call `fetchHebrewWordDefinition('')` — should throw synchronously or return a rejected promise with the message `'word must be non-empty'`.
11. **Word lookup — fallback**: If the word lookup throws, the app must not crash; any caller catches the error independently.

---

## Out of Scope

- Displaying Hebrew verse text in the UI (follow-up task — requires RTL layout changes in `SourceDisplay.tsx`)
- Improving word definitions UX (popover/tooltip, HTML sanitization of sense definitions, and lexicon selection refinements)
- HTML sanitization of `LexiconSense.definition` values (service returns raw; sanitization belongs in the display layer)
- Multi-chapter refs (no current doublet spans chapters)
- Translation version selection UI
- Caching API responses (consider if network calls become a concern)
- Morphological analysis / lemmatization — the caller must supply the exact headword form that Sefaria recognizes; resolving surface forms to headwords is out of scope

---

## Security Note

When implementing the OWASP plan alongside this, update `connect-src` in the CSP meta tag and Vite dev server headers from `'self'` to `'self' https://www.sefaria.org`.
---

## Phase 5 — TextLookup Component & Right-Column Panel Toggle

### Goal

Add a `TextLookup` component that fetches and displays a Sefaria passage by ref, with an English/Hebrew toggle. Place it in the existing right column alongside `HebrewLookup`, with a panel switcher letting the user show either the word lookup or the text lookup at a time.

---

### New component: `src/components/TextLookup.tsx`

**State:**
- `query: string` — ref input (human-readable, e.g. `Genesis 16:1-14`)
- `isLoading: boolean`
- `error: string | null`
- `verseMap: Map<number, VerseTexts> | null` — result from `fetchVerseTexts`
- `showHebrew: boolean` — language toggle, default `false` (English)

**Behavior:**
- Form with a single text input (placeholder: `"e.g. Genesis 16:1-14"`) and a submit button; calls `fetchVerseTexts(query)` from `sefariaService` on submit. Input accepts human-friendly format (`Genesis 16:1-14`) — `fetchVerseTexts` runs it through `buildApiRef` internally; no raw Sefaria ref format is exposed to the user.
- While loading: disable form, show `"…"` label on button.
- On error: show inline error string (same pattern as `HebrewLookup`).
- On success: render an ordered verse list. Each verse renders either `text` (English) or `heText` (Hebrew) based on `showHebrew`.
- Hebrew display: `dir="rtl"`, `fontSize: "1.1rem"` to match `HebrewLookup` input style.
- Language toggle: EN / HE button pair rendered above the verse list, only visible when `verseMap` is non-null.
- If `heText` is empty for a verse (API offline fallback path), display `text` even when in Hebrew mode.

**No new service calls** — reuses `fetchVerseTexts(verseNumbering)` from Phase 2.

---

### Modify `src/App.tsx`

**Add `activePanel` state:** `'word' | 'text'`, default `'word'`.

**Right column layout change:**
- Replace bare `<HebrewLookup />` with:
  - Tab strip (above the panel content):
    - "Word Lookup" tab — sets `activePanel` to `'word'`
    - "Text Lookup" tab — sets `activePanel` to `'text'`
    - Active tab style: `borderBottom: "2px solid #333"`, `fontWeight: "bold"`, matching the lexicon tab style in `LexiconDisplay`
  - Conditional render below the tab strip:
    - `activePanel === 'word'` → `<HebrewLookup />`
    - `activePanel === 'text'` → `<TextLookup />`
- Add `import { TextLookup } from "./components/TextLookup"` alongside the existing `HebrewLookup` import.
- No changes to column widths, dividers, or any other layout.

---

### Files to Modify / Create

| File | Action | What changes |
|---|---|---|
| `src/components/TextLookup.tsx` | **Create** | New component (see above) |
| `src/App.tsx` | Modify | `activePanel` state + tab strip + conditional render in right column |

---

### Verification

1. **Panel toggle**: Clicking "Text Lookup" tab hides `HebrewLookup` and shows `TextLookup`; clicking "Word Lookup" restores it.
2. **Fetch works**: Enter `Genesis 16:1-14` → click Look up → verses appear in English.
3. **Language toggle**: Toggle to HE → verses switch to Hebrew with `dir="rtl"` applied.
4. **Empty heText fallback**: When Sefaria is offline, English fallback text renders in Hebrew mode without crashing.
5. **Error state**: Bad ref (e.g. `Zzz 99:1`) → inline error shown, no crash.
6. **TypeScript**: `npm run build` — no type errors.

---

### Out of Scope (this phase)

- Pre-populating TextLookup ref from the currently selected doublet's `verseNumbering`
- Persisting active panel between sessions
- Sharing state between the two lookup panels
- Verse highlighting or selection within TextLookup