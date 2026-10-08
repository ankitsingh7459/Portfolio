# Security Requirements

- Secrets: nothing secret in frontend code. Only `VITE_API_URL` (public). `.env` ignored by git; `.env.example` committed.
- Repo: audit root junk files and git history for tokens/keys; rotate anything found.
- Backend CORS: allow only the production domain (and the preview URL temporarily during QA). VITE_API_URL is set in Vercel for Preview AND Production; backend FRONTEND_URL/CORS allows the preview and production origins.
- Contact: validate and length-limit on client and server; keep existing rate limiter; no HTML rendering of user input.
- Admin: JWT stays server-verified; admin credentials only via backend env vars; no credentials in frontend.
- Terminal: command input is treated as plain text, never evaluated or injected as HTML.
- Links: `rel="noopener noreferrer"` on external links.
- PrintAPM case study: no secrets, endpoints, internal IDs, customer data, or audit findings. Screenshots must have personal data blurred.
- Dependencies: run `npm audit` before release; no unused packages.
- Headers: add basic security headers in `vercel.json` (CSP, X-Content-Type-Options, Referrer-Policy) if compatible with fonts and API.
