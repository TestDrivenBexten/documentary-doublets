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

## Completed

- **Phase 1** — `heText?: string` (renamed from plan's `heText` → actually `hebrewText`) added to `Verse` type in `src/types/Doublet.ts`. JSON files updated: `text` → `englishText`.
- **Phase 2** — `fetchVerseTexts(verseNumbering)` implemented in `src/services/sefariaService.ts` using `/api/v3/texts/{ref}?version=english&version=hebrew`. Includes `stripHtml`, `buildApiRef`, `VerseTexts` export.
- **Phase 2b** — `fetchHebrewWordDefinition(word)` implemented in the same service file.
- **Phase 5** — `TextLookup` component created (`src/components/TextLookup.tsx`). Right column in `App.tsx` updated with Word/Text panel tab strip.

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