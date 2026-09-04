## Plan: Hebrew Print Preview

Add an in-app Hebrew print-preview modal to the existing text lookup flow. It will open with `Ctrl+P`, display Hebrew verses right-to-left with double spacing and a Hebrew-friendly font stack, and let users show or hide verse numbers.

**Steps**

1. Extend `TextLookup` to expose a preview action when Hebrew verses are available, while preserving the existing EN/HE result switch.
2. Add `src/components/PrintPreview.tsx` with:
   - Hebrew RTL verse rendering
   - Double-spaced text
   - Hebrew-capable font fallback stack
   - Verse-number checkbox/toggle
   - Close button, overlay dismissal, and `Escape` support
   - Print button using `window.print()`
   - Accessible dialog semantics
3. Add `src/components/PrintPreview.module.css` with screen styles and `@media print` rules so printed output contains only the Hebrew preview content.
4. Add `Ctrl+P` handling in the owning application flow. It will open the preview when Hebrew results are available and prevent the browser’s immediate print dialog in that case. Shortcuts pressed while editing an input, textarea, select, or contenteditable element will be ignored.
5. Add focused component tests following the repository’s Arrange/Act/Assert convention. Cover:
   - Hebrew verse rendering
   - Default verse-number visibility
   - Showing and hiding verse numbers
   - Close behavior
   - `window.print()` invocation
   - Keyboard shortcut behavior
6. Verify with focused tests, `npm run build`, and the full `npm test` suite.
7. Manually verify the workflow in the browser, including narrow layouts and actual print output.

**Relevant files**

- [src/components/TextLookup.tsx](src/components/TextLookup.tsx) — owns Hebrew verse data and result state.
- [src/components/TextLookup.module.css](src/components/TextLookup.module.css) — existing lookup/result styling.
- [src/components/PrintPreview.tsx](src/components/PrintPreview.tsx) — new preview dialog.
- [src/components/PrintPreview.module.css](src/components/PrintPreview.module.css) — preview and print styling.
- [src/App.tsx](src/App.tsx) — application-level keyboard integration if shortcut state must be lifted.
- [src/components/Header.tsx](src/components/Header.tsx) — existing modal behavior to follow.
- [src/components/Header.module.css](src/components/Header.module.css) — existing overlay conventions.
- [src/types/SefariaTypes.ts](src/types/SefariaTypes.ts) — existing `VerseTexts` type.

**Decisions**

- “1” means use an in-app preview modal rather than a separate route or immediately opening the browser print dialog.
- The preview uses Hebrew verse text from `TextLookup`.
- Verse numbers are visible by default and can be hidden.
- No API, backend, or persisted preference changes are needed.
- The lexicon lookup panel is out of scope because it contains definitions rather than verse-numbered text.
- The font will use local/fallback Hebrew fonts rather than adding a remote font dependency.