# Targeted preview readiness — 2026-10-08

Follow-up: see [DEPLOYMENT_AND_SESSION.md](DEPLOYMENT_AND_SESSION.md) for the descendant admin 401 recovery fix and direct GitHub deployment routing evidence. The scores/screenshots below remain historical evidence of the preserved `ef42918` preparation; the listed session-expiry issue is now fixed locally.

Local frontend verification only. No backend code, production settings, push, merge, or deployment was changed. No additional broad review was performed.

## Branch and scope

- Branch: `redesign/warm-terminal`; starting HEAD: `5a78fd3850ac8652da8e886556e95043ade4d905`.
- One frontend correction: Escape from mobile navigation returns focus to its toggle rather than leaving focus on an unmounted menu item. The new browser test reproduced the failure before the correction.
- Added targeted browser checks and an isolated static production-build server with synthetic API fixtures. Fixtures are explicitly labelled in project descriptions and do not represent live metrics.
- Prepared commit: the commit containing this report and the focused checks; the full SHA is reported in the delivery message. Generated screenshots, axe data and Lighthouse reports remain ignored local evidence.

## Accessibility and admin behavior

- Mobile viewport: 375 × 667, Chrome, touch/mobile emulation. Navigation and command palette each have **zero axe violations**, using WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags (all impacts checked).
- Navigation: keyboard opening, expanded state, Tab into navigation, every menu action >=44 × 44 px, Escape close and focus restoration verified.
- Palette: search focus, Tab/Shift+Tab containment, ArrowDown selection, filtering, case-study target >=44 px high, empty results, Escape restoration to mobile navigation toggle, and Enter route navigation/heading focus verified.
- Desktop/mobile admin: invalid login response, successful mock login, dashboard read, token persistence across reload, authorized create/update/delete, snake_case payloads and normalized readback, delete cancellation, logout and reload after logout verified. Test credentials and token are synthetic and never submitted to the live API.
- **Live integration remains unverified.** Mocks prove frontend request/rendering behavior, not real credential acceptance, JWT validity/expiry, database persistence, backend authorization, or deployed CORS.
- Separate intentional failures: save/delete 500 responses display alerts and preserve the form/record. A 401 after reload retains the stored token and shows an empty dashboard; **automatic session-expiry logout and an explicit load-error state are absent**. This is a documented preview limitation, not a passing expiry-security guarantee.

Validation: production build passed; lint passed; 17 unit-test files / 111 tests passed; release placeholder check passed. Targeted Playwright suite: 7 passed, 3 viewport-inapplicable skips, zero failures. The failure scenario is separately named and is excluded from Lighthouse.

## Every Lighthouse measurement

Lighthouse 13.5.0, Headless Chrome 154.0.0.0, Windows, navigation mode, default mobile simulated throttling: 412 × 823, DPR 1.75, 150 ms RTT, 1638.4 Kbps throughput, 4× CPU slowdown. Each CLI invocation starts a separate browser with default storage reset. Runs were sequential, without concurrent browser tests. URL: `http://127.0.0.1:4175/`. No domain env override was invented; `VITE_SITE_URL` is unset. All normal API requests (`projects`, `analytics/github`, `analytics/track`) returned 200 with deterministic fixtures. No intentional API failures occurred in any measurement.

| Series / run | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
|---|---:|---:|---:|---:|---:|
| Before focus correction, diagnostic only | 78 | 100 | 100 | 83 | 100 |
| Final build, uncompressed server 1 | 78 | 100 | 100 | 83 | 100 |
| Final build, uncompressed server 2 | 78 | 100 | 100 | 83 | 100 |
| Final build, uncompressed server 3 | 83 | 100 | 100 | 83 | 100 |
| Uncompressed median | **78** | **100** | **100** | **83** | **100** |
| Final build, compressed server 1 | 88 | 100 | 100 | 83 | 100 |
| Final build, compressed server 2 | 93 | 100 | 100 | 83 | 100 |
| Final build, compressed server 3 | 94 | 100 | 100 | 83 | 100 |
| Compressed median | **93** | **100** | **100** | **83** | **100** |

| Final compressed run | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|
| 1 | 1.8 s | 3.1 s | 260 ms | 0.015 |
| 2 | 1.8 s | 2.9 s | 130 ms | 0.015 |
| 3 | 1.8 s | 2.8 s | 140 ms | 0.015 |

The uncompressed median was below 90, triggering investigation. Lighthouse identified uncompressed transfer, a 223 kB vendor chunk, an 86 kB motion chunk, render-blocking CSS and delayed rendering of the hero biography text. Corrected **only the local test server** to negotiate gzip for text assets and serve immutable asset cache headers. The production build bytes stayed unchanged between the two three-run series. Compression substantially reduced simulated FCP/LCP; the final median is 93, so no frontend performance refactor was made. This is local lab evidence, not a deployed Vercel result or field Core Web Vitals guarantee.

SEO 83 is reproduced in every run: `Sitemap: /sitemap.xml` is invalid as an absolute sitemap URL and the canonical lacks a configured domain. The local build does not itself enforce preview `noindex`; the deployed preview's robots meta/headers must be checked. Earlier memory claims of SEO 100 and universal preview noindex are not verified for this build/configuration.

## Vercel confirmation and push gate

Local `frontend/.vercel/project.json` points to **ankit-portfolio-frontend**, project `prj_wG3P1LPs1pLdIUvbp8DXziz16cp8`, team `team_AmoL7s3jGgDdkFZlXdLxXH7u`. This confirms the local CLI link, not its remote Git connection or Production Branch. No usable CLI authentication session was found; the in-app dashboard redirected to login.

The owner's supplied dashboard screenshot shows a **different project**, `portfolio`, at `vercel.com/ankit-singh-portfolio/portfolio`. It labels the deployment Production, shows source `main` / `9a3440f`, domain `portfolio-gamma-lake-83.vercel.app`, and explicitly says **“To update your Production Deployment, push to the main branch.”** That is direct evidence of Production Branch `main` for `portfolio` at the time of the screenshot. The repository remote is `https://github.com/ankitsingh7459/Portfolio.git`.

The owner's second screenshot shows `github.com/ankitsingh7459/Portfolio/tree/main/frontend`, with the same `9a3440f` commit, author `mayank3630` and “Fix frontend submodule” message. This strongly corroborates the Git association of the displayed `portfolio` deployment with this repository; it is an inference from matching deployment/repository evidence rather than a read of Vercel's Git settings.

**Push recommendation remains blocked by the project mismatch.** The Production Branch of the locally linked `ankit-portfolio-frontend` remains unverified. Confirm its Git connection and Production Branch, and whether additional projects deploy this repository. Do not assume `redesign/warm-terminal` creates only a preview. A push could trigger multiple connected projects; the local CLI link does not select which Git-triggered deployments occur.

## Remaining preview-only limitations

1. Remote project/repository connections and the linked project's Production Branch are unconfirmed.
2. Live admin/auth/database/contact/analytics integration and backend CORS remain unverified.
3. Admin 401 leaves an empty dashboard; automatic expiry handling is absent.
4. Canonical/sitemap domain configuration and deployed preview noindex need verification.
5. Deployed CSP/security headers, SPA refresh, Vercel environment variables and actual CDN performance remain unverified. The isolated static server does not implement Vercel's CSP header; this run does not claim deployed CSP validation.
6. PrintAPM stats, architecture details and product screenshots remain omitted pending verified owner content. The attached portfolio screenshots are real browser captures of this frontend with synthetic data.

## Evidence and reproduction

Evidence directory: `frontend/playwright-report/preview/` (ignored, retained locally):

- `desktop-viewport.png`, `mobile-viewport.png`: 1440 × 900 / 375 × 667 browser screenshots.
- `desktop.png`, `mobile.png`: full-page captures after scrolling to reveal each section.
- `mobile-navigation.png`, `mobile-command-palette.png`: actual open mobile surfaces.
- `mobile-navigation-axe.json`, `mobile-command-palette-axe.json`: full axe results, including incomplete checks needing human assessment.
- `admin-desktop-requests.json`, `admin-mobile-requests.json`: synthetic mutation payloads; `admin-failure-limitations.json`: separate error/session observations.
- `compressed-{1,2,3}.report.{json,html}`: final comparable Lighthouse series; `lighthouse-{1,2,3}.report.{json,html}`: retained uncompressed series; `before-focus-fix.report.{json,html}`: earlier diagnostic.
- `mock-api.jsonl`: local normal API statuses, never live traffic; `measurement-summary.json`: scores, settings, API status checks and build hashes.

From `frontend` in PowerShell:

```powershell
npm run build
node scripts/preview-check-server.mjs
# In another terminal:
$env:E2E_BASE_URL='http://127.0.0.1:4175'
npx playwright test e2e/preview-readiness.spec.js --project=mobile --project=desktop --retries=0
# Run each measurement sequentially, changing N to 1, 2, 3:
npx --yes lighthouse http://127.0.0.1:4175/ --chrome-flags="--headless --no-sandbox" --output=json --output=html --output-path=playwright-report/preview/compressed-N --quiet
```

Do not rerun performance measurements concurrently with browser tests. The fixture-backed focused tests also work with the existing Playwright production-build webServer when `E2E_BASE_URL` is unset.
