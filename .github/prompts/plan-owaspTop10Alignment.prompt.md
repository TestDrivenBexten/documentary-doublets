# Plan: OWASP Top 10 Alignment

Public read-only SPA on GitHub Pages consuming the Sefaria API. No auth, no secrets, no backend. Findings span A03, A05, A08, and A09 — six categories are not applicable.

---

## Phase 1 — Content Security Policy (A05)

**~~Step 1: Add CSP `<meta>` tag to index.html~~** ✅ — strict production policy:
- `default-src 'self'`
- `script-src 'self'` *(no `unsafe-inline`)*
- `connect-src 'self' https://www.sefaria.org`
- `style-src 'self' https://fonts.googleapis.com`
- `font-src https://fonts.gstatic.com`
- `img-src 'self' data:`
- `frame-ancestors 'none'` *(clickjacking — note: ignored in `<meta>` by spec; this is a known deployment gap on GitHub Pages)*

**~~Step 2: Add `server.headers` to vite.config.ts~~** ✅ — dev-only relaxation:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Content-Security-Policy` with `script-src 'self' 'unsafe-inline'` here only — covers Vite's injected dev scripts without loosening the production meta tag

---

## Phase 2 — Shared Sanitizer Utility (A03)

**~~Step 3: Install `dompurify` + `@types/dompurify`~~** ✅ *(parallel with step 6)*

**~~Step 4: Create `src/utils/stripHtml.ts`~~** ✅ — single exported `stripHtml(html)` using `DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })`, replacing the fragile regex

**~~Step 5: Remove local `stripHtml` copies~~** ✅ from `src/services/sefariaService.ts` and `src/components/LexiconDisplay.tsx`; import shared utility *(depends on step 4)*

---

## Phase 3 — Runtime API Schema Validation (A08)

**~~Step 6: Add `zod`~~** ✅ to `package.json` *(parallel with step 3)*

**~~Step 7: Define Zod schemas in `src/services/sefariaService.ts`~~** ✅ mirroring `SefariaV3TextResponse` and `SefariaRawWordEntry[]`; replace `as` casts with `schema.parse(data)` — strict: ZodError propagates to callers, who display a UI error *(depends on step 6)*

---

## Phase 4 — Filename Validation & Error Handling (A08 + A09)

**~~Step 8: Validate `filenames` in `src/App.tsx`~~** ✅ — after fetching `index.json`, filter each entry against `/^[\w-]+\.json$/`; reject any containing `://` or starting with `..` before passing to `fetch()`

**~~Step 9: Add `.catch()` to both Promise chains in `src/App.tsx`~~** ✅ — the outer `index.json` fetch and the inner `Promise.all(...)` both currently swallow errors silently; set an error state and show a user-visible message (matching the `HebrewLookup`/`TextLookup` error-display pattern)

---

## Relevant Files

- `index.html` — CSP meta tag
- `vite.config.ts` — dev server headers
- `src/App.tsx` — filename validation + error handling
- `src/services/sefariaService.ts` — remove local `stripHtml`, add Zod schemas
- `src/components/LexiconDisplay.tsx` — remove local `stripHtml`
- `src/utils/stripHtml.ts` — *new file*
- `package.json` — add `dompurify`, `@types/dompurify`, `zod`

---

## Out of Scope

A01, A02, A04, A06, A07, A10 — not applicable to this architecture.

---

## Decisions

- Zod validation is **strict** — ZodError propagates; no partial data allowed through
- `unsafe-inline` is allowed **only** in the Vite dev server `Content-Security-Policy` header; the production `<meta>` tag stays strict

---

## Verification

1. `npm run build` — must pass with no errors
2. `npm test` — all existing tests must pass
3. DevTools Network — Sefaria API calls succeed; no blocked requests
4. DevTools Console — no CSP violations logged on page load
5. Manual test: pass a malformed API response shape to `sefariaService` — confirm Zod throws and the UI shows an error
6. Manual test: add `"../../../etc/passwd"` to `public/doublets/index.json` — confirm it is filtered before `fetch()` is called
