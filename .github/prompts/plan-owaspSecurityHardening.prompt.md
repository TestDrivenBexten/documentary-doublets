# Plan: OWASP Security Hardening — documentary-doublets

## Context

Static React/TypeScript site deployed to GitHub Pages via Vite.
No server-side rendering, no auth, no user input, no backend.
Data: static JSON files in `public/doublets/`.

**TL;DR:** The codebase has no XSS, secrets, or injection vulnerabilities (React auto-escaping, no `dangerouslySetInnerHTML`, no `eval`). The gaps are all in *misconfiguration* — missing security headers, a misplaced external font link, outdated build deps, and no fetch error handling. GitHub Pages does not allow custom HTTP response headers; the plan targets meta tags + Vite dev server config where applicable.

---

## Audit Findings

### Strengths (no action needed)
- No `dangerouslySetInnerHTML`, no `eval`, no `Function()`
- No hardcoded secrets or API keys
- All JSX text content auto-escaped by React
- No external API calls — data fetched from same-origin static files only
- `strict: true` in tsconfig.json
- `React.StrictMode` enabled

### Gaps
| Finding | Severity | OWASP |
|---------|----------|-------|
| No Content Security Policy | High | A03, A05 |
| Google Fonts `<link>` in JSX body (App.tsx) instead of `<head>` | High | A05, A08 |
| No Subresource Integrity on Google Fonts | Medium | A08 |
| No X-Content-Type-Options | Medium | A05 |
| No X-Frame-Options | Medium | A05 |
| No Referrer-Policy | Low | A05 |
| No Permissions-Policy | Low | A05 |
| typescript@4.4.4 (outdated — 5.x available) | Medium | A06 |
| vite@4.4.9 (outdated — 5.x available) | Medium | A06 |
| No `.catch()` on fetch chains in App.tsx | Medium | A09 |

---

## Phase 1 — `index.html` Hardening
*(OWASP A03, A05, A08)*

### 1.1 Add Content Security Policy meta tag

Add to `<head>` in `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src 'self';
  img-src 'self' data:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'none'
">
```

Notes:
- `frame-ancestors 'none'` in a CSP meta tag is **not enforced** by browsers (per spec) but is included for documentation and partial support. Real clickjacking protection requires an HTTP header (not possible on GitHub Pages).
- SRI is excluded for Google Fonts — its CSS is dynamically generated per browser UA, making a stable hash impossible. Restricting to `fonts.googleapis.com` / `fonts.gstatic.com` is the correct mitigation.

### 1.2 Add security meta tags

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="Referrer-Policy" content="no-referrer">
```

Note: `X-Frame-Options` as a meta tag is not enforced by browsers — it requires an HTTP header. Included here for intent; enforced via Vite dev server headers (Phase 2).

### 1.3 Move Google Fonts `<link>` from App.tsx JSX to `index.html` `<head>`

**Remove** from `src/App.tsx` JSX:
```tsx
<link
  href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap"
  rel="stylesheet"
/>
```

**Add** to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap"
  rel="stylesheet"
  referrerpolicy="no-referrer"
>
```

---

## Phase 2 — Vite Dev Server Headers
*(OWASP A05)*

Add `server.headers` to `vite.config.ts` so development serves with proper security headers:

```ts
server: {
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
},
```

---

## Phase 3 — Dependency Upgrades
*(OWASP A06 — Vulnerable and Outdated Components)*

1. Upgrade `typescript` from `^4.4.4` → `^5.x` (latest stable)
2. Upgrade `vite` from `^4.4.9` → `^5.x`
3. Check `@vitejs/plugin-react` — currently `^4.0.0`; verify compatibility with Vite 5 and upgrade if needed
4. After upgrading, run `npm audit` and resolve any remaining high/critical findings
5. Run the app and confirm no TypeScript or build errors

---

## Phase 4 — Fetch Error Handling
*(OWASP A09 — Security Logging and Monitoring Failures)*

In `src/App.tsx`, the `useEffect` fetch chain (lines ~14–24) has no error handling — failures are silent. Add:

1. An `error` state: `const [error, setError] = useState<string | null>(null);`
2. `.catch()` on the outer and inner fetch chains that calls `setError(...)`
3. Render an error message in the JSX when `error !== null`

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add CSP meta, security meta tags, Google Fonts preconnect + link |
| `src/App.tsx` | Remove Google Fonts JSX link; add fetch error state and `.catch()` handlers |
| `vite.config.ts` | Add `server.headers` block |
| `package.json` | Versions bumped after upgrade (via npm) |

---

## Verification Checklist

- [ ] `npm audit` — 0 high/critical vulnerabilities
- [ ] Browser DevTools → Network → Response Headers (dev server) — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` present
- [ ] Browser DevTools → Console — no CSP violations on load or user interaction
- [ ] App renders correctly with fonts displayed (UnifrakturCook still loads)
- [ ] Temporarily break a JSON fetch path → error state renders instead of silent hang
- [ ] `npm run build` succeeds with no TypeScript errors

---

## Out of Scope / Deliberate Decisions

- **HSTS** — GitHub Pages already enforces HTTPS; no action needed
- **`frame-ancestors` enforcement** — requires HTTP header; not possible on GitHub Pages static hosting
- **SRI for Google Fonts** — not technically feasible; CSP domain allowlist is the correct alternative
- **Self-hosting fonts** — acceptable alternative if eliminating the third-party dependency is desired; not required for baseline security
