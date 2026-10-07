# Comprehensive Security Audit & Review (TASK-027)

Conducted on: 2026-10-07
Branch: `redesign/warm-terminal`
Scope: Full Git history, Frontend (`frontend/`), and Backend architecture (`backend/`, report-only).

---

## 1. Secrets & Repository Scan

- **Gitleaks Scan**:
  - Command: `docker run --rm -v "C:\Users\ankit\OneDrive\Desktop\Portfolio:/repo" zricethezav/gitleaks:latest detect --source="/repo" --verbose --log-level=debug`
  - History Scanned: Full repository history across all 48 commits (~723.61 KB).
  - Findings: **0 leaks detected**. Clean exit code 0.
- **Environment Files**:
  - Tracked in Git: Only `frontend/.env.example` and `backend/.env.example`.
  - Untracked: `.env`, `.env.local`, `.env.*` are strictly excluded in `.gitignore` and absent from Git tree.
- **Frontend Environment Variables**:
  - `VITE_API_URL`: Public backend endpoint URL.
  - `VITE_SITE_URL`: Public canonical domain URL.
  - Zero private keys, API secrets, or credentials exist in frontend code or build outputs.

---

## 2. Dependency Vulnerabilities (`npm audit`)

### Frontend Audit
- **Summary**: 10 vulnerabilities (1 low, 2 moderate, 7 high, 0 critical) across 269 total dependencies (40 production, 186 development).
- **Vulnerabilities**:
  - `vite` (high): `server.fs.deny` bypass and Windows UNC path handling in dev server (`launch-editor`).
  - `nanoid` (high): Custom generators loop indefinitely when size is 0.
  - `postcss` (high / moderate): Path traversal in source map auto-loading.
  - `react-router` / `react-router-dom` (high / moderate): Inefficient route matching DoS and CSRF bypass in RSC mode.
  - `source-map-js` (high): Event-loop DoS via source-map section offsets.
  - `brace-expansion` (high): Uncontrolled resource consumption.
  - `@babel/core` / `browserslist` (moderate / low).
- **Remediation**: All 10 vulnerabilities are fixable via non-breaking patch updates (`npm audit fix`). No breaking SemVer major bumps required.

### Backend Audit (Report-Only)
- **Summary**: 14 vulnerabilities (1 low, 4 moderate, 8 high, 1 critical) across 185 dependencies.
- **Critical Finding**:
  - `proxy-addr` (critical): IP spoofing via IPv4-mapped IPv6 trust subnet (`GHSA-jqcg-44mw-7w3h`). Fixable in `express` dependency chain.
- **High Findings**:
  - `multer` (high): Multiple DoS vulnerabilities via crafted multipart field names and deep nesting.
  - `nodemon` / `chokidar` (high).
- **Unused Backend Dependencies & Dead Code**:
  - `mongoose` (^9.6.2): **Completely unused**. Database is MySQL via `mysql2/promise`.
  - `axios` (^1.16.1): **Completely unused**. Outbound calls (e.g. GitHub API) use native Node.js `fetch`.
  - `multer` (^2.1.1): **Completely unused**. No file upload routes exist.
  - `cookie-parser` (^1.4.7): **Completely unused**. Not imported or used in `app.js`.
  - `backend/config/appwrite.js`: Dead file referencing uninstalled package `node-appwrite`. Never imported anywhere in the backend.
  - *Recommendation*: Removing `mongoose`, `axios`, `multer`, `cookie-parser`, and deleting `config/appwrite.js` eliminates almost all backend audit advisories immediately.

---

## 3. DOM Injection & Dangerous APIs Audit

A static audit was performed across all frontend source files (`frontend/src/`):

| Pattern | Occurrences | Location / Status |
| :--- | :--- | :--- |
| `dangerouslySetInnerHTML` | **0** | None |
| `innerHTML` | **0** | None |
| `eval` | **0** | None |
| `new Function` | **0** | None |
| `document.write` | **0** | None |
| `target="_blank"` without `rel="noopener noreferrer"` | **0** | All 10 external links in `frontend/src` explicitly specify `rel="noopener noreferrer"` |
| `window.open` | 1 | `frontend/src/features/palette/CommandPalette.jsx:59` safely invokes `window.open(item.target, '_blank', 'noopener,noreferrer')` |
| `sessionStorage` | **0** | None |
| `localStorage` | 3 | Admin JWT management (`frontend/src/features/admin/Admin.jsx` and `frontend/src/lib/api.js`) |

---

## 4. Admin JWT Storage & Architecture Analysis

### Current Implementation
- **Storage Location**: `localStorage.getItem('admin_token')`
- **Lifetime**: Persists indefinitely across tabs and browser restarts until explicit logout (`localStorage.removeItem('admin_token')`) or browser cache clearance.
- **Backend Token Validity**: Signed with `process.env.JWT_EXPIRES_IN || '7d'` (7 days).

### Storage Architecture Options

1. **Option A: In-Memory React State (Context / Store)**
   - *Pros*: Completely immune to XSS token theft via `localStorage`.
   - *Cons*: Token is lost on page reload; admin must log in again on refresh.
2. **Option B: `sessionStorage`**
   - *Pros*: Automatically cleared when browser tab is closed; isolated per tab.
   - *Cons*: Still accessible to JavaScript if XSS exists; requires re-authentication across tabs.
3. **Option C: `httpOnly`, `Secure`, `SameSite=Strict` Cookie**
   - *Pros*: Immune to JavaScript access; automatic browser inclusion; standard production pattern.
   - *Cons*: Requires backend changes (setting cookie on `/api/auth/login`, clearing on logout, enabling `credentials: true` in CORS) which is out-of-scope for frontend-only release hardening.
4. **Option D: Retain `localStorage` with Strict CSP & Short Expiry (Selected)**
   - *Pros*: Zero backend breaking changes; maintains current admin login persistence.
   - *Security Defense*: Mitigated by strict Content Security Policy (`default-src 'self'`, `object-src 'none'`, no external script execution) preventing XSS exfiltration, combined with server-side JWT verification on all protected endpoints.

---

## 5. Input Reflection & Data Handling

1. **Terminal Input (`Terminal.jsx`, `lib/terminalCommands.js`)**:
   - Command inputs are parsed strictly via pure text manipulation (`trim().split(/\s+/)`).
   - Output entries are rendered as pure React text elements (`<span>{entry.text}</span>`), never via HTML injection.
   - No inputs are reflected into URLs or executed as commands.
2. **Command Palette (`CommandPalette.jsx`)**:
   - Filter queries are matched against a static in-memory array (`title`, `shortcut`, `category`).
   - Rendered strictly via React JSX text nodes.
3. **Contact Form (`Contact.jsx`, `lib/contactData.js`)**:
   - Controlled React state inputs.
   - Client-side validation validates character length and email format prior to sending JSON payload.
   - Server-side validation via `express-validator` length-limits and sanitizes input.
   - Responses display localized static success/error state strings, never echoing back raw user input.

---

## 6. Backend Security Findings (Report-Only)

*Note: Per master instructions, `backend/` is untouched. The following findings are reported for owner approval.*

1. **Missing `trust proxy`**:
   - *Issue*: `app.set('trust proxy', 1)` is not configured in `backend/app.js`.
   - *Risk*: Behind reverse proxies (Render, Cloudflare), `req.ip` resolves to the proxy IP. Since `contactLimiter` is set to 5 requests per hour, all site visitors share the single proxy IP counter and will experience false HTTP 429 rate-limiting.
   - *Proposed Fix*: Add `app.set('trust proxy', 1);` immediately after `const app = express();` in `backend/app.js`.
2. **CORS Configuration**:
   - *Issue*: `backend/app.js` sets `cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true })`.
   - *Risk*: A single string origin blocks Vercel Preview deployment URLs (`https://portfolio-*-ankitsingh.vercel.app`) when `FRONTEND_URL` points to production.
   - *Proposed Fix*: Update CORS origin handler to accept an array of allowed origins or regex matching preview and production domains.
3. **Body Parser Size Limit**:
   - *Issue*: `app.use(express.json({ limit: '10mb' }));`.
   - *Risk*: 10MB payload limit is unnecessarily large for a portfolio text API, creating unnecessary memory consumption risk under high volume.
   - *Proposed Fix*: Reduce payload limit to `100kb` or `10kb`.
4. **Visitor IP & Privacy in Analytics**:
   - *Issue*: `trackVisit` in `analyticsController.js` and `submitContact` in `contactController.js` store raw IP addresses (`req.ip || req.headers['x-forwarded-for']`) and User-Agent strings directly in MySQL.
   - *Risk*: Raw IP storage constitutes personally identifiable information (PII) under privacy regulations (GDPR).
   - *Proposed Fix*: Anonymize IP before storage (e.g., zero out last octet in IPv4 / last 80 bits in IPv6, or SHA-256 hash with salt).
5. **Admin Login Rate Limiting & Proxy**:
   - *Issue*: `authLimiter` (10 attempts per 15 min) is properly attached to `/api/auth/login`, but shares the `trust proxy` vulnerability.
   - *Proposed Fix*: Fixed once `trust proxy` is set.
6. **JWT Secret & Admin Credential Guards**:
   - *Issue*: `authController.js` uses `process.env.JWT_SECRET`. If missing, `jwt.sign` throws runtime error. In addition, auto-creation of admin on first login checks `email === process.env.ADMIN_EMAIL` and hashes `process.env.ADMIN_PASSWORD`.
   - *Proposed Fix*: Add startup assertion in `server.js` ensuring `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are non-empty strings with minimum length requirements.
7. **Error Handling & Database Detail Leaks**:
   - *Issue*: In `backend/middleware/errorHandler.js`, `err.message` is returned to client. On 500 database errors, SQL syntax or connection strings could be revealed.
   - *Proposed Fix*: In production (`process.env.NODE_ENV === 'production'`), return generic `"Internal Server Error"` if `status === 500`.
8. **Unused Dependencies Cleanup**:
   - *Proposed Fix*: Uninstall `mongoose`, `axios`, `multer`, `cookie-parser`, and delete `backend/config/appwrite.js`.
