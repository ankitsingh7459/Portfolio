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

*Note: Per master instructions, `backend/` remains strictly untouched. The following findings and recommendations are reported for owner approval.*

### Category A: Verified Defects (Code-Level)

1. **Environment Variable Validation & `bcryptjs` Error Handling (`authController.js`)**:
   - *Technical Verification*: An isolated runtime test was conducted on `bcryptjs`:
     ```javascript
     const bcrypt = require('bcryptjs');
     bcrypt.hash(undefined, 12).catch(err => console.log(err.message));
     // Output: ERROR: Illegal arguments: undefined, number
     bcrypt.compare(undefined, 'hash').catch(err => console.log(err.message));
     // Output: ERROR: Illegal arguments: undefined, string
     ```
     `bcryptjs` does *not* stringify `undefined` to `"undefined"`. Instead, it throws `Error: Illegal arguments: undefined, number`.
   - *Defect in Source*: In `backend/controllers/authController.js`:
     ```javascript
     if (!admin && email === process.env.ADMIN_EMAIL) {
       const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
       ...
     }
     ```
     If `ADMIN_PASSWORD` is undefined or unset in the production environment, the first login attempt will fail with an unhandled 500 error rather than silently hashing any value. Similarly, `jwt.sign` throws `Error: secretOrPrivateKey must have a value` if `JWT_SECRET` is unset.
   - *Proposed Fix*: Implement explicit startup assertions in `server.js` validating that `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are present and exceed minimum length requirements before binding the HTTP port.

2. **Database Detail Leaks in Production (`backend/middleware/errorHandler.js`)**:
   - *Defect*: `res.status(status).json({ success: false, message: err.message })` echoes the raw error message to clients. On 500 database failures, this exposes internal MySQL connection errors, table names, or SQL query syntax.
   - *Proposed Fix*: In production (`process.env.NODE_ENV === 'production'`), mask 500-level error messages with generic text (`"Internal Server Error"`), while logging the full stack trace server-side.

---

### Category B: Deployment-Dependent Concerns (Infrastructure & Topology)

3. **`trust proxy` Configuration & Proxy Topologies**:
   - *Issue*: `app.set('trust proxy', ...)` is not configured in `backend/app.js`.
   - *Topology Analysis*:
     - Express defaults to `trust proxy: false`, meaning `req.ip` reflects the immediate socket connection address. When deployed behind a reverse proxy (such as Render's routing mesh or an edge CDN), `req.ip` will resolve to the proxy's internal IP rather than the client, causing rate limiters to pool all users together.
     - Conversely, blindly trusting proxies without verified evidence of the infrastructure topology creates IP spoofing vulnerabilities, as arbitrary clients could spoof `X-Forwarded-For` headers.
   - *Proposed Fix*: Proxy trust configuration must strictly follow verified production infrastructure documentation and request header evidence. DevOps/the owner must inspect the exact ingress topology (e.g. examining how the hosting platform populates and sanitizes `X-Forwarded-For` or upstream headers) before configuring `trust proxy`. Do not prescribe specific hop counts (e.g. `1` or `2`) or custom headers without verified operational evidence of the full request chain.

4. **CORS Allowlist for Production and Preview Environments**:
   - *Issue*: `backend/app.js` sets `cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true })`.
   - *Risk of Open Regex*: Recommending an open regex like `/.*\.vercel\.app$/` creates a major security hole: ANY third-party Vercel account (`attacker.vercel.app`) could make credentialed requests to the backend API.
   - *Proposed Fix*: Implement an explicit origin array or a strictly scoped matcher restricted to the owner's domain and project prefix:
     ```javascript
     const allowedOrigins = [
       process.env.FRONTEND_URL,
       'https://portfolio-gamma-lake-83.vercel.app',
       'http://localhost:5173',
     ].filter(Boolean);

     app.use(cors({
       origin: (origin, callback) => {
         if (!origin || allowedOrigins.includes(origin)) {
           return callback(null, true);
         }
         return callback(new AppError('CORS origin not allowed', 403));
       },
       credentials: true,
     }));
     ```

5. **Rate Limiting Scope & Proxy Dependency (`contactLimiter` / `authLimiter`)**:
   - *Issue*: Rate limits on `/api/contact` (5 req/hour) and `/api/auth/login` (10 req/15 min) depend on `req.ip`. Misconfigured proxy trust causes global rate limit exhaustion for legitimate visitors.
   - *Proposed Fix*: Resolved once the correct `trust proxy` topology setting from Item 3 is applied.

---

### Category C: Optional Improvements & Hygiene

6. **Default Security Headers via `helmet()`**:
   - *Verification*: Default `helmet()` automatically applies standard defensive headers without breaking API consumers:
     - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
     - `X-Frame-Options: SAMEORIGIN` (clickjacking defense)
     - `Strict-Transport-Security: max-age=15552000; includeSubDomains` (HSTS)
     - `X-DNS-Prefetch-Control: off`
     - `Origin-Agent-Cluster: ?1`
     - Removes `X-Powered-By: Express`
   - *Proposed Fix*: Install and mount `app.use(helmet());` before route definitions in `backend/app.js`.

7. **Request Body Size Limit**:
   - *Issue*: `app.use(express.json({ limit: '10mb' }));` allows unnecessarily large payloads for an API that only receives JSON contact form submissions and authentication requests.
   - *Proposed Fix*: Reduce JSON payload limit to `100kb`: `app.use(express.json({ limit: '100kb' }));`.

8. **Visitor IP Privacy & GDPR Subnet Clarification**:
   - *Issue*: `trackVisit` in `analyticsController.js` and `submitContact` in `contactController.js` log raw IP addresses.
   - *Privacy Clarification*: Truncating IPv4 addresses to `/24` (e.g., `192.168.1.0/24`) constitutes **pseudonymization / truncation**, NOT complete GDPR anonymization. In low-density subnets or when combined with precise access timestamps and user-agent fingerprints, `/24` masking may still allow individual re-identification. Furthermore, hashing IP addresses—even with a rotating salt—does **not** automatically establish GDPR anonymization under EDPB and Article 29 Working Party guidance (Opinion 05/2014). Hashed IPs remain pseudonymized data if linkability or singling out persists across requests, or if correlation is possible. True anonymization requires that individuals cannot be singled out or linked by any means reasonably likely to be used; this typically necessitates aggregating metrics (e.g., daily pageview counters without per-request records) or omitting IP storage altogether.
   - *Proposed Fix*: For privacy compliance, drop individual IP storage from analytics visits in favor of aggregated metrics, or omit IP tracking entirely.

9. **Dead Code & Unused Dependencies Removal**:
   - *Findings*: The following packages in `backend/package.json` are completely unused:
     - `mongoose` (^9.6.2): MySQL is used via `mysql2/promise`.
     - `axios` (^1.16.1): Outbound calls use native Node.js `fetch`.
     - `multer` (^2.1.1): No upload routes exist.
     - `cookie-parser` (^1.4.7): Not imported in `app.js`.
     - `backend/config/appwrite.js`: Dead file referencing uninstalled package `node-appwrite`.
   - *Proposed Fix*: Run `npm uninstall mongoose axios multer cookie-parser` in `backend/` and delete `backend/config/appwrite.js`.

