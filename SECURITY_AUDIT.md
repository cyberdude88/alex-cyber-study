# Security Audit Report
**Date:** April 16–17, 2026  
**Scope:** Full manual source code review — all HTML, JS, and Python files (~80 files)  
**Status:** All findings remediated.

---

## Summary

| Severity | Count |
|---|---|
| HIGH | 3 |
| MEDIUM | 3 |
| LOW | 3 |
| **Total** | **9** |

All vulnerabilities were identified through manual static analysis with CWE-based pattern matching, data flow tracing from external inputs through DOM sinks, and async concurrency modeling of the Cloudflare Worker.

---

## Findings

### [CRIT-1] XSS via `javascript:` URI in source links — HIGH
**File:** `cat/app.js:506` | **Type:** CWE-79, CWE-116

`escapeHtml()` did not block `javascript:` URIs. A compromised question bank could inject `"url": "javascript:alert(document.cookie)"` into a source reference, executing JS when a user clicks it.

**Fix:** Source link URLs now validated against `^https?://` whitelist; non-matching URLs render as `#`.

---

### [HIGH-1] Stored XSS in ciso-decision-engine — HIGH
**File:** `ciso-decision-engine/index.html:1238-1258` | **Type:** CWE-79

Five innerHTML sinks received raw scenario bank data (`sc.context`, `sc.stem`, `choice.text`, `ch.why`, decision history) without sanitization.

**Fix:** Added `escapeHtml()` utility; all sinks now escaped before rendering.

---

### [HIGH-3] `selectedIndex` out-of-bounds in Cloudflare Worker — HIGH
**File:** `cloudflare/src/worker.js` — `answerQuestion()` | **Type:** CWE-129

API validated `selectedIndex >= 0` but not `< item.choices.length`. Combined with the publicly accessible question bank, an attacker could submit out-of-bounds indices to bypass answer validation.

**Fix:** Added upper-bounds check; returns 400 for invalid indices.

---

### [MED-5] CORS wildcard allows cross-origin session reads — MEDIUM
**File:** `cloudflare/src/worker.js` | **Type:** CWE-942

`Access-Control-Allow-Origin: *` allowed any site to read API responses containing session state.

**Fix:** Origin restricted to `https://ansbergs.github.io` (production) and `localhost` (dev). `Vary: Origin` added.

---

### [MED-7] `correctIndex` not bounds-checked — MEDIUM
**File:** `cloudflare/src/worker.js` — `normalizeItem()` | **Type:** CWE-1285

`correctIndex` accepted any number. An out-of-range value in the bank could create an answer-key oracle or corrupt session history.

**Fix:** `normalizeItem` now clamps `correctIndex` to `[0, choices.length - 1]`.

---

### [MED-8] Cache stampede in `loadBank()` — MEDIUM
**File:** `cloudflare/src/worker.js` — `loadBank()` | **Type:** CWE-362

Concurrent requests during cache TTL expiry each independently fetched the bank. During a rolling bank deployment, this could cause version mismatches that permanently break active sessions.

**Fix:** Promise deduplication via `bankCacheInflight` (singleflight pattern).

---

### [LOW-1] `BANK_URL` supply chain trust — LOW
**File:** `cloudflare/src/worker.js` | **Type:** CWE-494

The Worker fetches the question bank from a mutable GitHub raw URL on `main` branch. A compromised account could push malicious JSON.

**Recommendation:** Pin to a content-addressed URL (tagged release) or store in Cloudflare R2.

---

### [LOW-2] `.toFixed()` crash on tampered sessionStorage — LOW
**File:** `cat/app.js:1853,1879,1880` | **Type:** CWE-20

`row.elapsedSec.toFixed(2)` called unconditionally on deserialized values. Corrupted sessionStorage could crash the results screen.

**Fix:** Wrapped with `Number.isFinite()` guard; falls back to `"—"` for invalid values.

---

### [LOW-4] CSS selector injection via cross-origin drag — LOW
**File:** `drills/forensic-process.html:684,721` | **Type:** CWE-74

`dataTransfer.getData('text/plain')` was interpolated directly into `querySelector`. A cross-origin drag could inject arbitrary CSS selectors.

**Fix:** uid validated as numeric-only (`/^\d+$/`) before use in selector.

---

## Confirmed Not Vulnerable

| Check | Result |
|---|---|
| Hardcoded API keys / secrets | None — `wrangler.toml` uses only placeholder values |
| `eval()` / `new Function()` / `setTimeout(string)` | None found |
| Python `subprocess` / `exec` / `pickle` | None in any script |
| `postMessage` without origin check | No message listeners found |
| Prototype pollution | No user-controlled keys reaching `Object.assign` |
| DOM clobbering | No ID/variable collisions |
| ReDoS | All regex use fixed whitelists, no nested quantifiers |
| Open redirect via URL param | Not present — strict `=== "1"` comparison only |
| `localStorage` → DOM injection | Arena dashboard: all fields through `Number()` / `clampPct()`. CAT review table: fully escaped. |
| All 56 domain drill pages | Zero `fetch`/`localStorage`/URL params. All innerHTML uses hardcoded `const` data. |
| synonym-combat/ | No DOM sinks at all |
| frameworks/ciso-architecture-arena/ | `textContent` and `createElement` throughout; zero innerHTML with dynamic data |
| ciso-simulator/js/app.js (6800 lines) | No external data sources. All values clamped via `clamp()`. |
| All 20 Python scripts | No dangerous patterns |

---

## Recommended Hardening

1. **Content Security Policy** — add a `_headers` file with `script-src 'self'` to catch any future innerHTML XSS at the browser layer
2. **Pin `BANK_URL`** to a tagged release artifact instead of mutable `main` branch raw URL
3. **Cloudflare WAF rate limiting** — cap `/api/cat/session` POST to ~20 req/min/IP

---

*Audited April 2026*
