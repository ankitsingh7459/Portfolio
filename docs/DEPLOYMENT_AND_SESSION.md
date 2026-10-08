# Deployment routing and admin session follow-up — 2026-10-08

This change preserves `ef42918dd58d69e6afe75908a3d93d762adb6f56` and adds a descendant commit. No backend changes, project relinking, remote settings changes, push, merge or deployment were performed. No broad audits or additional Lighthouse cycle were run.

## Read-only deployment evidence

- Git remote: `https://github.com/ankitsingh7459/Portfolio.git`.
- Read the live [GitHub main commit status](https://api.github.com/repos/ankitsingh7459/Portfolio/commits/main/status). Its SHA is `9a3440f4edc5f00ea5f87c1c1a9be85a4919ea27`. A successful status posted by the Vercel GitHub integration has context `Vercel`, description `Deployment has completed`, and target [portfolio deployment](https://vercel.com/ankit-singh-portfolio/portfolio/9YWUT2PdGxoSqgPFN84S9UwDgt3x). The status was created on 2026-06-07. This directly establishes a repository-to-project deployment association; it is stronger evidence than comparing project names or screenshots alone.
- The owner's project dashboard screenshot identifies **project `portfolio`, scope `ankit-singh-portfolio`, Production Branch `main`**. It explicitly says pushes to main update Production, and shows the matching source commit and production domain `portfolio-gamma-lake-83.vercel.app`.
- The live [remote branch list](https://api.github.com/repos/ankitsingh7459/Portfolio/branches?per_page=100) currently contains only `main`. There is no already-created `redesign/warm-terminal` branch or preview deployment from it to inspect.
- The local ignored `frontend/.vercel/project.json` links CLI commands to **`ankit-portfolio-frontend`**, project ID `prj_wG3P1LPs1pLdIUvbp8DXziz16cp8`, team ID `team_AmoL7s3jGgDdkFZlXdLxXH7u`. That file is not the selector for Git-triggered deployment. It was left unchanged.
- `frontend/vercel.json` has rewrites and response headers, with no `git.deploymentEnabled` or Git production-branch override. No custom checked-in GitHub workflow was found locally or at the remote `.github/workflows` path. GitHub shows platform-generated Pages checks on main; these are separate from the Vercel status and do not prove a non-main Pages deployment trigger.

According to [Vercel's GitHub deployment documentation](https://vercel.com/docs/git/vercel-for-github), Git integration deploys branch pushes by default; the configured Production Branch updates production while other branches receive previews. [Git deployment configuration](https://vercel.com/docs/project-configuration/git-configuration) can disable branch deployments. The expected target of a `redesign/warm-terminal` push for the identified project is therefore **Preview on `portfolio`**, rather than a CLI deployment to `ankit-portfolio-frontend`.

**Access limitation:** the available Codex in-app browser redirects both the project deployment and private Git settings to login, including after the owner reported being signed in. The owner may be using a separate Chrome session, which is not connected to the available browser tool. The current private Git connection, branch deployment overrides, Ignored Build Step and any additional project connections have not been directly read. The historical GitHub status plus owner screenshot establishes the known project/production branch, but does not prove there are no current overrides or additional projects. Do not describe preview execution as remotely verified until that access gap is resolved.

## Exact push recommendation

After the private project settings confirm the Git connection is still `ankitsingh7459/Portfolio`, Production Branch is `main`, and previews for `redesign/warm-terminal` are enabled, the intended command from the clean prepared branch is:

```powershell
git push -u origin HEAD:refs/heads/redesign/warm-terminal
```

This explicit refspec leaves `main` untouched and invokes the repository's Git integration. It does not use the local CLI project link. Do not run `vercel`, `vercel --prod`, push to `main`, or relink the CLI project as part of this recommendation. No push was performed. Until remote settings are confirmed, the command is conditional and preview creation remains expected behavior rather than an observed deployment outcome.

## Local admin session correction

- The existing backend middleware returns HTTP **401** for missing, invalid or expired JWTs. Its project GET route is public; merely loading projects is not a live token-validation probe. No backend code was edited.
- Frontend admin catches confirmed 401 responses while reading/refreshing or creating/updating/deleting projects. It removes `admin_token`, clears project/draft/edit state and login credentials, and returns to login with an accessible alert: **“Your session has expired or is invalid. Please sign in again.”**
- HTTP 403, network errors and 5xx responses do **not** clear the session. Existing failure alerts and draft retention remain in place. There is no speculative client expiry timer or invented token parsing.
- Explicit logout also clears stale admin form/project state.

## Focused regression evidence

- Added `src/pages/__tests__/Admin.test.jsx`: initial load, create, update, delete and post-mutation refresh each reproduced the missing 401 recovery before the fix (5 failures, 6 non-auth checks passed). All 11 pass after the fix.
- Six negative cases verify token retention on network, HTTP 500 and HTTP 403 errors during loading and saving.
- Updated the existing isolated browser failure scenario to require readable login recovery on 401 and continued login after reload, replacing the old empty-dashboard characterization.
- Lint, production build and release placeholder check pass. Full unit suite: **18 files / 122 tests passed**. Focused production-build admin browser suite: **3 passed, 1 mobile-inapplicable skip, zero failures** (successful CRUD on desktop/mobile; separate failure/recovery scenario on desktop).
- **Live backend integration remains unverified.** The earlier Lighthouse scores and screenshots in PREVIEW_READINESS.md describe the preserved `ef42918` preparation build, not a new audit of this follow-up build.
